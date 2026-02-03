import { useState } from 'react';
import { candidatosPresidenciales, partidosParlamentarios, JNE_LOGO } from '../data/candidatos';
import senadoresNacionalRaw from '../data/senadoresNacional.json';
import senadoresRegional from '../data/senadoresRegional';

// Procesar datos de senadores nacionales (filtrar INSCRITO y mapear campos)
const senadoresNacional = senadoresNacionalRaw.data
  .filter(c => c.strEstadoCandidato === 'INSCRITO')
  .map(c => ({
    idOrg: c.idOrganizacionPolitica,
    pos: c.intPosicion,
    nombre: `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
    dni: c.strDocumentoIdentidad,
    foto: c.strGuidFoto
  }));

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

  const handleVotoEspecial = (categoria, tipo) => {
    if (categoria === 'presidente') {
      handleVotoPresidente(tipo);
    } else {
      const actual = votos[categoria];
      const nuevoPartido = actual.partido === tipo ? null : tipo;
      const nuevosVotos = { ...votos, [categoria]: { partido: nuevoPartido, preferencial: actual.preferencial.map(() => '') } };
      setVotos(nuevosVotos);
      onVotoCompleto?.(nuevosVotos);
    }
  };

  const CandidatoCard = ({ candidato, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-2 border rounded cursor-pointer transition-all ${
        selected ? 'border-slate-700 bg-slate-50 ring-1 ring-slate-400' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2">
        {candidato.foto ? (
          <img src={candidato.foto} alt={candidato.nombre} className="w-10 h-10 rounded object-cover shrink-0" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div 
          className={`w-10 h-10 rounded items-center justify-center text-white font-bold text-xs shrink-0 ${candidato.foto ? 'hidden' : 'flex'}`}
          style={{ backgroundColor: candidato.color }}
        >
          {candidato.siglas}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs truncate">{candidato.nombre}</p>
          <div className="flex items-center gap-1">
            <p className="text-[10px] text-gray-600 truncate">{candidato.partido}</p>
            {candidato.hojaVida && (
              <a href={candidato.hojaVida} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800" title="Ver hoja de vida">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </a>
            )}
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
          selected ? 'border-slate-700 bg-slate-700' : 'border-slate-300'
        }`}>
          {selected && <span className="text-white text-xs">✓</span>}
        </div>
      </div>
    </div>
  );

  const PartidoCardConPreferencial = ({ partido, categoria, numPreferencial }) => {
    const voto = votos[categoria];
    const selected = voto.partido === partido.id;
    
    // Obtener datos de candidatos según categoría
    const getDatosCandidatos = () => {
      if (categoria === 'senadoresNacional') return senadoresNacional;
      if (categoria === 'senadoresRegional') return senadoresRegional[regionSeleccionada] || [];
      return [];
    };
    
    return (
      <div className={`p-2 border rounded transition-all ${
        selected ? 'border-slate-700 bg-slate-50 ring-1 ring-slate-400' : 'border-slate-200 bg-white'
      }`}>
        <div 
          onClick={() => handleVotoPartido(categoria, partido.id)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          {partido.idOrg ? (
            <img 
              src={`${JNE_LOGO}${partido.idOrg}`} 
              alt={partido.siglas}
              className="w-8 h-8 rounded object-contain shrink-0 bg-white border border-slate-200"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div 
            className={`w-8 h-8 rounded items-center justify-center text-white font-bold text-[10px] shrink-0 ${partido.idOrg ? 'hidden' : 'flex'}`}
            style={{ backgroundColor: partido.color }}
          >
            {partido.siglas}
          </div>
          <p className="text-xs font-medium truncate flex-1">{partido.nombre}</p>
          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
            selected ? 'border-slate-700 bg-slate-700' : 'border-slate-300'
          }`}>
            {selected && <span className="text-white text-[10px]">✓</span>}
          </div>
        </div>
        {selected && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1 justify-end items-center">
              <span className="text-[10px] text-gray-500">Nº Pref:</span>
              {voto.preferencial.slice(0, numPreferencial).map((val, i) => {
                const candidato = buscarCandidato(partido.idOrg, val, getDatosCandidatos());
                return (
                  <div key={i} className="flex flex-col items-center">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleVotoPreferencial(categoria, i, e.target.value)}
                      placeholder={`${i + 1}`}
                      className="w-10 h-6 text-center text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-500 focus:border-slate-500 focus:outline-none"
                      maxLength={3}
                    />
                    {candidato && (
                      <span className="text-[8px] text-green-700 font-medium mt-0.5 max-w-[60px] truncate" title={candidato.nombre}>
                        {candidato.nombre.split(' ').slice(0, 2).join(' ')}
                      </span>
                    )}
                    {val && !candidato && getDatosCandidatos().length > 0 && (
                      <span className="text-[8px] text-red-500 mt-0.5">No existe</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const VotoBlanco = ({ categoria }) => {
    const esPresidente = categoria === 'presidente';
    const valorActual = esPresidente ? votos.presidente : votos[categoria]?.partido;
    
    return (
      <button
        onClick={() => handleVotoEspecial(categoria, 'blanco')}
        className={`w-full py-2 px-2 text-xs rounded border transition-all mb-2 ${
          valorActual === 'blanco' ? 'border-slate-600 bg-slate-100 font-bold' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        VOTO EN BLANCO
      </button>
    );
  };

  const ColumnaHeader = ({ titulo, subtitulo, numPref }) => (
    <div className="bg-slate-700 text-white p-2 text-center">
      <h3 className="font-bold text-sm">{titulo}</h3>
      {subtitulo && <p className="text-[10px] opacity-90">{subtitulo}</p>}
      {numPref && <p className="text-[9px] opacity-75 mt-1">Voto preferencial: {numPref}</p>}
    </div>
  );

  const getVotoIndicator = (tabId) => {
    if (tabId === 'presidente') return votos.presidente ? '✓' : '';
    return votos[tabId]?.partido ? '✓' : '';
  };

  const renderColumnaContent = (categoria, titulo, subtitulo, numPref) => (
    <div className="flex flex-col h-full">
      <ColumnaHeader titulo={titulo} subtitulo={subtitulo} numPref={numPref} />
      <div className="p-2 flex-1 lg:overflow-y-auto lg:max-h-[600px] space-y-1">
        <VotoBlanco categoria={categoria} />
        {categoria === 'presidente' ? (
          candidatosPresidenciales.map((c) => (
            <CandidatoCard key={c.id} candidato={c} selected={votos.presidente === c.id} onClick={() => handleVotoPresidente(c.id)} />
          ))
        ) : (
          partidosParlamentarios.map((p) => (
            <PartidoCardConPreferencial key={p.id} partido={p} categoria={categoria} numPreferencial={numPref ? parseInt(numPref) : 2} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-7xl mx-auto">
      <div className="bg-slate-800 text-white p-3 text-center">
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
              className={`flex-1 min-w-[70px] py-2 px-1 text-[10px] font-medium transition-colors relative ${
                activeTab === tab.id ? 'bg-white text-slate-800 border-b-2 border-slate-700' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.short}
              {getVotoIndicator(tab.id) && <span className="ml-1 text-green-600">✓</span>}
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

      {/* Desktop: Grid de 5 columnas */}
      <div className="hidden lg:grid grid-cols-5 divide-x divide-gray-300">
        <div className="flex flex-col">
          {renderColumnaContent('presidente', 'PRESIDENTE', 'y Vicepresidentes', null)}
        </div>
        <div className="flex flex-col">
          {renderColumnaContent('senadoresNacional', 'SENADORES', 'Distrito Nacional', '2 opcionales')}
        </div>
        <div className="flex flex-col">
          {renderColumnaContent('senadoresRegional', 'SENADORES', 'Distrito Regional', '1 opcional')}
        </div>
        <div className="flex flex-col">
          {renderColumnaContent('diputados', 'DIPUTADOS', 'Distrito Regional', '2 opcionales')}
        </div>
        <div className="flex flex-col">
          {renderColumnaContent('parlamenAndino', 'PARLAMENTO', 'Andino', '2 opcionales')}
        </div>
      </div>

      <div className="bg-gray-100 p-3 text-center border-t">
        <p className="text-xs text-gray-600">
          Marque con una X o ✓ el partido de su preferencia. El voto preferencial es <strong>opcional</strong>: escriba el número del candidato.
        </p>
      </div>
    </div>
  );
}
