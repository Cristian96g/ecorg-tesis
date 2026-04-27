import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Barrio from "../src/models/barriosModel.js";
import Point from "../src/models/pointModel.js";
import Report from "../src/models/reportModel.js";
import User from "../src/models/userModel.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS usados en seed:", dns.getServers());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../src/.env") });

const RESET = process.argv.includes("--reset");
const ALLOW_PRODUCTION = process.argv.includes("--allow-production");

const ADMIN_EMAIL = "admin@ecorg.com";
const ADMIN_PASSWORD = "Admin123";

const DEMO_USERS = [
  {
    nombre: "Administrador EcoRG",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    telefono: "2966 400000",
    direccion: "Av. Presidente Néstor Kirchner 450",
    barrio: "Centro",
  },
  {
    nombre: "María González",
    email: "maria.gonzalez@ecorg.com",
    password: "EcoRG123",
    role: "user",
    telefono: "2966 412345",
    direccion: "Mariano Moreno 840",
    barrio: "Belgrano",
  },
  {
    nombre: "Juan Pérez",
    email: "juan.perez@ecorg.com",
    password: "EcoRG123",
    role: "user",
    telefono: "2966 423456",
    direccion: "Los Inmigrantes 1530",
    barrio: "San Benito",
  },
  {
    nombre: "Carla Mansilla",
    email: "carla.mansilla@ecorg.com",
    password: "EcoRG123",
    role: "user",
    telefono: "2966 434567",
    direccion: "Balbín 2280",
    barrio: "Bicentenario",
  },
];

const DEMO_BARRIOS = [
  "Centro",
  "Belgrano",
  "San Benito",
  "Bicentenario",
  "Evita",
  "Güemes",
  "Jardín Botánico",
  "YCF",
];

const DEMO_POINTS = [
  {
    title: "Punto Verde Municipalidad",
    barrio: "Centro",
    types: ["plastico", "vidrio", "papel"],
    estado: "activo",
    address: "Av. Presidente Néstor Kirchner 450",
    location: { type: "Point", coordinates: [-69.2168, -51.6229] },
  },
  {
    title: "Centro de Reciclado Belgrano",
    barrio: "Belgrano",
    types: ["plastico", "papel", "aceite"],
    estado: "activo",
    address: "Mariano Moreno 1020",
    location: { type: "Point", coordinates: [-69.2284, -51.6211] },
  },
  {
    title: "Punto Limpio San Benito",
    barrio: "San Benito",
    types: ["vidrio", "papel", "pilas"],
    estado: "activo",
    address: "Los Inmigrantes 1600",
    location: { type: "Point", coordinates: [-69.2457, -51.6318] },
  },
  {
    title: "EcoPunto Bicentenario",
    barrio: "Bicentenario",
    types: ["plastico", "vidrio", "papel", "aceite"],
    estado: "activo",
    address: "Balbín 2200",
    location: { type: "Point", coordinates: [-69.2422, -51.6384] },
  },
  {
    title: "Punto Verde Evita",
    barrio: "Evita",
    types: ["plastico", "vidrio"],
    estado: "activo",
    address: "Combatiente de Malvinas 980",
    location: { type: "Point", coordinates: [-69.2325, -51.6147] },
  },
  {
    title: "Centro Barrial Güemes",
    barrio: "Güemes",
    types: ["papel", "pilas", "aceite"],
    estado: "inactivo",
    address: "José Ingenieros 1350",
    location: { type: "Point", coordinates: [-69.2236, -51.6293] },
  },
];

const DEMO_REPORTS = [
  {
    code: "REP-DEMO-001",
    userEmail: "maria.gonzalez@ecorg.com",
    barrio: "Centro",
    titulo: "Basural en esquina céntrica",
    direccion: "Entre Rivadavia y Avellaneda",
    descripcion: "Se acumularon bolsas y residuos sueltos en la esquina desde hace varios días.",
    severidad: "media",
    status: "approved",
    estado: "abierto",
    location: { type: "Point", coordinates: [-69.2195, -51.6236] },
  },
  {
    code: "REP-DEMO-002",
    userEmail: "juan.perez@ecorg.com",
    barrio: "San Benito",
    titulo: "Contenedor desbordado",
    direccion: "Los Inmigrantes 1450",
    descripcion: "El contenedor está lleno y hay residuos desparramados sobre la vereda.",
    severidad: "alta",
    status: "approved",
    estado: "en_revision",
    location: { type: "Point", coordinates: [-69.2463, -51.6324] },
  },
  {
    code: "REP-DEMO-003",
    userEmail: "carla.mansilla@ecorg.com",
    barrio: "Bicentenario",
    titulo: "Residuos peligrosos junto a zanjón",
    direccion: "Balbín 2100",
    descripcion: "Hay bidones y restos de aceite tirados cerca de un zanjón del barrio.",
    severidad: "alta",
    status: "approved",
    estado: "resuelto",
    location: { type: "Point", coordinates: [-69.2413, -51.6376] },
  },
  {
    code: "REP-DEMO-004",
    userEmail: "maria.gonzalez@ecorg.com",
    barrio: "Belgrano",
    titulo: "Microbasural detrás de parada de colectivo",
    direccion: "Mariano Moreno 980",
    descripcion: "Se formó un microbasural con cartones, botellas y restos de poda.",
    severidad: "media",
    status: "approved",
    estado: "abierto",
    location: { type: "Point", coordinates: [-69.2292, -51.6208] },
  },
  {
    code: "REP-DEMO-005",
    userEmail: "juan.perez@ecorg.com",
    barrio: "Evita",
    titulo: "Residuos acumulados en baldío",
    direccion: "Combatiente de Malvinas 1050",
    descripcion: "Hay residuos secos y bolsas acumuladas en un terreno baldío del barrio.",
    severidad: "baja",
    status: "pending",
    estado: "abierto",
    location: { type: "Point", coordinates: [-69.2331, -51.6155] },
  },
  {
    code: "REP-DEMO-006",
    userEmail: "carla.mansilla@ecorg.com",
    barrio: "Güemes",
    titulo: "Quema informal de residuos",
    direccion: "José Ingenieros 1400",
    descripcion: "Se reportó quema de residuos domiciliarios en la vía pública.",
    severidad: "alta",
    status: "rejected",
    estado: "abierto",
    location: { type: "Point", coordinates: [-69.2242, -51.6288] },
  },
];

