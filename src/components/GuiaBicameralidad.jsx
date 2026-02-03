import { useState } from 'react';

export default function GuiaBicameralidad() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-20 lg:bottom-4 left-4 bg-slate-700 text-white px-4 py-2 rounded shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium z-40"
      >
        ¿Cómo votar?
      </button>

      {abierto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-700 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">Guía de Votación - Elecciones 2026</h2>
              <button onClick={() => setAbierto(false)} className="text-xl hover:opacity-70">✕</button>
            </div>

            <div className="p-5 space-y-5">
              <section>
                <h3 className="text-base font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">
                  El Congreso será Bicameral
                </h3>
                <p className="text-gray-600 text-sm">
                  Desde el 28 de julio de 2026, el Congreso de la República será <strong>Bicameral</strong>,
                  lo que implica que adicionalmente a los 130 diputados, votaremos por 60 senadores.
                </p>
              </section>

              <section className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm">Cámara de Senadores (60)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>30 nacionales:</strong> elegidos a nivel nacional</li>
                    <li>• <strong>30 regionales:</strong> elegidos en 27 distritos</li>
                    <li>• Lima Metropolitana elige 4 regionales</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Funciones:</p>
                    <ul className="text-xs text-gray-500 mt-1">
                      <li>• Revisar proyectos de ley</li>
                      <li>• Elegir altas autoridades</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm">Cámara de Diputados (130)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Elegidos en <strong>27 distritos electorales</strong></li>
                    <li>• Cada distrito elige representantes según población</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Funciones:</p>
                    <ul className="text-xs text-gray-500 mt-1">
                      <li>• Aprobar proyectos de ley</li>
                      <li>• Interpelar y censurar ministros</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-3 text-sm">Voto Preferencial (opcional)</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-slate-700">Senadores Nacional</p>
                    <p className="text-slate-800 font-bold">2 números</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-slate-700">Senadores Regional</p>
                    <p className="text-slate-800 font-bold">1 número</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-slate-700">Diputados</p>
                    <p className="text-slate-800 font-bold">2 números</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="font-medium text-slate-700">Parlamento Andino</p>
                    <p className="text-slate-800 font-bold">2 números</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Escribe el número del candidato de tu preferencia dentro del partido elegido.
                </p>
              </section>

              <section className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-3 text-sm">Fechas Importantes</h4>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 text-center bg-gray-50 rounded p-3">
                    <p className="text-2xl font-bold text-slate-700">12</p>
                    <p className="text-gray-700">Abril 2026</p>
                    <p className="text-xs text-gray-500">Primera vuelta</p>
                  </div>
                  <div className="flex-1 text-center bg-gray-50 rounded p-3">
                    <p className="text-2xl font-bold text-slate-700">7</p>
                    <p className="text-gray-700">Junio 2026</p>
                    <p className="text-xs text-gray-500">Segunda vuelta</p>
                  </div>
                </div>
              </section>

              <p className="text-xs text-gray-400 text-center">
                Fuente: <a href="https://eg2026.onpe.gob.pe/bicameralidad/" target="_blank" rel="noopener" className="text-slate-600 hover:underline">ONPE - Elecciones Generales 2026</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
