import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    code: { type: String, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    barrio: String,
    titulo: { type: String, required: true },
    direccion: String,
    descripcion: String,
    severidad: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "baja",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    estado: {
      type: String,
      enum: ["abierto", "en_revision", "resuelto"],
      default: "abierto",
      index: true,
    },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // [lng, lat]
    },
    fotos: [String],
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });
reportSchema.index({
  titulo: "text",
  direccion: "text",
  descripcion: "text",
  barrio: "text",
});

export default mongoose.model("Report", reportSchema);
