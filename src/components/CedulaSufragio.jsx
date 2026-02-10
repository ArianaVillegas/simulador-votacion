import { useState } from 'react';
import { candidatosPresidenciales, partidosParlamentarios, JNE_LOGO } from '../data/candidatos';
import senadoresNacionalOrig from '../data/senadoresNacional.json';
import senadoresNacionalEnr from '../data/senadoresNacional-enriched.json';
import senadoresRegional, { ESTADOS_VALIDOS } from '../data/senadoresRegional';
import diputadosData from '../data/diputados';
import parlamenAndinoOrig from '../data/parlamenAndino.json';
import parlamenAndinoEnr from '../data/parlamenAndino-enriched.json';

// Merge: datos originales (pos) + enriched (estado actualizado) por DNI
const mergeDatos = (orig, enr) => {
  const enrMap = new Map((enr.data || []).map(c => [c.dni, c]));
  return (orig.data || []).map(c => {
    const enriched = enrMap.get(c.strDocumentoIdentidad);
    return {
      idOrg: c.idOrganizacionPolitica,
      pos: c.intPosicion,
      nombre: enriched?.nombre || `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
      dni: c.strDocumentoIdentidad,
      foto: enriched?.foto || c.strNombre || c.strGuidFoto,
      estado: enriched?.estado ?? c.strEstadoCandidato
    };
  });
};

const senadoresNacional = mergeDatos(senadoresNacionalOrig, senadoresNacionalEnr);
const parlamenAndino = mergeDatos(parlamenAndinoOrig, parlamenAndinoEnr);

// Función para buscar candidato por partido y número de posición
const buscarCandidato = (idOrg, posicion, datos) => {
  if (!posicion || !idOrg) return null;
  const pos = parseInt(posicion);
  if (isNaN(pos) || pos < 1) return null;
  return datos.find(c => c.idOrg === idOrg && c.pos === pos);
};

const TABS = [
  { id: 'presidente', label: 'Presidente', short: 'PRES' },
  { id: 'senadoresNacional', label: 'Sen. Nacional', short: 'SEN-N' },
  { id: 'senadoresRegional', label: 'Sen. Regional', short: 'SEN-R' },
  { id: 'diputados', label: 'Diputados', short: 'DIP' },
  { id: 'parlamenAndino', label: 'Parl. Andino', short: 'P.AND' },
];

const CandidatoCard = ({ candidato, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-[10px] p-[10px] border-b border-gray-300 min-h-[50px] cursor-pointer bg-white transition-opacity hover:opacity-90`}
  >
    <div className="w-[76px] text-left shrink-0">
      <h3 className="font-bold text-[9px] sm:text-[10px] uppercase leading-tight text-black break-words">
        {candidato.partido}
      </h3>
    </div>
    <div className="shrink-0">
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 border border-black flex items-center justify-center p-0.5 bg-white">
        {candidato.idOrg ? (
          <img
            src={`${JNE_LOGO}${candidato.idOrg}`}
            alt={candidato.siglas}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-[8px]"
            style={{ backgroundColor: candidato.color }}
          >
            {candidato.siglas}
          </div>
        )}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/20">
            <span className="text-2xl sm:text-3xl font-bold text-blue-900 leading-none" style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}>✕</span>
          </div>
        )}
      </div>
    </div>
    <div className="shrink-0">
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 border border-black overflow-hidden flex items-center justify-center bg-gray-50">
        {candidato.foto ? (
          <img
            src={candidato.foto}
            alt={candidato.nombre}
            className="w-full h-full object-cover grayscale-[30%]"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/20">
            <span className="text-2xl sm:text-3xl font-bold text-blue-900 leading-none" style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}>✕</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const PartidoCardConPreferencial = ({ partido, categoria, numPreferencial, voto, regionSeleccionada, onVotoPartido, onVotoPreferencial }) => {
  const selected = voto.partido === partido.id;

  const getDatosCandidatos = () => {
    if (categoria === 'senadoresNacional') return senadoresNacional;
    if (categoria === 'senadoresRegional') return senadoresRegional[regionSeleccionada] || [];
    if (categoria === 'diputados') return diputadosData[regionSeleccionada] || [];
    if (categoria === 'parlamenAndino') return parlamenAndino;
    return [];
  };

  return (
    <div className={`flex items-center gap-[10px] p-[10px] border-b border-gray-300 min-h-[50px] bg-white transition-opacity hover:opacity-90`}>
      <div
        className="w-[76px] text-left cursor-pointer shrink-0"
        onClick={() => onVotoPartido(categoria, partido.id)}
      >
        <h3 className="font-bold text-[9px] sm:text-[10px] uppercase leading-tight text-black break-words">
          {partido.nombre}
        </h3>
      </div>
      <div className="shrink-0 cursor-pointer" onClick={() => onVotoPartido(categoria, partido.id)}>
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 border border-black flex items-center justify-center p-0.5 bg-white">
          {partido.idOrg ? (
            <img
              src={`${JNE_LOGO}${partido.idOrg}`}
              alt={partido.siglas}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-[8px]"
              style={{ backgroundColor: partido.color }}
            >
              {partido.siglas}
            </div>
          )}
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/20">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900 leading-none" style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}>✕</span>
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 flex gap-[10px] items-center">
        {voto.preferencial.slice(0, numPreferencial).map((val, i) => {
          const candidato = selected && val ? buscarCandidato(partido.idOrg, val, getDatosCandidatos()) : null;
          const noExiste = selected && val && !candidato;
          const esValido = candidato && ESTADOS_VALIDOS.includes(candidato.estado);
          const enProceso = candidato && ['ADMITIDO', 'EN PROCESO DE TACHAS', 'PUBLICADO PARA TACHAS'].includes(candidato.estado);
          const esRechazado = candidato && !esValido && !enProceso;
          const getBorderClass = () => {
            if (!selected) return 'border-black';
            if (noExiste) return 'border-red-500 border-2';
            if (enProceso) return 'border-amber-500 border-2';
            if (esRechazado) return 'border-red-500 border-2';
            return 'border-black';
          };
          return (
            <div key={i} className="relative">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 border bg-white flex items-center justify-center ${getBorderClass()}`}>
                {selected ? (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onVotoPreferencial(categoria, i, e.target.value)}
                    className="w-full h-full text-center text-sm font-bold border-none focus:ring-0 p-0"
                    maxLength={3}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100/50 cursor-not-allowed" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ColumnaHeader = ({ titulo, subtitulo }) => (
  <div className="bg-slate-700 text-white p-2 text-center">
    <h3 className="font-bold text-sm">{titulo}</h3>
    {subtitulo && <p className="text-[10px] opacity-90">{subtitulo}</p>}
  </div>
);

export default function CedulaSufragio({ onVotoCompleto, regionSeleccionada = 'lima' }) {
  const [votos, setVotos] = useState({
    presidente: null,
    senadoresNacional: { partido: null, preferencial: ['', ''] },
    senadoresRegional: { partido: null, preferencial: [''] },
    diputados: { partido: null, preferencial: ['', ''] },
    parlamenAndino: { partido: null, preferencial: ['', ''] },
  });
  const [activeTab, setActiveTab] = useState('presidente');

  const handleVotoPresidente = (valor) => {
    const nuevo = votos.presidente === valor ? null : valor;
    const nuevosVotos = { ...votos, presidente: nuevo };
    setVotos(nuevosVotos);
    onVotoCompleto?.(nuevosVotos);
  };

  const handleVotoPartido = (categoria, partidoId) => {
    const actual = votos[categoria];
    const nuevoPartido = actual.partido === partidoId ? null : partidoId;
    const nuevosVotos = {
      ...votos,
      [categoria]: { ...actual, partido: nuevoPartido, preferencial: nuevoPartido ? actual.preferencial : actual.preferencial.map(() => '') }
    };
    setVotos(nuevosVotos);
    onVotoCompleto?.(nuevosVotos);
  };

  const handleVotoPreferencial = (categoria, index, valor) => {
    const actual = votos[categoria];
    const nuevoPref = [...actual.preferencial];
    nuevoPref[index] = valor.replace(/\D/g, '').slice(0, 3);
    const nuevosVotos = { ...votos, [categoria]: { ...actual, preferencial: nuevoPref } };
    setVotos(nuevosVotos);
    onVotoCompleto?.(nuevosVotos);
  };

  const getVotoIndicator = (tabId) => {
    if (tabId === 'presidente') return votos.presidente ? '✓' : '';
    return votos[tabId]?.partido ? '✓' : '';
  };

  const renderColumnaContent = (categoria, titulo, subtitulo, numPref) => (
    <div className="flex flex-col h-full w-fit">
      <ColumnaHeader titulo={titulo} subtitulo={subtitulo} />
      <div className="flex-1 lg:overflow-y-auto lg:max-h-[600px]">
        <div className="flex flex-col space-y-1 w-fit">
          {categoria === 'presidente' ? (
            candidatosPresidenciales.map((c) => (
              <CandidatoCard key={c.id} candidato={c} selected={votos.presidente === c.id} onClick={() => handleVotoPresidente(c.id)} />
            ))
          ) : (
            partidosParlamentarios.map((p) => (
              <PartidoCardConPreferencial key={p.id} partido={p} categoria={categoria} numPreferencial={numPref ? parseInt(numPref) : 2} voto={votos[categoria]} regionSeleccionada={regionSeleccionada} onVotoPartido={handleVotoPartido} onVotoPreferencial={handleVotoPreferencial} />
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-2xl rounded-lg mx-auto w-fit min-w-full">
      <div className="bg-slate-800 text-white p-3 text-center rounded-t-lg">
        <h1 className="text-xl font-semibold">CÉDULA DE SUFRAGIO</h1>
        <p className="text-sm text-slate-300">Elecciones Generales 2026 • 12 de abril</p>
      </div>

      {/* Mobile: Tabs */}
      <div className="lg:hidden">
        <div className="flex border-b border-slate-300 bg-slate-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[70px] py-2 px-1 text-[10px] font-medium transition-colors relative ${activeTab === tab.id ? 'bg-white text-slate-800 border-b-2 border-slate-700' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              {tab.short}
              {getVotoIndicator(tab.id) && <span className="ml-1 text-slate-700">✓</span>}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'presidente' && renderColumnaContent('presidente', 'PRESIDENTE', 'y Vicepresidentes', null)}
          {activeTab === 'senadoresNacional' && renderColumnaContent('senadoresNacional', 'SENADORES', 'Distrito Nacional', '2 opcionales')}
          {activeTab === 'senadoresRegional' && renderColumnaContent('senadoresRegional', 'SENADORES', 'Distrito Regional', '1 opcional')}
          {activeTab === 'diputados' && renderColumnaContent('diputados', 'DIPUTADOS', 'Distrito Regional', '2 opcionales')}
          {activeTab === 'parlamenAndino' && renderColumnaContent('parlamenAndino', 'PARLAMENTO', 'Andino', '2 opcionales')}
        </div>
      </div>

      {/* Desktop: 5 columnas tácticas con ancho dinámico (Margen 10px, simetría perfecta inicio/final, cero scroll interno) */}
      <div className="hidden lg:flex divide-x divide-gray-300 overflow-visible w-max">
        <div className="flex flex-col w-fit shrink-0 border-l border-gray-300 first:border-l-0">
          {renderColumnaContent('presidente', 'PRESIDENTE', 'y Vicepresidentes', null)}
        </div>
        <div className="flex flex-col w-fit shrink-0">
          {renderColumnaContent('senadoresNacional', 'SENADORES', 'Distrito Nacional', '2 opcionales')}
        </div>
        <div className="flex flex-col w-fit shrink-0">
          {renderColumnaContent('senadoresRegional', 'SENADORES', 'Distrito Regional', '1 opcional')}
        </div>
        <div className="flex flex-col w-fit shrink-0">
          {renderColumnaContent('diputados', 'DIPUTADOS', 'Distrito Regional', '2 opcionales')}
        </div>
        <div className="flex flex-col w-fit shrink-0">
          {renderColumnaContent('parlamenAndino', 'PARLAMENTO', 'Andino', '2 opcionales')}
        </div>
      </div>

      <div className="bg-gray-100 p-3 text-center border-t rounded-b-lg">
        <p className="text-xs text-gray-600">
          Marque con una X o ✓ el partido de su preferencia. El voto preferencial es <strong>opcional</strong>: escriba el número del candidato.
        </p>
      </div>
    </div>
  );
}
