import amazonas from './amazonas-enriched.json';
import ancash from './ancash-enriched.json';
import apurimac from './apurimac-enriched.json';
import arequipa from './arequipa-enriched.json';
import ayacucho from './ayacucho-enriched.json';
import cajamarca from './cajamarca-enriched.json';
import callao from './callao-enriched.json';
import cusco from './cusco-enriched.json';
import huancavelica from './huancavelica-enriched.json';
import huanuco from './huanuco-enriched.json';
import ica from './ica-enriched.json';
import junin from './junin-enriched.json';
import laLibertad from './la-libertad-enriched.json';
import lambayeque from './lambayeque-enriched.json';
import lima from './lima-enriched.json';
import limaProvincias from './lima-provincias-enriched.json';
import loreto from './loreto-enriched.json';
import madreDeDios from './madre-de-dios-enriched.json';
import moquegua from './moquegua-enriched.json';
import pasco from './pasco-enriched.json';
import piura from './piura-enriched.json';
import puno from './puno-enriched.json';
import sanMartin from './san-martin-enriched.json';
import tacna from './tacna-enriched.json';
import tumbes from './tumbes-enriched.json';
import ucayali from './ucayali-enriched.json';
import peruanosExtranjero from './peruanos-extranjero-enriched.json';

const getList = (raw) => raw.data || raw || [];

export const diputadosEnrich = {
    amazonas: getList(amazonas),
    ancash: getList(ancash),
    apurimac: getList(apurimac),
    arequipa: getList(arequipa),
    ayacucho: getList(ayacucho),
    cajamarca: getList(cajamarca),
    callao: getList(callao),
    cusco: getList(cusco),
    huancavelica: getList(huancavelica),
    huanuco: getList(huanuco),
    ica: getList(ica),
    junin: getList(junin),
    'la-libertad': getList(laLibertad),
    lambayeque: getList(lambayeque),
    lima: getList(lima),
    'lima-provincias': getList(limaProvincias),
    loreto: getList(loreto),
    'madre-de-dios': getList(madreDeDios),
    moquegua: getList(moquegua),
    pasco: getList(pasco),
    piura: getList(piura),
    puno: getList(puno),
    'san-martin': getList(sanMartin),
    tacna: getList(tacna),
    tumbes: getList(tumbes),
    ucayali: getList(ucayali),
    'peruanos-extranjero': getList(peruanosExtranjero),
};

export default diputadosEnrich;
