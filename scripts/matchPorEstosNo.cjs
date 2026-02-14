#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'data');
const porEstosNo = require(path.join(BASE, 'porestosno.json'));

// Normalize name: remove accents, lowercase, trim
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Build lookup: normalized "APELLIDO1 APELLIDO2, NOMBRES" -> slug
// porestosno format: "Acuña Peralta, María Grimaneza"
// enriched format: "MARIA GRIMANEZA ACUÑA PERALTA" (NOMBRES APELLIDO1 APELLIDO2)
const porMap = new Map();
for (const [slug, data] of Object.entries(porEstosNo)) {
  const norm = normalize(data.nombre);
  porMap.set(norm, { slug, ...data });
  // Also index by just apellidos for fuzzy matching
  const parts = norm.split(',');
  if (parts.length === 2) {
    const apellidos = parts[0].trim();
    porMap.set(apellidos, { slug, ...data });
  }
}

// Manual overrides for names that don't match automatically
const MANUAL = {
  'GLADYS MARGOT ECHAIZ RAMOS VDA DE NUÑEZ': 'echaiz-de-nunez-izaga-gladys-m'
};

// Convert enriched name "NOMBRES APELLIDO1 APELLIDO2" to "apellido1 apellido2, nombres"
function toPorestosnoFormat(name) {
  const parts = normalize(name).split(/\s+/);
  if (parts.length < 3) return normalize(name);
  // Try all possible splits: first N words are nombres, rest are apellidos
  const candidates = [];
  for (let i = 1; i < parts.length; i++) {
    const nombres = parts.slice(0, i).join(' ');
    const apellidos = parts.slice(i).join(' ');
    candidates.push(`${apellidos}, ${nombres}`);
  }
  return candidates;
}

function matchCongresista(name) {
  // Check manual overrides first
  if (MANUAL[name]) {
    const slug = MANUAL[name];
    const data = porEstosNo[slug];
    if (data) return { slug, ...data };
  }
  const candidates = toPorestosnoFormat(name);
  if (!Array.isArray(candidates)) return porMap.get(candidates) || null;
  for (const c of candidates) {
    if (porMap.has(c)) return porMap.get(c);
  }
  for (const c of candidates) {
    const apellidos = c.split(',')[0].trim();
    if (porMap.has(apellidos)) return porMap.get(apellidos);
  }
  return null;
}

// Process all enriched files
let matched = 0, unmatched = 0;
const unmatchedNames = [];

function processFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;
  for (const c of (data.data || [])) {
    if (!c.flags?.congresistaActual) continue;
    const match = matchCongresista(c.nombre);
    if (match) {
      c.votosCongresoProCrimen = match.votos;
      c.porestosnoSlug = match.slug;
      matched++;
      changed = true;
    } else {
      unmatched++;
      unmatchedNames.push(c.nombre);
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

// Process all enriched dirs and files
for (const dir of ['diputados-enriched', 'senadoresRegional-enriched']) {
  const p = path.join(BASE, dir);
  if (!fs.existsSync(p)) continue;
  for (const f of fs.readdirSync(p).filter(f => f.endsWith('-enriched.json'))) {
    processFile(path.join(p, f));
  }
}
for (const f of ['senadoresNacional-enriched.json', 'parlamenAndino-enriched.json', 'presidenciales-enriched.json']) {
  const fp = path.join(BASE, f);
  if (fs.existsSync(fp)) processFile(fp);
}

console.log(`Matched: ${matched}, Unmatched: ${unmatched}`);
if (unmatchedNames.length) {
  console.log('\nUnmatched congressmen:');
  unmatchedNames.forEach(n => console.log('  ', n));
}
