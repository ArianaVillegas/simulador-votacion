#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";
const ID_PROCESO_ELECTORAL = 124;
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DELAY_MS = 300;
const BATCH_SIZE = 5; // concurrent fetches

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch hoja de vida directly via browser (no CAPTCHA needed)
async function fetchHojaVida(page, idHojaVida) {
  return page.evaluate(async (id) => {
    const res = await fetch(`https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?IdHojaVida=${id}`);
    if (!res.ok) return null;
    return res.json();
  }, idHojaVida);
}

async function fetchResoluciones(page, idHojaVida) {
  return page.evaluate(async (id) => {
    const res = await fetch(`https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/resoluciones?IdHojaVida=${id}`);
    if (!res.ok) return null;
    return res.json();
  }, idHojaVida);
}

function extractFlags(hoja) {
  if (!hoja?.trayectoria) return {};
  const cargosEleccion = hoja.trayectoria.cargoEleccion || [];
  const isCurrent = (c) => ['2025', '2026', 2025, 2026].includes(c.anioCargoElecHasta);
  return {
    congresistaActual: cargosEleccion.some(c => c.cargoEleccion?.includes('CONGRESISTA') && isCurrent(c)),
    exCongresista: cargosEleccion.some(c => c.cargoEleccion?.includes('CONGRESISTA') && !isCurrent(c)),
    exAlcalde: cargosEleccion.some(c => c.cargoEleccion?.includes('ALCALDE')),
    exGobernador: cargosEleccion.some(c => c.cargoEleccion?.includes('GOBERNADOR')),
    exMinistro: (hoja.experienciaLaboral || []).some(e => e.cargo?.includes('MINISTRO')),
    sentenciaPenal: (hoja.sentenciaPenal || []).length > 0,
    sentenciaObliga: (hoja.sentenciaObliga || []).length > 0
  };
}

function extractResumen(hoja) {
  if (!hoja) return {};
  const educacion = hoja.formacionAcademica?.educacionUniversitaria || [];
  const maxEdu = educacion.sort((a, b) => (b.anioEgreso || 0) - (a.anioEgreso || 0))[0];
  return {
    educacionMaxima: maxEdu ? `${maxEdu.profesion || maxEdu.especialidad} - ${maxEdu.centroEstudios}` : null,
    ingresoTotal: hoja.declaracionJurada?.ingresoTotalAnual || 0,
    bienes: (hoja.declaracionJurada?.bienesInmuebles?.length || 0) + (hoja.declaracionJurada?.bienesMuebles?.length || 0)
  };
}

