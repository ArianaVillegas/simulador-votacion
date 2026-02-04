// URL para logos de partidos: https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{idOrg}
export const JNE_LOGO = "https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/";

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

const JNE_FOTO = "https://mpesije.jne.gob.pe/apidocs/";

export const candidatosPresidenciales = [
  // 1. FP - Fuerza Popular
  { id: 1366, nombre: "Keiko Fujimori Higuchi", partido: "Fuerza Popular", siglas: "FP", color: "#FF6B00", foto: JNE_FOTO + "251cd1c0-acc7-4338-bd8a-439ccb9238d0.jpeg", idOrg: 1366, dni: "10001088", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/1366/10001088" },
  // 2. APP - Alianza para el Progreso
  { id: 1257, nombre: "César Acuña Peralta", partido: "Alianza para el Progreso", siglas: "APP", color: "#00A651", foto: JNE_FOTO + "d6fe3cac-7061-474b-8551-0aa686a54bad.jpg", idOrg: 1257, dni: "17903382", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/1257/17903382" },
  // 3. RP - Renovación Popular
  { id: 22, nombre: "Rafael López Aliaga Cazorla", partido: "Renovación Popular", siglas: "RP", color: "#1E3A8A", foto: JNE_FOTO + "b2e00ae2-1e50-4ad3-a103-71fc7e4e8255.jpg", idOrg: 22, dni: "07845838", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/22/07845838" },
  // 4. SP - Somos Perú
  { id: 14, nombre: "George Forsyth Sommer", partido: "Somos Perú", siglas: "SP", color: "#F59E0B", foto: JNE_FOTO + "b1d60238-c797-4cba-936e-f13de6a34cc7.jpg", idOrg: 14, dni: "41265978", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/14/41265978" },
  // 5. PL - Perú Libre
  { id: 2218, nombre: "Vladimir Cerrón Rojas", partido: "Perú Libre", siglas: "PL", color: "#7C3AED", foto: JNE_FOTO + "82ee0ff2-2336-4aba-9590-e576f7564315.jpg", idOrg: 2218, dni: "06466585", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2218/06466585" },
  // 6. CP - Cooperación Popular
  { id: 2995, nombre: "Yonhy Lescano Ancieta", partido: "Cooperación Popular", siglas: "CP", color: "#0D9488", foto: JNE_FOTO + "b9db2b5c-02ff-4265-ae51-db9b1001ad70.jpg", idOrg: 2995, dni: "01211014", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2995/01211014" },
  // 7. PP - Podemos Perú
  { id: 2731, nombre: "José Luna Gálvez", partido: "Podemos Perú", siglas: "PP", color: "#F97316", foto: JNE_FOTO + "a669a883-bf8a-417c-9296-c14b943c3943.jpg", idOrg: 2731, dni: "07246887", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2731/07246887" },
  // 8. FE - Frente de la Esperanza
  { id: 2857, nombre: "Fernando Olivera Vega", partido: "Frente de la Esperanza", siglas: "FE", color: "#14B8A6", foto: JNE_FOTO + "3e2312e1-af79-4954-abfa-a36669c1a9e9.jpg", idOrg: 2857, dni: "06280714", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2857/06280714" },
  // 9. PCO - Partido Cívico Obras
  { id: 2941, nombre: "Ricardo Belmont Cassinelli", partido: "Partido Cívico Obras", siglas: "PCO", color: "#0369A1", foto: JNE_FOTO + "78647f15-d5d1-4ed6-8ac6-d599e83eeea3.jpg", idOrg: 2941, dni: "09177250", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2941/09177250" },
  // 10. AP - Avanza País
  { id: 2173, nombre: "José Williams Zapata", partido: "Avanza País", siglas: "AP", color: "#EF4444", foto: JNE_FOTO + "b60c471f-a6bb-4b42-a4b2-02ea38acbb0d.jpg", idOrg: 2173, dni: "43287528", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2173/43287528" },
  // 11. PM - Partido Morado
  { id: 2840, nombre: "Mesías Guevara Amasifuen", partido: "Partido Morado", siglas: "PM", color: "#8B5CF6", foto: JNE_FOTO + "1b861ca7-3a5e-48b4-9024-08a92371e33b.jpg", idOrg: 2840, dni: "09871134", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2840/09871134" },
  // 12. UN - Unidad Nacional
  { id: 3023, nombre: "Roberto Chiabra León", partido: "Unidad Nacional", siglas: "UN", color: "#1D4ED8", foto: JNE_FOTO + "5c703ce9-ba1e-4490-90bf-61006740166f.jpg", idOrg: 3023, dni: "40728264", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/3023/40728264" },
  // 13. FEP - Fe en el Perú
  { id: 2898, nombre: "Álvaro Paz de la Barra Freigeiro", partido: "Fe en el Perú", siglas: "FEP", color: "#10B981", foto: JNE_FOTO + "5032fa7f-eff1-4181-bf51-e32f2dfde304.jpg", idOrg: 2898, dni: "41904418", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2898/41904418" },
  // 14. PLG - Primero La Gente
  { id: 2931, nombre: "María Soledad Pérez Tello", partido: "Primero La Gente", siglas: "PLG", color: "#C026D3", foto: JNE_FOTO + "073703ca-c427-44f0-94b1-a782223a5e10.jpg", idOrg: 2931, dni: "07867789", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2931/07867789" },
  // 15. AFL - Fuerza y Libertad
  { id: 3024, nombre: "Fiorella Molinelli Aristondo", partido: "Fuerza y Libertad", siglas: "FyL", color: "#0EA5E9", foto: JNE_FOTO + "1de656b5-7593-4c60-ab7a-83d618a3d80d.jpg", idOrg: 3024, dni: "25681995", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/3024/25681995" },
  // 16. UCD - Un Camino Diferente
  { id: 2998, nombre: "Rosario Fernández Bazán", partido: "Un Camino Diferente", siglas: "UCD", color: "#84CC16", foto: JNE_FOTO + "ac0b0a59-ead5-4ef1-8ef8-8967e322d6ca.jpg", idOrg: 2998, dni: "18141156", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2998/18141156" },
  // 17. AN - Ahora Nación
  { id: 2980, nombre: "Pablo López Chau Nava", partido: "Ahora Nación", siglas: "AN", color: "#4F46E5", foto: JNE_FOTO + "ddfa74eb-cae3-401c-a34c-35543ae83c57.jpg", idOrg: 2980, dni: "25331980", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2980/25331980" },
  // 18. PPT - País Para Todos
  { id: 2956, nombre: "Carlos Álvarez Loayza", partido: "País Para Todos", siglas: "PPT", color: "#06B6D4", foto: JNE_FOTO + "2bd18177-d665-413d-9694-747d729d3e39.jpg", idOrg: 2956, dni: "06002034", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2956/06002034" },
  // 19. PBG - Partido del Buen Gobierno
  { id: 2961, nombre: "Jorge Nieto Montesinos", partido: "Partido del Buen Gobierno", siglas: "PBG", color: "#475569", foto: JNE_FOTO + "9ae56ed5-3d0f-49ff-8bb9-0390bad71816.jpg", idOrg: 2961, dni: "06506278", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2961/06506278" },
  // 20. JPP - Juntos por el Perú
  { id: 1264, nombre: "Roberto Sánchez Palomino", partido: "Juntos por el Perú", siglas: "JPP", color: "#EC4899", foto: JNE_FOTO + "bb7c7465-9c6e-44eb-ac7d-e6cc7f872a1a.jpg", idOrg: 1264, dni: "16002918", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/1264/16002918" },
  // 21. SC - Sí Creo
  { id: 2935, nombre: "Alfonso Carlos Espá y Garcés-Alvear", partido: "Sí Creo", siglas: "SC", color: "#DB2777", foto: JNE_FOTO + "85935f77-6c46-4eab-8c7e-2494ffbcece0.jpg", idOrg: 2935, dni: "10266270", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2935/10266270" },
  // 22. LP - Libertad Popular
  { id: 2933, nombre: "Rafael Belaúnde Llosa", partido: "Libertad Popular", siglas: "LP", color: "#B91C1C", foto: JNE_FOTO + "3302e45b-55c8-4979-a60b-2b11097abf1d.jpg", idOrg: 2933, dni: "10219647", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2933/10219647" },
  // 23. APRA - Partido Aprista Peruano
  { id: 2930, nombre: "Pitter Valderrama Peña", partido: "Partido Aprista Peruano", siglas: "APRA", color: "#DC2626", foto: JNE_FOTO + "d72c4b29-e173-42b8-b40d-bdb6d01a526a.jpg", idOrg: 2930, dni: "43632186", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2930/43632186" },
  // 24. PPR - Perú Primero
  { id: 2925, nombre: "Mario Vizcarra Cornejo", partido: "Perú Primero", siglas: "PPR", color: "#059669", foto: JNE_FOTO + "ee7a080e-bc81-4c81-9e5e-9fd95ff459ab.jpg", idOrg: 2925, dni: "04411300", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2925/04411300" },
  // 25. PPP - Partido Patriótico del Perú
  { id: 2869, nombre: "Herbert Caller Gutiérrez", partido: "Partido Patriótico del Perú", siglas: "PPP", color: "#D946EF", foto: JNE_FOTO + "6ad6c5ff-0411-4ddd-9cf7-b0623f373fcf.jpg", idOrg: 2869, dni: "43409673", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2869/43409673" },
  // 26. PMOD - Perú Moderno
  { id: 2924, nombre: "Carlos Jaico Carranza", partido: "Perú Moderno", siglas: "PMOD", color: "#0284C7", foto: JNE_FOTO + "7d91e14f-4417-4d61-89ba-3e686dafaa95.jpg", idOrg: 2924, dni: "06529088", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2924/06529088" },
  // 27. DUP - Demócrata Unido Perú
  { id: 2867, nombre: "Charlie Carrasco Salazar", partido: "Demócrata Unido Perú", siglas: "DUP", color: "#0891B2", foto: JNE_FOTO + "12fa17db-f28f-4330-9123-88549539b538.jpg", idOrg: 2867, dni: "40799023", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2867/40799023" },
  // 28. PRO - Progresemos
  { id: 2967, nombre: "Paul Jaimes Blanco", partido: "Progresemos", siglas: "PRO", color: "#65A30D", foto: JNE_FOTO + "929e1a63-335d-4f3a-ba26-f3c7ff136213.jpg", idOrg: 2967, dni: "40139245", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2967/40139245" },
  // 29. SAP - Salvemos al Perú
  { id: 2927, nombre: "Antonio Ortiz Villano", partido: "Salvemos al Perú", siglas: "SAP", color: "#166534", foto: JNE_FOTO + "8e6b9124-2883-4143-8768-105f2ce780eb.jpg", idOrg: 2927, dni: "08587486", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2927/08587486" },
  // 30. PRIN
  { id: 2921, nombre: "Walter Chirinos Purizaga", partido: "PRIN", siglas: "PRIN", color: "#7C2D12", foto: JNE_FOTO + "a2d0f631-fe47-4c41-92ba-7ed9f4095520.jpg", idOrg: 2921, dni: "18870364", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2921/18870364" },
  // 31. ID - Integridad Democrática
  { id: 2985, nombre: "Wolfgang Grozo Costa", partido: "Integridad Democrática", siglas: "ID", color: "#7C3AED", foto: JNE_FOTO + "064360d1-ce49-4abe-939c-f4de8b0130a2.jpg", idOrg: 2985, dni: "07260881", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2985/07260881" },
  // 32. PA - Perú Acción
  { id: 2932, nombre: "Francisco Diez-Canseco Távara", partido: "Perú Acción", siglas: "PA", color: "#EA580C", foto: JNE_FOTO + "2d1bf7f2-6e88-4ea9-8ed2-975c1ae5fb92.jpg", idOrg: 2932, dni: "08263758", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2932/08263758" },
  // 33. PDV - Partido Demócrata Verde
  { id: 2895, nombre: "Alex Gonzales Castillo", partido: "Partido Demócrata Verde", siglas: "PDV", color: "#22C55E", foto: JNE_FOTO + "c0ae56bf-21c1-4810-890a-b25c8465bdd9.jpg", idOrg: 2895, dni: "09307547", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2895/09307547" },
  // 34. AV - Alianza Venceremos
  { id: 3025, nombre: "Ronald Atencio Sotomayor", partido: "Alianza Venceremos", siglas: "AV", color: "#991B1B", foto: JNE_FOTO + "bac0288d-3b21-45ac-8849-39f9177fb020.jpg", idOrg: 3025, dni: "41373494", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/3025/41373494" },
  // 35. PTE - PTE-Perú
  { id: 2939, nombre: "Napoleón Becerra García", partido: "PTE-Perú", siglas: "PTE", color: "#CA8A04", foto: JNE_FOTO + "bab206cb-b2d5-41ec-bde8-ef8cf3e0a2df.jpg", idOrg: 2939, dni: "08058852", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2939/08058852" },
  // 36. PDF - Partido Democrático Federal
  { id: 2986, nombre: "Armando Masse Fernández", partido: "Partido Democrático Federal", siglas: "PDF", color: "#6366F1", foto: JNE_FOTO + "cb1adeb7-7d2f-430c-ae87-519137d8edfa.jpg", idOrg: 2986, dni: "08255194", hojaVida: "https://votoinformado.jne.gob.pe/hoja-vida/2986/08255194" },
];

export const regiones = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao",
  "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque",
  "Lima Metropolitana", "Lima Provincias", "Loreto", "Madre de Dios", "Moquegua",
  "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
];

