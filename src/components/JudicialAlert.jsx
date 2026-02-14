import React from 'react';

const AlertTriangle = ({ className }) => (
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
        className={`shrink-0 ${className}`}
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
    "PELIGRO COMUN - CONDUCCION EN ESTADO DE EBRIEDAD": "PELIGRO COMÚN",
    "MUJES": "MUJERES",
    "AGRECIONES": "AGRESIONES",
    "AGRESION": "AGRESIONES",
    "FRAUDE EN LA ADM. DE LAS PERSONAS JURIDICAS": "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS",
    "FRAUDE EN LA ADM. DE PERSONAS JURIDICAS": "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS",
    "FRAUDE EN LA ADM": "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS"
};

const EXPLICACION_DELITOS = {
    "PECULADO": "robar dinero de los ciudadanos (corrupción)",
    "PECULADO DOLOSO": "robar intencionalmente dinero de los ciudadanos (corrupción)",
    "PECULADO CULPOSO": "permitir el robo de fondos públicos por negligencia inexcusable (corrupción)",
    "PECULADO POR EXTENSIÓN": "actuar como cómplice en el robo de fondos del estado (corrupción)",
    "PECULADO DE EXTENSIÓN": "actuar como cómplice en el robo de fondos del estado (corrupción)",
    "COLUSIÓN": "pactar ilegalmente con empresas para defraudar al estado (corrupción)",
    "NEGOCIACIÓN INCOMPATIBLE": "usar su cargo para favorecer sus propios negocios (corrupción)",
    "MALVERSACIÓN DE FONDOS": "desviar dinero público a fines ilegales (corrupción)",
    "COHECHO": "recibir sobornos para favorecer a terceros (corrupción)",
    "TRAFICO DE INFLUENCIAS": "vender favores para beneficiar a terceros (corrupción)",
    "LAVADO DE ACTIVOS": "blanquear u ocultar dinero ilegal",
    "ESTELIONATO": "vender o empeñar propiedades ajenas mediante engaño",
    "USURPACIÓN": "arrebatar tierras o casas de forma ilegal",
    "ENRIQUECIMIENTO ILICITO": "tener un patrimonio injustificable (corrupción)",
    "CONCUSIÓN": "exigir cobros ilegales abusando de su cargo (corrupción)",
    "FALSEDAD GENERICA": "mentir o engañar en declaraciones oficiales",
    "FALSEDAD IDEOLÓGICA": "insertar información falsa en documentos públicos",
    "REBELIÓN": "alzarse en armas contra la constitución",
    "AGRESIONES EN CONTRA DE LAS MUJERES O INTEGRANTES DEL GRUPO FAMILIAR": "agredir a mujeres o integrantes del grupo familiar",
    "OMISIÓN DE ASISTENCIA FAMILIAR": "no cumplir con pagos de pensión de alimentos, obligación económica destinada al cuidado y bienestar de sus hijos/as",
    "PELIGRO COMÚN": "conducir ebrio poniendo en riesgo la vida de otros",
    "ABANDONO DE DESTINO": "desertar de su puesto de servicio",
    "CONTRA LOS MEDIOS DE TRANSPORTE": "atacar o bloquear el transporte público",
    "CONTRA EL PATRIMONIO": "atentar contra la propiedad y el patrimonio",
    "FRAUDE EN LA ADMINISTRACIÓN DE PERSONAS JURÍDICAS": "perpetrar fraude en la administración de empresas o entes jurídicos (corrupción)",
    "ESTAFA": "ejecutar estafas para apoderarse de dinero o bienes ajenos"
};

const EXPLICACION_CIVILES = {
    "FAMILIA / ALIMENTARIA": "no cumplir con pagos de pensión de alimentos, obligación económica destinada al cuidado y bienestar de sus hijos/as",
    "LABORAL": "no pagar deudas laborales a sus trabajadores",
    "CIVIL": "incumplimiento inexcusable de deudas",
    "CONTRACTUAL": "no respetar sus compromisos o contratos",
    "INDEMNIZACIÓN": "negarse a pagar reparaciones económicas ordenadas por ley"
};

