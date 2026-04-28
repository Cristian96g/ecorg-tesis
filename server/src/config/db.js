import mongoose from "mongoose";

export default async function connectDB() {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    throw new Error("Falta MONGO_URI en las variables de entorno del servidor.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error en MongoDB:", error.message);
    process.exit(1);
  }
}
