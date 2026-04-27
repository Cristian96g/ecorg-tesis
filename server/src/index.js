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

dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS usados:", dns.getServers());

dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/", (req, res) => res.json({ ok: true, name: "EcoRG API" }));

/// rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/barrios", barriosRoutes);
app.use("/api/eco-actions", ecoActionsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Middleware de errores
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
// app.listen(PORT, () =>
//   console.log(`âœ… API corriendo en http://localhost:${PORT}`)
// );

async function startServer() {
  await connectDB();

  app.listen(PORT, () =>
    console.log(`âœ… API corriendo en http://localhost:${PORT}`)
  );
}

startServer();
