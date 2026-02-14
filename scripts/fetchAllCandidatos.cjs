#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";
const ID_PROCESO_ELECTORAL = 124;
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DELAY_MS = 3000; // Delay between requests to avoid rate limiting
const DELAY_JITTER = 2000; // Random extra delay (0-2s)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => DELAY_MS + Math.floor(Math.random() * DELAY_JITTER);

// Browser-like headers to avoid CAPTCHA
const BROWSER_HEADERS = '-H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept-Language: es-PE,es;q=0.9" -H "Referer: https://votoinformado.jne.gob.pe/"';

function curlGet(url) {
  try {
    const result = execSync(`curl -sk "${url}" ${BROWSER_HEADERS} -H "Accept: application/json"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(result);
  } catch (e) { return null; }
}

function curlPost(url, body) {
  try {
    fs.writeFileSync('/tmp/jne-body.json', JSON.stringify(body));
    const result = execSync(`curl -sk -X POST "${url}" ${BROWSER_HEADERS} -H "Content-Type: application/json" -H "Accept: application/json" -d @/tmp/jne-body.json`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(result);
  } catch (e) {
    console.error(` [CURL ERROR] ${e.message}`);
    return null;
  }
}

function buscarCandidato(dni) {
  const url = 'https://apiplataformaelectoral2.jne.gob.pe/api/v1/candidato';
  const body = { pageSize: 10, skip: 1, filter: { idProcesoElectoral: ID_PROCESO_ELECTORAL, numeroDocumento: dni } };
  const res = curlPost(url, body);
  return res?.data?.[0] || null;
}

function fetchHojaVida(idHojaVida) {
  const url = `https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?IdHojaVida=${idHojaVida}`;
  return curlGet(url);
}

function fetchResoluciones(idHojaVida) {
  const url = `https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/resoluciones?IdHojaVida=${idHojaVida}`;
  return curlGet(url);
}

function extractFlags(hoja) {
  const cargosEleccion = hoja.trayectoria?.cargoEleccion || [];
  const isCurrent = (c) => ['2025', '2026', 2025, 2026].includes(c.anioCargoElecHasta);
  return {
    congresistaActual: cargosEleccion.some(c => c.cargoEleccion?.includes('CONGRESISTA') && isCurrent(c)),
    exCongresista: cargosEleccion.some(c => c.cargoEleccion?.includes('CONGRESISTA') && !isCurrent(c)),
    exAlcalde: cargosEleccion.some(c => c.cargoEleccion?.includes('ALCALDE')),
    exGobernador: cargosEleccion.some(c => c.cargoEleccion?.includes('GOBERNADOR')),
    exMinistro: cargosEleccion.some(c => c.cargoEleccion?.includes('MINISTRO')),
    cargosAnteriores: cargosEleccion.map(c => `${c.cargoEleccion} (${c.anioCargoElecDesde}-${c.anioCargoElecHasta})`),
    sentenciaPenal: (hoja.sentenciaPenal?.length || 0) > 0,
    sentenciaPenalDetalle: hoja.sentenciaPenal || [],
    sentenciaObliga: (hoja.sentenciaObliga?.length || 0) > 0,
    sentenciaObligaDetalle: hoja.sentenciaObliga || []
  };
}

function extractResumen(hoja) {
  const edu = hoja.formacionAcademica;
  const posgrado = edu?.educacionPosgrado?.[0];
  const uni = edu?.educacionUniversitaria?.[0];
  const ingresos = hoja.declaracionJurada?.ingreso?.[0];
  return {
    educacionMax: posgrado?.txEspecialidadPosgrado || uni?.carreraUni || null,
    institucion: posgrado?.txCenEstudioPosgrado || uni?.universidad || null,
    ingresos2024: ingresos?.totalIngresos || 0,
    experienciaActual: hoja.experienciaLaboral?.[0]?.ocupacionProfesion || null
  };
}

function enrichCandidato(dni, pos = null) {
  try {
    const candidato = buscarCandidato(dni);
    if (!candidato) {
      console.error(` [SKIP] No candidate found for DNI ${dni}`);
      return null;
    }
    
    const hoja = fetchHojaVida(candidato.idHojaVida);
    if (!hoja?.datoGeneral) return null;
    const resoluciones = fetchResoluciones(candidato.idHojaVida);
    const general = hoja.datoGeneral;
    
    return {
      dni: general.numeroDocumento,
      idHojaVida: general.idHojaVida,
      idOrg: general.idOrganizacionPolitica,
      pos: pos,
      nombre: `${general.nombres} ${general.apellidoPaterno} ${general.apellidoMaterno}`,
      partido: general.organizacionPolitica,
      cargo: general.cargo,
      foto: JNE_FOTO + general.txNombreArchivo,
      estado: general.estado,
      fechaNacimiento: general.feNacimiento,
      lugarNacimiento: `${general.naciDistrito || ''}, ${general.naciProvincia || ''}`.replace(/^, |, $/g, ''),
      flags: extractFlags(hoja),
      resumen: extractResumen(hoja),
      trayectoria: hoja.trayectoria,
      formacionAcademica: hoja.formacionAcademica,
      experienciaLaboral: hoja.experienciaLaboral,
      declaracionJurada: hoja.declaracionJurada,
      sentenciaPenal: hoja.sentenciaPenal,
      sentenciaObliga: hoja.sentenciaObliga,
      resoluciones: resoluciones?.data || []
    };
  } catch (err) {
    console.error(`Error ${dni}:`, err.message);
    return null;
  }
}

async function processFile(inputFile, outputFile, dniField = 'strDocumentoIdentidad') {
  console.log(`\nProcessing: ${inputFile}`);
  const raw = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const candidates = raw.data || [];
  
  // Load existing enriched data to skip already fetched
  let existing = [];
  if (fs.existsSync(outputFile)) {
    const existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    existing = existingData.data || [];
  }
  const existingDnis = new Set(existing.map(c => c.dni));
  const toFetch = candidates.filter(c => !existingDnis.has(c[dniField]));
  
  console.log(`Found ${candidates.length} total, ${existing.length} already enriched, ${toFetch.length} to fetch`);
  
  if (toFetch.length === 0) {
    console.log('  All candidates already enriched, skipping.');
    return;
  }
  
  // Start with existing enriched data
  const enriched = [...existing];
  for (let i = 0; i < toFetch.length; i++) {
    const c = toFetch[i];
    const dni = c[dniField];
    const pos = c.intPosicion;
    process.stdout.write(`\r  [${i + 1}/${toFetch.length}] Fetching ${dni}...`);
    const data = enrichCandidato(dni, pos);
    if (data) enriched.push(data);
    await sleep(randomDelay());
  }
  
  const output = { fetchedAt: new Date().toISOString(), idProcesoElectoral: ID_PROCESO_ELECTORAL, count: enriched.length, data: enriched };
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n  Saved ${enriched.length} candidates to ${outputFile}`);
}

async function processDirectory(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  for (const file of files) {
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, file.replace('.json', '-enriched.json'));
    await processFile(inputFile, outputFile);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'all';
  const region = args[1] || null; // Optional region filter
  
  console.log('=== JNE Candidate Data Enrichment Script ===');
  console.log(`Type: ${type}${region ? `, Region: ${region}` : ''}\n`);
  
  if (type === 'presidenciales' || type === 'all') {
    const dnis = ["10001088","17903382","07845838","41265978","06466585","01211014","07246887","06280714","09177250","43287528","09871134","40728264","41904418","07867789","25681995","18141156","25331980","06002034","06506278","16002918","10266270","10219647","43632186","04411300","43409673","06529088","40799023","40139245","08587486","18870364","07260881","08263758","09307547","41373494","08058852","08255194"];
    const outputFile = path.join(DATA_DIR, 'candidatosPresidenciales-enriched.json');
    let existing = [];
    if (fs.existsSync(outputFile)) {
      existing = JSON.parse(fs.readFileSync(outputFile, 'utf8')).data || [];
    }
    const existingDnis = new Set(existing.map(c => c.dni));
    const toFetch = dnis.filter(d => !existingDnis.has(d));
    console.log(`\nProcessing: candidatosPresidenciales (${dnis.length} total, ${existing.length} already, ${toFetch.length} to fetch)`);
    if (toFetch.length === 0) {
      console.log('  All candidates already enriched, skipping.');
    } else {
      const enriched = [...existing];
      for (let i = 0; i < toFetch.length; i++) {
        process.stdout.write(`\r  [${i + 1}/${toFetch.length}] Fetching ${toFetch[i]}...`);
        const data = enrichCandidato(toFetch[i]);
        if (data) enriched.push(data);
        await sleep(randomDelay());
      }
      const output = { fetchedAt: new Date().toISOString(), idProcesoElectoral: ID_PROCESO_ELECTORAL, count: enriched.length, data: enriched };
      fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
      console.log(`\n  Saved ${enriched.length} candidates`);
    }
  }
  
  if (type === 'parlamenAndino' || type === 'all') {
    await processFile(
      path.join(DATA_DIR, 'parlamenAndino.json'),
      path.join(DATA_DIR, 'parlamenAndino-enriched.json')
    );
  }
  
  if (type === 'senadoresNacional' || type === 'all') {
    await processFile(
      path.join(DATA_DIR, 'senadoresNacional.json'),
      path.join(DATA_DIR, 'senadoresNacional-enriched.json')
    );
  }
  
  if (type === 'senadoresRegional' || type === 'all') {
    if (region) {
      const inputFile = path.join(DATA_DIR, 'senadoresRegional', `${region}.json`);
      const outputDir = path.join(DATA_DIR, 'senadoresRegional-enriched');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      await processFile(inputFile, path.join(outputDir, `${region}-enriched.json`));
    } else {
      await processDirectory(path.join(DATA_DIR, 'senadoresRegional'), path.join(DATA_DIR, 'senadoresRegional-enriched'));
    }
  }
  
  if (type === 'diputados' || type === 'all') {
    if (region) {
      const inputFile = path.join(DATA_DIR, 'diputados', `${region}.json`);
      const outputDir = path.join(DATA_DIR, 'diputados-enriched');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      await processFile(inputFile, path.join(outputDir, `${region}-enriched.json`));
    } else {
      await processDirectory(path.join(DATA_DIR, 'diputados'), path.join(DATA_DIR, 'diputados-enriched'));
    }
  }
  
  console.log('\n=== Done ===');
}

main().catch(console.error);
