// Importar datos de diputados por departamento
import amazonasRaw from './amazonas.json';
import ancashRaw from './ancash.json';
import apurimacRaw from './apurimac.json';
import arequipaRaw from './arequipa.json';
import ayacuchoRaw from './ayacucho.json';
import cajamarcaRaw from './cajamarca.json';
import callaoRaw from './callao.json';
import cuscoRaw from './cusco.json';
import huancavelicaRaw from './huancavelica.json';
import huanucoRaw from './huanuco.json';
import icaRaw from './ica.json';
import juninRaw from './junin.json';
import laLibertadRaw from './la-libertad.json';
import lambayequeRaw from './lambayeque.json';
import limaRaw from './lima.json';
import limaProvinciasRaw from './lima-provincias.json';
import loretoRaw from './loreto.json';
import madreDeDiosRaw from './madre-de-dios.json';
import moqueguaRaw from './moquegua.json';
import pascoRaw from './pasco.json';
import piuraRaw from './piura.json';
import punoRaw from './puno.json';
import sanMartinRaw from './san-martin.json';
import tacnaRaw from './tacna.json';
import tumbesRaw from './tumbes.json';
import ucayaliRaw from './ucayali.json';
import peruanosExtranjeroRaw from './peruanos-extranjero.json';

// Procesar datos crudos: filtrar INSCRITO y mapear campos
const procesar = (raw) => {
  const data = raw.data || raw;
  return (Array.isArray(data) ? data : [])
    .filter(c => c.strEstadoCandidato === 'INSCRITO')
    .map(c => ({
      idOrg: c.idOrganizacionPolitica,
      pos: c.intPosicion,
      nombre: `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
      dni: c.strDocumentoIdentidad,
      foto: c.strGuidFoto
    }));
};

export const diputados = {
  amazonas: procesar(amazonasRaw),
  ancash: procesar(ancashRaw),
  apurimac: procesar(apurimacRaw),
  arequipa: procesar(arequipaRaw),
  ayacucho: procesar(ayacuchoRaw),
  cajamarca: procesar(cajamarcaRaw),
  callao: procesar(callaoRaw),
  cusco: procesar(cuscoRaw),
  huancavelica: procesar(huancavelicaRaw),
  huanuco: procesar(huanucoRaw),
  ica: procesar(icaRaw),
  junin: procesar(juninRaw),
  'la-libertad': procesar(laLibertadRaw),
  lambayeque: procesar(lambayequeRaw),
  lima: procesar(limaRaw),
  'lima-provincias': procesar(limaProvinciasRaw),
  loreto: procesar(loretoRaw),
  'madre-de-dios': procesar(madreDeDiosRaw),
  moquegua: procesar(moqueguaRaw),
  pasco: procesar(pascoRaw),
  piura: procesar(piuraRaw),
  puno: procesar(punoRaw),
  'san-martin': procesar(sanMartinRaw),
  tacna: procesar(tacnaRaw),
  tumbes: procesar(tumbesRaw),
  ucayali: procesar(ucayaliRaw),
  'peruanos-extranjero': procesar(peruanosExtranjeroRaw),
};

export default diputados;
