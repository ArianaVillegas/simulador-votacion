import { useState } from 'react';
import CedulaSufragio from './components/CedulaSufragio';
import ResumenVoto from './components/ResumenVoto';
import GuiaBicameralidad from './components/GuiaBicameralidad';

function App() {
  const [votos, setVotos] = useState({
    presidente: null,
    senadoresNacional: { partido: null, preferencial: ['', ''] },
    senadoresRegional: { partido: null, preferencial: [''] },
    diputados: { partido: null, preferencial: ['', ''] },
    parlamenAndino: { partido: null, preferencial: ['', ''] },
  });
  const [regionSeleccionada, setRegionSeleccionada] = useState('lima');
  const [mostrarResumenMobile, setMostrarResumenMobile] = useState(false);
  const handleVotoCompleto = (nuevosVotos) => setVotos(nuevosVotos);

  const handleReset = () => setVotos({
    presidente: null,
    senadoresNacional: { partido: null, preferencial: ['', ''] },
    senadoresRegional: { partido: null, preferencial: [''] },
    diputados: { partido: null, preferencial: ['', ''] },
    parlamenAndino: { partido: null, preferencial: ['', ''] },
  });

  const diasRestantes = Math.ceil((new Date('2026-04-12') - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-2">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Simulador de Votación</h1>
        <p className="text-sm text-slate-500">Elecciones Generales Perú 2026</p>
        <div className="inline-flex items-center gap-2 mt-2 bg-slate-700 text-white px-4 py-1 rounded text-sm">
          Faltan {diasRestantes} días para las elecciones
        </div>
      </header>

      <div className="flex gap-4 max-w-[1600px] mx-auto">
        <div className="flex-1">
          <CedulaSufragio onVotoCompleto={handleVotoCompleto} regionSeleccionada={regionSeleccionada} />
        </div>

        <div className="hidden xl:block w-80 shrink-0">
          <ResumenVoto votos={votos} onReset={handleReset} regionSeleccionada={regionSeleccionada} />
        </div>
      </div>

      <GuiaBicameralidad onRegionSeleccionada={setRegionSeleccionada} regionActual={regionSeleccionada} />

      <footer className="text-center mt-6 mb-16 xl:mb-6 text-xs text-gray-500">
        <p>Simulador educativo • Datos: <a href="https://votoinformado.jne.gob.pe" target="_blank" rel="noopener" className="text-blue-600 hover:underline">JNE Voto Informado</a></p>
      </footer>

      {/* Mobile: Botón fijo para votar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-lg">
        <button
          onClick={() => setMostrarResumenMobile(true)}
          className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
        >
          Ver Resumen y Votar
        </button>
      </div>

      {/* Mobile: Modal de resumen */}
      {mostrarResumenMobile && (
        <div className="xl:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Resumen de tu Voto</h2>
              <button onClick={() => setMostrarResumenMobile(false)} className="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
            </div>
            <div className="p-3">
              <ResumenVoto votos={votos} onReset={() => { handleReset(); setMostrarResumenMobile(false); }} regionSeleccionada={regionSeleccionada} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