function enrichFromHoja(hoja, resoluciones) {
  if (!hoja?.datoGeneral) return null;
  const g = hoja.datoGeneral;
  return {
    dni: g.numeroDocumento,
    idHojaVida: g.idHojaVida,
    idOrg: g.idOrganizacionPolitica,
    pos: g.posicion,
    nombre: `${g.nombres} ${g.apellidoPaterno} ${g.apellidoMaterno}`,
    partido: g.organizacionPolitica,
    cargo: g.cargo,
    foto: JNE_FOTO + g.txNombreArchivo,
    estado: g.estado,
    fechaNacimiento: g.feNacimiento,
    lugarNacimiento: `${g.naciDistrito || ''}, ${g.naciProvincia || ''}`.replace(/^, |, $/g, ''),
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
}

// Collect all missing DNIs across files, returns { allMissing: Set, fileMap: Map<dni, {inputFile, outputFile, existing}> }
function collectMissing(configs) {
  const allMissing = new Set();
  const dniToFile = new Map(); // dni -> outputFile
  const fileExisting = new Map(); // outputFile -> existing[]

  for (const { inputFile, outputFile } of configs) {
    const raw = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const candidates = raw.data || [];
    let existing = [];
    if (fs.existsSync(outputFile)) {
      existing = JSON.parse(fs.readFileSync(outputFile, 'utf8')).data || [];
    }
    fileExisting.set(outputFile, existing);
    const existingDnis = new Set(existing.map(c => c.dni));
    let missing = 0;
    for (const c of candidates) {
      const dni = c.strDocumentoIdentidad;
      if (!existingDnis.has(dni)) {
        allMissing.add(dni);
        dniToFile.set(dni, outputFile);
        missing++;
      }
    }
    console.log(`  ${path.basename(inputFile)}: ${candidates.length} total, ${existing.length} enriched, ${missing} missing`);
  }

  return { allMissing, dniToFile, fileExisting };
}

async function scanAll(page, allMissing, dniToFile, fileExisting, startId, endId) {
  const remaining = new Set(allMissing);
  const totalMissing = remaining.size;
  let found = 0, scanned = 0;
  const total = endId - startId + 1;
  // Track new enriched data per output file
  const newData = new Map(); // outputFile -> enriched[]

  for (let id = startId; id <= endId && remaining.size > 0; id += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE && id + j <= endId; j++) batch.push(id + j);

    const results = await Promise.all(batch.map(async (hid) => {
      const hoja = await fetchHojaVida(page, hid);
      if (!hoja?.datoGeneral) return null;
      const dni = hoja.datoGeneral.numeroDocumento;
      if (!remaining.has(dni)) return null;
      const resoluciones = await fetchResoluciones(page, hid);
      return { hoja, resoluciones, dni };
    }));

    for (const r of results) {
      if (r) {
        const data = enrichFromHoja(r.hoja, r.resoluciones);
        if (data) {
          const outFile = dniToFile.get(r.dni);
          if (!newData.has(outFile)) newData.set(outFile, []);
          newData.get(outFile).push(data);
          remaining.delete(r.dni);
          found++;
        }
      }
    }

    scanned += batch.length;
    process.stdout.write(`\r  Scanned ${scanned}/${total} IDs, found ${found}/${totalMissing}, remaining ${remaining.size}   `);

    // Save progress every 200 IDs
    if (scanned % 200 < BATCH_SIZE) {
      saveAll(fileExisting, newData);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  saveAll(fileExisting, newData);
  console.log(`\n  Scan complete: found ${found}/${totalMissing}`);
}

function saveAll(fileExisting, newData) {
  for (const [outputFile, existing] of fileExisting) {
    const extra = newData.get(outputFile) || [];
    const all = [...existing, ...extra];
    const output = { fetchedAt: new Date().toISOString(), idProcesoElectoral: ID_PROCESO_ELECTORAL, count: all.length, data: all };
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  }
}

function getConfigs(type, region) {
  const configs = [];
  if (type === 'diputados' || type === 'all') {
    const inputDir = path.join(DATA_DIR, 'diputados');
    const outputDir = path.join(DATA_DIR, 'diputados-enriched');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const files = region ? [`${region}.json`] : fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));
    for (const f of files) configs.push({ inputFile: path.join(inputDir, f), outputFile: path.join(outputDir, f.replace('.json', '-enriched.json')) });
  }
  if (type === 'senadoresRegional' || type === 'all') {
    const inputDir = path.join(DATA_DIR, 'senadoresRegional');
    const outputDir = path.join(DATA_DIR, 'senadoresRegional-enriched');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const files = region ? [`${region}.json`] : fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));
    for (const f of files) configs.push({ inputFile: path.join(inputDir, f), outputFile: path.join(outputDir, f.replace('.json', '-enriched.json')) });
  }
  return configs;
}

async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'all';
  const region = args[1] || null;
  const startId = parseInt(args[2]) || 243000;
  const endId = parseInt(args[3]) || 256000;

  console.log('=== JNE Candidate Data Enrichment (Puppeteer + ID Scan) ===');
  console.log(`Type: ${type}, Region: ${region || 'all'}, ID range: ${startId}-${endId}\n`);

  const configs = getConfigs(type, region);
  console.log(`Collecting missing DNIs from ${configs.length} files...`);
  const { allMissing, dniToFile, fileExisting } = collectMissing(configs);
  console.log(`\nTotal missing across all files: ${allMissing.size}\n`);

  if (allMissing.size === 0) {
    console.log('All candidates already enriched!');
    return;
  }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://votoinformado.jne.gob.pe/', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Session established\n');

  try {
    await scanAll(page, allMissing, dniToFile, fileExisting, startId, endId);
  } finally {
    await browser.close();
  }

  console.log('\nDone!');
}

main().catch(console.error);