const JudicialAlert = ({
    sentenciaPenal,
    sentenciaPenalDetalle = [],
    sentenciaObliga,
    sentenciaObligaDetalle = [],
    sexo = 'MASCULINO'
}) => {
    if (!sentenciaPenal && !sentenciaObliga) return null;

    const esFemenino = sexo === 'FEMENINO';

    const renderSegment = (titulo, detalles, mapping, theme, esPenal = true) => {
        if (!detalles || detalles.length === 0) return null;

        const itemsRaw = detalles.flatMap(d => {
            const text = (esPenal ? d.txDelitoPenal : (d.txMateriaSentencia || d.txFalloObliga) || "").toUpperCase().trim();
            // Evitamos separar por puntos para no romper abreviaturas como "ADM."
            return text.split(/[,;]|\sY\s/).map(part => part.trim()).filter(Boolean);
        });

        const itemsProcesados = Array.from(new Set(itemsRaw)).map(original => {
            const corregido = CORRECCIONES_TEXTO[original] || original;

            let explicacion = mapping[corregido];

            // Fuzzy match para tipos de PECULADO y AGRESIONES
            if (esPenal && !explicacion) {
                const upperC = corregido.toUpperCase();

                // Prioridad a peculados específicos
                if (upperC.includes("PECULADO DOLOSO")) {
                    explicacion = EXPLICACION_DELITOS["PECULADO DOLOSO"];
                } else if (upperC.includes("PECULADO CULPOSO")) {
                    explicacion = EXPLICACION_DELITOS["PECULADO CULPOSO"];
                } else if (upperC.includes("PECULADO POR EXTENSIÓN") || upperC.includes("PECULADO DE EXTENSIÓN")) {
                    explicacion = EXPLICACION_DELITOS["PECULADO POR EXTENSIÓN"];
                } else if (upperC.includes("PECULADO")) {
                    explicacion = EXPLICACION_DELITOS["PECULADO"];
                } else if (upperC.includes("AGRESIONES") || upperC.includes("AGREDIR") || upperC.includes("MUJERES") || upperC.includes("MUJES")) {
                    explicacion = EXPLICACION_DELITOS["AGRESIONES EN CONTRA DE LAS MUJERES O INTEGRANTES DEL GRUPO FAMILIAR"];
                }
            }

            const resultado = explicacion || corregido.toLowerCase();
            return capitalizeFirst(ajustarGenero(resultado, esFemenino));
        }).filter(Boolean);

        const { bg, border, text, bullet, icon } = theme;

        return (
            <div className={`${bg} border-l-4 ${border} p-2 rounded-r-md shadow-sm`}>
                <div className="flex flex-col gap-1">
                    {/* Header: Icon + Title */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 flex justify-center shrink-0">
                            <AlertTriangle className={icon} />
                        </div>
                        <span className={`text-[8.5px] font-bold ${text} uppercase leading-none`}>
                            {titulo}
                        </span>
                    </div>

                    {/* List: Bullet + Text */}
                    <div className="flex flex-col gap-1">
                        {itemsProcesados.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <div className="w-3 flex justify-center shrink-0 mt-[1px]">
                                    <span className={`text-[10px] ${bullet} font-bold leading-none`}>•</span>
                                </div>
                                <span className="text-[10px] font-medium text-gray-700 leading-tight">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const penalTheme = {
        bg: 'bg-red-50',
        border: 'border-red-600',
        text: 'text-red-800',
        bullet: 'text-red-600',
        icon: 'text-red-600'
    };

    const civilTheme = {
        bg: 'bg-amber-50',
        border: 'border-amber-600',
        text: 'text-amber-800',
        bullet: 'text-amber-600',
        icon: 'text-amber-600'
    };

    const tituloPenal = esFemenino ? "SENTENCIADA PENALMENTE POR:" : "SENTENCIADO PENALMENTE POR:";
    const tituloCivil = esFemenino ? "SENTENCIADA EN DEMANDAS CIVILES POR:" : "SENTENCIADO EN DEMANDAS CIVILES POR:";

    return (
        <div className="space-y-1.5 mt-1">
            {sentenciaPenal && renderSegment(tituloPenal, sentenciaPenalDetalle, EXPLICACION_DELITOS, penalTheme, true)}
            {sentenciaObliga && renderSegment(tituloCivil, sentenciaObligaDetalle, EXPLICACION_CIVILES, civilTheme, false)}
        </div>
    );
};

export default JudicialAlert;
