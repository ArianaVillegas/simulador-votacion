import { useState } from 'react';
import { candidatosPresidenciales, partidosParlamentarios, JNE_LOGO } from '../data/candidatos';
import senadoresNacionalRaw from '../data/senadoresNacional.json';
import senadoresRegional from '../data/senadoresRegional';
import diputadosData from '../data/diputados';
import parlamenAndinoRaw from '../data/parlamenAndino.json';

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";

// Procesar senadores nacionales
const senadoresNacional = senadoresNacionalRaw.data
  .filter(c => c.strEstadoCandidato === 'INSCRITO')
  .map(c => ({
    idOrg: c.idOrganizacionPolitica,
    pos: c.intPosicion,
    nombre: `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
    dni: c.strDocumentoIdentidad,
    foto: c.strGuidFoto
  }));

// Procesar parlamento andino
const parlamenAndino = parlamenAndinoRaw.data
  .filter(c => c.strEstadoCandidato === 'INSCRITO')
  .map(c => ({
    idOrg: c.idOrganizacionPolitica,
    pos: c.intPosicion,
    nombre: `${c.strNombres} ${c.strApellidoPaterno} ${c.strApellidoMaterno}`.trim(),
    dni: c.strDocumentoIdentidad,
    foto: c.strGuidFoto
  }));

// Buscar candidato por partido y posición
const buscarCandidato = (idOrg, posicion, datos) => {
  if (!posicion || !idOrg) return null;
  const pos = parseInt(posicion);
  if (isNaN(pos) || pos < 1) return null;
  return datos.find(c => c.idOrg === idOrg && c.pos === pos);
};

export default function ResumenVoto({ votos, onReset, onVotar, regionSeleccionada = 'lima' }) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [votoRegistrado, setVotoRegistrado] = useState(false);

  const getSeleccionPresidente = () => {
    const valor = votos.presidente;
    if (valor === 'blanco') return { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—' };
    if (valor === 'nulo') return { nombre: 'VOTO NULO', color: '#EF4444', siglas: '✕' };
    if (valor === null) return { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—' };
    return candidatosPresidenciales.find(i => i.id === valor) || { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—' };
  };

  const getSeleccionPartido = (categoria) => {
    const voto = votos[categoria];
    if (!voto) return { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—', preferencial: [], candidatos: [] };
    const valor = voto.partido;
    if (valor === 'blanco') return { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—', preferencial: [], candidatos: [] };
    if (valor === 'nulo') return { nombre: 'VOTO NULO', color: '#EF4444', siglas: '✕', preferencial: [], candidatos: [] };
    if (valor === null) return { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—', preferencial: [], candidatos: [] };

    const item = partidosParlamentarios.find(i => i.id === valor);
    const prefFiltrados = voto.preferencial.filter(p => p);

    // Buscar candidatos por número preferencial
    let datos = [];
    if (categoria === 'senadoresNacional') datos = senadoresNacional;
    else if (categoria === 'senadoresRegional') datos = senadoresRegional[regionSeleccionada] || [];
    else if (categoria === 'diputados') datos = diputadosData[regionSeleccionada] || [];
    else if (categoria === 'parlamenAndino') datos = parlamenAndino;

    const candidatos = prefFiltrados.map(num => {
      const c = buscarCandidato(item?.idOrg, num, datos);
      return c ? { ...c, hojaVida: `https://votoinformado.jne.gob.pe/hoja-vida/${item.idOrg}/${c.dni}` } : null;
    }).filter(Boolean);

    return { ...(item || { nombre: 'VOTO EN BLANCO', color: '#9CA3AF', siglas: '—' }), preferencial: prefFiltrados, candidatos };
  };

  const presidente = getSeleccionPresidente();
  const senadoresNac = getSeleccionPartido('senadoresNacional');
  const senadoresReg = getSeleccionPartido('senadoresRegional');
  const diputados = getSeleccionPartido('diputados');
  const parlamento = getSeleccionPartido('parlamenAndino');

  const tieneAlgunVoto = votos.presidente !== null ||
    votos.senadoresNacional?.partido !== null ||
    votos.senadoresRegional?.partido !== null ||
    votos.diputados?.partido !== null ||
    votos.parlamenAndino?.partido !== null;
  
  const votosCompletos = votos.presidente !== null &&
    votos.senadoresNacional?.partido !== null &&
    votos.senadoresRegional?.partido !== null &&
    votos.diputados?.partido !== null &&
    votos.parlamenAndino?.partido !== null;

  const handleVotar = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarVoto = () => {
    setMostrarConfirmacion(false);
    setVotoRegistrado(true);
    onVotar?.();
  };

  const ResumenItem = ({ titulo, seleccion, compact = false }) => (
    <div className={`${compact ? 'p-2' : 'p-3'} bg-white rounded-lg shadow-sm`}>
      <div className="flex items-center gap-2">
        {seleccion.idOrg ? (
          <img
            src={`${JNE_LOGO}${seleccion.idOrg}`}
            alt={seleccion.siglas}
            className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-contain shrink-0 bg-white border border-slate-200`}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className={`${compact ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'} rounded-full items-center justify-center text-white font-bold shrink-0 ${seleccion.idOrg ? 'hidden' : 'flex'}`}
          style={{ backgroundColor: seleccion.color }}
        >
          {seleccion.siglas || '—'}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-gray-500`}>{titulo}</p>
          <p className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} truncate`}>{seleccion.partido || seleccion.nombre}</p>
        </div>
      </div>

      {/* Mostrar Candidato Presidencial (si tiene foto definida en el objeto principal) */}
      {seleccion.foto && (
        <div className="mt-2 space-y-1 pl-2 border-l-2 border-slate-200 ml-4">
          <div className="flex items-center gap-2">
            <img
              src={seleccion.foto}
              alt={seleccion.nombre}
              className="w-6 h-6 rounded-full object-cover shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate">{seleccion.nombre}</p>
              <a
                href={seleccion.hojaVida}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-blue-600 hover:underline"
              >
                Ver hoja de vida
              </a>
            </div>
          </div>
        </div>
      )}

      {seleccion.candidatos?.length > 0 && (
        <div className="mt-2 space-y-1 pl-2 border-l-2 border-slate-200 ml-4">
          {seleccion.candidatos.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <img
                src={`${JNE_FOTO}${c.foto}.jpg`}
                alt={c.nombre}
                className="w-6 h-6 rounded-full object-cover shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate">{c.nombre}</p>
                <a
                  href={c.hojaVida}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-blue-600 hover:underline"
                >
                  Ver hoja de vida
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      {seleccion.preferencial?.length > 0 && !seleccion.candidatos?.length && (
        <p className="text-[10px] text-slate-500 mt-1 ml-12">Pref: {seleccion.preferencial.join(', ')}</p>
      )}
    </div>
  );

  if (votoRegistrado) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow text-center">
        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">✓</div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Voto Registrado</h3>
        <p className="text-gray-500 text-sm mb-4">Tu voto simulado ha sido registrado.</p>
        <div className="space-y-2 text-left mb-4">
          <ResumenItem titulo="Presidente" seleccion={presidente} compact />
          <ResumenItem titulo="Senadores Nac." seleccion={senadoresNac} compact />
          <ResumenItem titulo="Senadores Reg." seleccion={senadoresReg} compact />
          <ResumenItem titulo="Diputados" seleccion={diputados} compact />
          <ResumenItem titulo="Parl. Andino" seleccion={parlamento} compact />
        </div>
        <button onClick={() => { setVotoRegistrado(false); onReset(); }} className="w-full py-2 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium text-sm">
          Votar de nuevo
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow">
        <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          Resumen de tu Voto
          {votosCompletos && <span className="text-green-600 text-xs font-normal">✓ Completo</span>}
        </h3>

        <div className="space-y-2">
          <ResumenItem titulo="Presidente" seleccion={presidente} />
          <ResumenItem titulo="Senadores Nacional" seleccion={senadoresNac} />
          <ResumenItem titulo="Senadores Regional" seleccion={senadoresReg} />
          <ResumenItem titulo="Diputados" seleccion={diputados} />
          <ResumenItem titulo="Parlamento Andino" seleccion={parlamento} />
        </div>

        {!votosCompletos && (
          <p className="text-xs text-amber-600 mt-3 text-center">⚠️ Las categorías sin selección se contarán como voto en blanco</p>
        )}

        <div className="flex gap-2 mt-3">
          <button onClick={onReset} className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-medium text-sm transition-colors text-slate-700">
            Reiniciar
          </button>
          <button
            onClick={handleVotar}
            className="flex-1 py-2 px-3 rounded font-medium text-sm transition-colors bg-slate-700 hover:bg-slate-800 text-white"
          >
            VOTAR
          </button>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center border-b border-slate-100 pb-3">Confirmar tu voto</h3>
            <div className="space-y-2 mb-5">
              <ResumenItem titulo="Presidente" seleccion={presidente} compact />
              <ResumenItem titulo="Senadores Nac." seleccion={senadoresNac} compact />
              <ResumenItem titulo="Senadores Reg." seleccion={senadoresReg} compact />
              <ResumenItem titulo="Diputados" seleccion={diputados} compact />
              <ResumenItem titulo="Parl. Andino" seleccion={parlamento} compact />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMostrarConfirmacion(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-medium text-slate-700">
                Cancelar
              </button>
              <button onClick={confirmarVoto} className="flex-1 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
