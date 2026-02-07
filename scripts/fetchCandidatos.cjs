#!/usr/bin/env node
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";
const ID_PROCESO_ELECTORAL = 124;

// DNIs de candidatos presidenciales actuales
const dnisCandidatos = [
  "10001088", "17903382", "07845838", "41265978", "06466585", "01211014",
  "07246887", "06280714", "09177250", "43287528", "09871134", "40728264",
  "41904418", "07867789", "25681995", "18141156", "25331980", "06002034",
  "06506278", "16002918", "10266270", "10219647", "43632186", "04411300",
  "43409673", "06529088", "40799023", "40139245", "08587486", "18870364",
  "07260881", "08263758", "09307547", "41373494", "08058852", "08255194"
];

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options.headers },
      agent
    };
    
    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } 
        catch { reject(new Error(`Invalid JSON: ${data.slice(0, 100)}`)); }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function buscarCandidato(dni) {
  const url = 'https://apiplataformaelectoral2.jne.gob.pe/api/v1/candidato';
  const body = JSON.stringify({ pageSize: 10, skip: 1, filter: { idProcesoElectoral: ID_PROCESO_ELECTORAL, numeroDocumento: dni } });
  const res = await fetchJson(url, { method: 'POST', body });
  return res.data?.[0] || null;
}

async function fetchHojaVida(idHojaVida) {
  const url = `https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?IdHojaVida=${idHojaVida}`;
  return fetchJson(url);
}

function extractFlags(hoja) {
  const cargosEleccion = hoja.trayectoria?.cargoEleccion || [];
  const cargosAnteriores = cargosEleccion.map(c => `${c.cargoEleccion} (${c.anioCargoElecDesde}-${c.anioCargoElecHasta})`);
  
  return {
    exCongresista: cargosEleccion.some(c => c.cargoEleccion?.includes('CONGRESISTA')),
    exAlcalde: cargosEleccion.some(c => c.cargoEleccion?.includes('ALCALDE')),
    exGobernador: cargosEleccion.some(c => c.cargoEleccion?.includes('GOBERNADOR')),
    exMinistro: cargosEleccion.some(c => c.cargoEleccion?.includes('MINISTRO')),
    cargosAnteriores,
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

async function procesarCandidato(dni) {
  try {
    const candidato = await buscarCandidato(dni);
    if (!candidato) { console.error(`No encontrado: ${dni}`); return null; }
    
    const hoja = await fetchHojaVida(candidato.idHojaVida);
    const general = hoja.datoGeneral;
    
    return {
      dni: general.numeroDocumento,
      idHojaVida: general.idHojaVida,
      idOrg: general.idOrganizacionPolitica,
      nombre: general.nombres + ' ' + general.apellidoPaterno + ' ' + general.apellidoMaterno,
      partido: general.organizacionPolitica,
      cargo: general.cargo,
      foto: JNE_FOTO + general.txNombreArchivo,
      estado: general.estado,
      fechaNacimiento: general.feNacimiento,
      lugarNacimiento: `${general.naciDistrito}, ${general.naciProvincia}`,
      flags: extractFlags(hoja),
      resumen: extractResumen(hoja)
    };
  } catch (err) {
    console.error(`Error procesando ${dni}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`Procesando ${dnisCandidatos.length} candidatos...`);
  const candidatos = [];
  
  for (const dni of dnisCandidatos) {
    console.log(`Fetching ${dni}...`);
    const c = await procesarCandidato(dni);
    if (c) candidatos.push(c);
    await new Promise(r => setTimeout(r, 300)); // Rate limit
  }
  
  const output = { 
    fetchedAt: new Date().toISOString(),
    idProcesoElectoral: ID_PROCESO_ELECTORAL,
    count: candidatos.length,
    data: candidatos 
  };
  
  console.log(JSON.stringify(output, null, 2));
}

main().catch(console.error);