function ensureDemoOnly() {
  if (process.env.NODE_ENV === "production" && !ALLOW_PRODUCTION) {
    throw new Error(
      "El seed demo está bloqueado en producción. Usá --allow-production solo si realmente lo necesitás."
    );
  }
}

async function connect() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecorg";
  await mongoose.connect(uri);
  console.log("Conectado a MongoDB para seed demo");
}

async function resetDemoData() {
  await Report.deleteMany({ code: { $in: DEMO_REPORTS.map((item) => item.code) } });
  await Point.deleteMany({ title: { $in: DEMO_POINTS.map((item) => item.title) } });
  await Barrio.deleteMany({ nombre: { $in: DEMO_BARRIOS } });
  await User.deleteMany({ email: { $in: DEMO_USERS.map((item) => item.email.toLowerCase()) } });
}

async function upsertUser(seed) {
  let user = await User.findOne({ email: seed.email.toLowerCase() });

  if (!user) {
    user = new User({
      nombre: seed.nombre,
      email: seed.email.toLowerCase(),
      password: seed.password,
      role: seed.role,
      telefono: seed.telefono,
      direccion: seed.direccion,
      barrio: seed.barrio,
    });
  } else {
    user.nombre = seed.nombre;
    user.email = seed.email.toLowerCase();
    user.role = seed.role;
    user.telefono = seed.telefono;
    user.direccion = seed.direccion;
    user.barrio = seed.barrio;
    user.password = seed.password;
  }

  await user.save();
  return user;
}

async function upsertBarrio(nombre) {
  const existing = await Barrio.findOne({ nombre });

  if (existing) {
    existing.ciudad = "Río Gallegos";
    existing.provincia = "Santa Cruz";
    existing.activo = true;
    await existing.save();
    return existing;
  }

  return Barrio.create({
    nombre,
    ciudad: "Río Gallegos",
    provincia: "Santa Cruz",
    activo: true,
  });
}

async function upsertPoint(seed) {
  const existing = await Point.findOne({ title: seed.title });

  if (existing) {
    Object.assign(existing, seed);
    await existing.save();
    return existing;
  }

  return Point.create(seed);
}

async function upsertReport(seed, usersByEmail) {
  const existing = await Report.findOne({ code: seed.code });
  const payload = {
    code: seed.code,
    user: usersByEmail.get(seed.userEmail)?._id || null,
    barrio: seed.barrio,
    titulo: seed.titulo,
    direccion: seed.direccion,
    descripcion: seed.descripcion,
    severidad: seed.severidad,
    status: seed.status,
    estado: seed.estado,
    location: seed.location,
    fotos: [],
  };

  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }

  return Report.create(payload);
}

async function run() {
  try {
    ensureDemoOnly();
    await connect();

    if (RESET) {
      await resetDemoData();
      console.log("Datos demo anteriores eliminados");
    }

    const users = [];
    for (const seed of DEMO_USERS) {
      users.push(await upsertUser(seed));
    }
    const usersByEmail = new Map(
      users.map((user) => [user.email.toLowerCase(), user])
    );

    const barrios = [];
    for (const nombre of DEMO_BARRIOS) {
      barrios.push(await upsertBarrio(nombre));
    }

    const points = [];
    for (const seed of DEMO_POINTS) {
      points.push(await upsertPoint(seed));
    }

    const reports = [];
    for (const seed of DEMO_REPORTS) {
      reports.push(await upsertReport(seed, usersByEmail));
    }

    console.log("Seed demo completado");
    console.log(`Admins/usuarios demo: ${users.length}`);
    console.log(`Barrios demo: ${barrios.length}`);
    console.log(`Puntos verdes demo: ${points.length}`);
    console.log(`Reportes demo: ${reports.length}`);
    console.log(`Admin listo: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("Seed demo error:", error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
