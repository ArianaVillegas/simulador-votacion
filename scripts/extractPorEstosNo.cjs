#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const js = fs.readFileSync('/tmp/porestosno.js', 'utf8');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Extract the congresista list
const listMatch = js.match(/\[\{[^[]*?"congresista_id":"[^"]+","nombre":"[^"]+"[^[]*?\}\]/);
const list = listMatch ? JSON.parse(listMatch[0]) : [];
console.log(`Found ${list.length} congresistas in list`);

// For each congresista, find their vote data by searching for their slug followed by JSON.parse
const allVotes = {};
let found = 0;
for (const c of list) {
  const slug = c.congresista_id;
  // Pattern: "slug",VAR="Name",VAR=JSON.parse('[...]')
  const escaped = slug.replace(/[-]/g, '\\-');
  const re = new RegExp(`"${escaped}",[^=]+=".+?",[^=]+=JSON\\.parse\\('(\\[.*?\\])'\\)`);
  const m = js.match(re);
  if (m) {
    try {
      allVotes[slug] = { nombre: c.nombre, votos: JSON.parse(m[1]) };
      found++;
    } catch (e) {
      console.error(`Parse error for ${slug}: ${e.message}`);
    }
  }
}

console.log(`Extracted votes for ${found}/${list.length} congresistas`);

// Sample
const first = Object.values(allVotes)[0];
if (first) {
  console.log(`\nSample (${first.nombre}): ${first.votos.length} votes`);
  console.log(JSON.stringify(first.votos[0], null, 2));
}

// Save
const outFile = path.join(DATA_DIR, 'porestosno.json');
fs.writeFileSync(outFile, JSON.stringify(allVotes, null, 2));
console.log(`\nSaved to ${outFile}`);
