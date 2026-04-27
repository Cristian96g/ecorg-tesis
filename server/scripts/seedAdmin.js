import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import User from "../src/models/userModel.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS usados en seed:", dns.getServers());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../src/.env") });

async function run() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecorg";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ecorg.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123";

    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!admin) {
      admin = await User.create({
        nombre: "Administrador EcoRG",
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: "admin",
      });
      console.log(`Admin creado: ${admin.email}`);
    } else {
      admin.nombre = admin.nombre || "Administrador EcoRG";
      admin.role = "admin";
      admin.password = adminPassword;
      await admin.save();
      console.log(`Admin actualizado: ${admin.email}`);
    }
  } catch (error) {
    console.error("Seed admin error:", error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
