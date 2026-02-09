import React from 'react';

const AlertTriangle = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-600 shrink-0"
    >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);

const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Función para ajustar el género de las explicaciones
const ajustarGenero = (texto, esFemenino) => {
    if (!esFemenino) return texto;

    // Mapeo selectivo de palabras que deben cambiar de género
    const cambios = [
        [/\bebri(o)\b/g, 'a'],
        [/\bsentenciado\b/ig, 'sentenciada'],
        [/\binteresado\b/ig, 'interesada'],
        [/\bafectado\b/ig, 'afectada'],
        [/\bdetenido\b/ig, 'detenida']
    ];

    let resultado = texto;
    cambios.forEach(([regex, reemplazo]) => {
        resultado = resultado.replace(regex, (match, group1) => {
            if (group1) return reemplazo; // Reemplaza solo el grupo capturado (ej. 'o' por 'a')
            return reemplazo; // Reemplaza la palabra completa
        });
    });

    return resultado;
};

// Mapeo para corregir errores ortográficos o de redacción en el texto original
const CORRECCIONES_TEXTO = {
    "ABONDO DE DESITNO": "ABANDONO DE DESTINO",
    "CONTRA LOS MEDIOS DE TRANSPORTES": "CONTRA LOS MEDIOS DE TRANSPORTE",
    "NEGOCIACION INCOMPATIBLE": "NEGOCIACIÓN INCOMPATIBLE",
    "COLUSION": "COLUSIÓN",
    "MALVERSACION DE FONDOS": "MALVERSACIÓN DE FONDOS",
    "CONCUSION": "CONCUSIÓN",
    "FALSEDAD IDEOLOGICA": "FALSEDAD IDEOLÓGICA",
    "REBELION": "REBELIÓN",
    "USURPACION": "USURPACIÓN",
    "INCUMPLIMIENTO OBLIGACIÓN ALIMENTARIA": "OMISIÓN DE ASISTENCIA FAMILIAR",
    "PELIGRO COMUN": "PELIGRO COMÚN",
    "CONDUCCION EN ESTA DE EBRIEDAD": "PELIGRO COMÚN",
    "CONDUCCION EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
    "CONDUCCIÓN EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
    "PELIGRO COMUN - CONDUCCION EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN"
};

const EXPLICACION_DELITOS = {
    "PECULADO": "robar dinero o bienes del estado",
    "COLUSIÓN": "ponerse de acuerdo con empresas para defraudar al estado",
    "NEGOCIACIÓN INCOMPATIBLE": "usar su cargo público para beneficiar sus propios negocios",
    "MALVERSACIÓN DE FONDOS": "gastar el dinero público en cosas distintas a las legales",
    "COHECHO": "recibir sobornos para favorecer a terceros",
    "TRAFICO DE INFLUENCIAS": "usar su poder para beneficiar a familiares o amigos",
    "LAVADO DE ACTIVOS": "ocultar dinero obtenido de actividades ilegales",
    "ESTELIONATO": "vender o empeñar propiedades que no le pertenecen (fraude)",
    "USURPACIÓN": "quitarle tierras o casas a otras personas de forma ilegal",
    "ENRIQUECIMIENTO ILICITO": "tener dinero que no puede justificar con su salario",
    "CONCUSIÓN": "cobrar dinero ilegalmente abusando de su cargo",
    "FALSEDAD GENERICA": "mentir en documentos o declaraciones oficiales",
    "FALSEDAD IDEOLÓGICA": "poner información falsa en documentos oficiales",
    "REBELIÓN": "levantarse en armas contra la constitución y el estado",
    "AGRESIONES EN CONTRA DE LAS MUJERES O INTEGRANTES DEL GRUPO FAMILIAR": "golpear o violentar a su pareja o familia",
    "OMISIÓN DE ASISTENCIA FAMILIAR": "negarse a pagar la pensión de alimentos de sus hijos",
    "PELIGRO COMÚN": "conducir ebrio o poner en riesgo la vida de terceros",
    "ABANDONO DE DESTINO": "abandonar su puesto de servicio militar o policial sin permiso",
    "CONTRA LOS MEDIOS DE TRANSPORTE": "dañar o bloquear el transporte público o las carreteras",
    "ESTAFA": "engañar a otros para quitarles su dinero o bienes",
    "LESIONES": "causar daño físico o heridas a otra persona",
    "DIFAMACIÓN": "inventar mentiras para dañar la reputación de alguien"
};

const JudicialAlert = ({ sentenciaPenal, sentenciaPenalDetalle = [], sexo = 'MASCULINO' }) => {
    if (!sentenciaPenal) return null;

    const esFemenino = sexo === 'FEMENINO';

    const delitosRaw = (sentenciaPenalDetalle || []).flatMap(d => {
        const text = (d.txDelitoPenal || d.txMateriaSentencia || "").toUpperCase().trim();
        return text.split(/[,.;]|\sY\s/).map(part => part.trim()).filter(Boolean);
    });

    const delitosProcesados = Array.from(new Set(delitosRaw)).map(original => {
        const corregido = CORRECCIONES_TEXTO[original] || original;
        const explicacion = EXPLICACION_DELITOS[corregido];

        const resultado = explicacion || corregido.toLowerCase();
        return capitalizeFirst(ajustarGenero(resultado, esFemenino));
    }).filter(Boolean);

    return (
        <div className="bg-amber-50 border-l-4 border-amber-600 p-2 mt-1 rounded-r-md shadow-sm">
            <div className="flex flex-col gap-1">
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-2">
                    <div className="w-3 flex justify-center shrink-0">
                        <AlertTriangle />
                    </div>
                    <span className="text-[10px] font-semibold text-amber-800 uppercase leading-none">
                        {esFemenino ? "SENTENCIADA PENALMENTE POR:" : "SENTENCIADO PENALMENTE POR:"}
                    </span>
                </div>

                {/* Crimes List: Bullet (aligned with icon) + Text (aligned with title) */}
                <div className="flex flex-col gap-1">
                    {delitosProcesados.length > 0 ? (
                        delitosProcesados.map((delito, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <div className="w-3 flex justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] text-amber-600 font-bold">•</span>
                                </div>
                                <span className="text-[10px] font-medium text-gray-700 leading-tight">
                                    {delito}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-start gap-2">
                            <div className="w-3 flex justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] text-amber-600 font-bold">•</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-700 leading-tight">
                                {esFemenino ? "Sentencias penales registradas" : "Sentencias penales registradas"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JudicialAlert;
