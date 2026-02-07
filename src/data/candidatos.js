import candidatosData from './candidatosPresidenciales.json';

// URL para logos de partidos: https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{idOrg}
export const JNE_LOGO = "https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/";

// Candidatos presidenciales desde JSON con datos enriquecidos del JNE
export const candidatosPresidenciales = candidatosData.data.map(c => ({
  id: c.idOrg,
  nombre: c.nombre,
  partido: c.partido,
  siglas: c.partido.split(' ').map(w => w[0]).join('').slice(0, 4),
  foto: c.foto,
  idOrg: c.idOrg,
  dni: c.dni,
  idHojaVida: c.idHojaVida,
  flags: c.flags,
  resumen: c.resumen
}));

export const partidosParlamentarios = [
  { id: 1, nombre: "Fuerza Popular", siglas: "FP", color: "#FF6B00", idOrg: 1366 },
  { id: 2, nombre: "Alianza para el Progreso", siglas: "APP", color: "#00A651", idOrg: 1257 },
  { id: 3, nombre: "Renovación Popular", siglas: "RP", color: "#1E3A8A", idOrg: 22 },
  { id: 4, nombre: "Somos Perú", siglas: "SP", color: "#F59E0B", idOrg: 14 },
  { id: 5, nombre: "Perú Libre", siglas: "PL", color: "#7C3AED", idOrg: 2218 },
  { id: 6, nombre: "Cooperación Popular", siglas: "CP", color: "#0D9488", idOrg: 2995 },
  { id: 7, nombre: "Podemos Perú", siglas: "PP", color: "#F97316", idOrg: 2731 },
  { id: 8, nombre: "Frente de la Esperanza", siglas: "FE", color: "#14B8A6", idOrg: 2857 },
  { id: 9, nombre: "Partido Cívico Obras", siglas: "PCO", color: "#0369A1", idOrg: 2941 },
  { id: 10, nombre: "Avanza País", siglas: "AP", color: "#EF4444", idOrg: 2173 },
  { id: 11, nombre: "Partido Morado", siglas: "PM", color: "#8B5CF6", idOrg: 2840 },
  { id: 12, nombre: "Alianza Unidad Nacional", siglas: "UN", color: "#1D4ED8", idOrg: 3023 },
  { id: 13, nombre: "Fe en el Perú", siglas: "FEP", color: "#10B981", idOrg: 2898 },
  { id: 14, nombre: "Primero La Gente", siglas: "PLG", color: "#C026D3", idOrg: 2972 },
  { id: 15, nombre: "Alianza Fuerza y Libertad", siglas: "AFL", color: "#0EA5E9", idOrg: 3024 },
  { id: 16, nombre: "Un Camino Diferente", siglas: "UCD", color: "#84CC16", idOrg: 2998 },
  { id: 17, nombre: "Ahora Nación", siglas: "AN", color: "#4F46E5", idOrg: 2980 },
  { id: 18, nombre: "País Para Todos", siglas: "PPT", color: "#06B6D4", idOrg: 2956 },
  { id: 19, nombre: "Partido del Buen Gobierno", siglas: "PBG", color: "#475569", idOrg: 2961 },
  { id: 20, nombre: "Juntos por el Perú", siglas: "JPP", color: "#EC4899", idOrg: 1264 },
  { id: 21, nombre: "Sí Creo", siglas: "SC", color: "#DB2777", idOrg: 2974 },
  { id: 22, nombre: "Libertad Popular", siglas: "LP", color: "#B91C1C", idOrg: 2933 },
  { id: 23, nombre: "Partido Aprista Peruano", siglas: "APRA", color: "#DC2626", idOrg: 8 },
  { id: 24, nombre: "Perú Primero", siglas: "PPR", color: "#059669", idOrg: 2925 },
  { id: 25, nombre: "Partido Patriótico del Perú", siglas: "PPP", color: "#D946EF", idOrg: 2869 },
  { id: 26, nombre: "Perú Moderno", siglas: "PMOD", color: "#0284C7", idOrg: 2924 },
  { id: 27, nombre: "Demócrata Unido Perú", siglas: "DUP", color: "#0891B2", idOrg: 2867 },
  { id: 28, nombre: "Progresemos", siglas: "PRO", color: "#65A30D", idOrg: 2967 },
  { id: 29, nombre: "Salvemos al Perú", siglas: "SAP", color: "#166534", idOrg: 2927 },
  { id: 30, nombre: "PRIN", siglas: "PRIN", color: "#7C2D12", idOrg: 2921 },
  { id: 31, nombre: "Integridad Democrática", siglas: "ID", color: "#7C3AED", idOrg: 2985 },
  { id: 32, nombre: "Perú Acción", siglas: "PA", color: "#EA580C", idOrg: 2932 },
  { id: 33, nombre: "Partido Demócrata Verde", siglas: "PDV", color: "#22C55E", idOrg: 2895 },
  { id: 34, nombre: "Alianza Venceremos", siglas: "AV", color: "#991B1B", idOrg: 3022 },
  { id: 35, nombre: "PTE-Perú", siglas: "PTE", color: "#CA8A04", idOrg: 2939 },
  { id: 36, nombre: "Partido Democrático Federal", siglas: "PDF", color: "#6366F1", idOrg: 2964 },
  { id: 37, nombre: "Frente Popular Agrícola del Perú", siglas: "FREPAP", color: "#78350F", idOrg: 2901 },
  { id: 38, nombre: "Ciudadanos por el Perú", siglas: "CPP", color: "#475569", idOrg: 2976 },
];

export const regiones = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao",
  "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque",
  "Lima Metropolitana", "Lima Provincias", "Loreto", "Madre de Dios", "Moquegua",
  "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
];

