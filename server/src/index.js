import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import pointsRoutes from "./routes/pointsRoutes.js";
import barriosRoutes from "./routes/barriosRoutes.js";
import ecoActionsRoutes from "./routes/ecoActionsRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dns from "node:dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, ".env");

dotenv.config({ path: envPath });
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]?.trim());

if (missingEnvVars.length > 0) {
  console.error(`Faltan variables de entorno obligatorias: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}


const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = allowedOrigins.length
  ? allowedOrigins
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/", (req, res) => res.json({ ok: true, name: "EcoRG API" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/barrios", barriosRoutes);
app.use("/api/eco-actions", ecoActionsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
