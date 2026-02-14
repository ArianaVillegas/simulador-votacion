// Importar datos originales (tienen pos) y enriched (tienen estado actualizado)
import amazonasOrig from './amazonas.json';
import ancashOrig from './ancash.json';
import apurimacOrig from './apurimac.json';
import arequipaOrig from './arequipa.json';
import ayacuchoOrig from './ayacucho.json';
import cajamarcaOrig from './cajamarca.json';
import callaoOrig from './callao.json';
import cuscoOrig from './cusco.json';
import huancavelicaOrig from './huancavelica.json';
import huanucoOrig from './huanuco.json';
import icaOrig from './ica.json';
import juninOrig from './junin.json';
import laLibertadOrig from './la-libertad.json';
import lambayequeOrig from './lambayeque.json';
import limaOrig from './lima.json';
import limaProvinciasOrig from './lima-provincias.json';
import loretoOrig from './loreto.json';
import madreDeDiosOrig from './madre-de-dios.json';
import moqueguaOrig from './moquegua.json';
import pascoOrig from './pasco.json';
import piuraOrig from './piura.json';
import punoOrig from './puno.json';
import sanMartinOrig from './san-martin.json';
import tacnaOrig from './tacna.json';
import tumbesOrig from './tumbes.json';
import ucayaliOrig from './ucayali.json';
import peruanosExtranjeroOrig from './peruanos-extranjero.json';

import amazonasEnr from '../diputados-enriched/amazonas-enriched.json';
import ancashEnr from '../diputados-enriched/ancash-enriched.json';
import apurimacEnr from '../diputados-enriched/apurimac-enriched.json';
import arequipaEnr from '../diputados-enriched/arequipa-enriched.json';
import ayacuchoEnr from '../diputados-enriched/ayacucho-enriched.json';
import cajamarcaEnr from '../diputados-enriched/cajamarca-enriched.json';
import callaoEnr from '../diputados-enriched/callao-enriched.json';
import cuscoEnr from '../diputados-enriched/cusco-enriched.json';
import huancavelicaEnr from '../diputados-enriched/huancavelica-enriched.json';
import huanucoEnr from '../diputados-enriched/huanuco-enriched.json';
import icaEnr from '../diputados-enriched/ica-enriched.json';
import juninEnr from '../diputados-enriched/junin-enriched.json';
import laLibertadEnr from '../diputados-enriched/la-libertad-enriched.json';
import lambayequeEnr from '../diputados-enriched/lambayeque-enriched.json';
import limaEnr from '../diputados-enriched/lima-enriched.json';
import limaProvinciasEnr from '../diputados-enriched/lima-provincias-enriched.json';
import loretoEnr from '../diputados-enriched/loreto-enriched.json';
import madreDeDiosEnr from '../diputados-enriched/madre-de-dios-enriched.json';
import moqueguaEnr from '../diputados-enriched/moquegua-enriched.json';
import pascoEnr from '../diputados-enriched/pasco-enriched.json';
import piuraEnr from '../diputados-enriched/piura-enriched.json';
import punoEnr from '../diputados-enriched/puno-enriched.json';
import sanMartinEnr from '../diputados-enriched/san-martin-enriched.json';
import tacnaEnr from '../diputados-enriched/tacna-enriched.json';
import tumbesEnr from '../diputados-enriched/tumbes-enriched.json';
import ucayaliEnr from '../diputados-enriched/ucayali-enriched.json';
import peruanosExtranjeroEnr from '../diputados-enriched/peruanos-extranjero-enriched.json';

// Estados válidos para votar
export const ESTADOS_VALIDOS = ['INSCRITO', 'PUBLICADO PARA TACHAS', 'PUBLICADO'];

// Merge: datos originales (pos) + enriched (estado actualizado) por DNI
const procesar = (orig, enr) => {
  const origData = orig.data || orig;
  const enrData = enr.data || enr;
  const enrMap = new Map((enrData || []).map(c => [c.dni, c]));
  return (Array.isArray(origData) ? origData : []).map(c => {
    const enriched = enrMap.get(c.strDocumentoIdentidad);
    return {
      idOrg: c.idOrganizacionPolitica,
      pos: c.intPosicion,
      nombre: enriched?.nombre || `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
      dni: c.strDocumentoIdentidad,
      foto: enriched?.foto || c.strNombre || c.strGuidFoto,
      estado: enriched?.estado ?? c.strEstadoCandidato,
      votosProCrimen: enriched?.votosCongresoProCrimen || null
    };
  });
};

export const diputados = {
  amazonas: procesar(amazonasOrig, amazonasEnr),
  ancash: procesar(ancashOrig, ancashEnr),
  apurimac: procesar(apurimacOrig, apurimacEnr),
  arequipa: procesar(arequipaOrig, arequipaEnr),
  ayacucho: procesar(ayacuchoOrig, ayacuchoEnr),
  cajamarca: procesar(cajamarcaOrig, cajamarcaEnr),
  callao: procesar(callaoOrig, callaoEnr),
  cusco: procesar(cuscoOrig, cuscoEnr),
  huancavelica: procesar(huancavelicaOrig, huancavelicaEnr),
  huanuco: procesar(huanucoOrig, huanucoEnr),
  ica: procesar(icaOrig, icaEnr),
  junin: procesar(juninOrig, juninEnr),
  'la-libertad': procesar(laLibertadOrig, laLibertadEnr),
  lambayeque: procesar(lambayequeOrig, lambayequeEnr),
  lima: procesar(limaOrig, limaEnr),
  'lima-provincias': procesar(limaProvinciasOrig, limaProvinciasEnr),
  loreto: procesar(loretoOrig, loretoEnr),
  'madre-de-dios': procesar(madreDeDiosOrig, madreDeDiosEnr),
  moquegua: procesar(moqueguaOrig, moqueguaEnr),
  pasco: procesar(pascoOrig, pascoEnr),
  piura: procesar(piuraOrig, piuraEnr),
  puno: procesar(punoOrig, punoEnr),
  'san-martin': procesar(sanMartinOrig, sanMartinEnr),
  tacna: procesar(tacnaOrig, tacnaEnr),
  tumbes: procesar(tumbesOrig, tumbesEnr),
  ucayali: procesar(ucayaliOrig, ucayaliEnr),
  'peruanos-extranjero': procesar(peruanosExtranjeroOrig, peruanosExtranjeroEnr),
};

export default diputados;
