import mongoose from "mongoose";

const MATERIAL_TYPES = ["plastico", "vidrio", "papel", "pilas", "aceite"];
const MATERIAL_ALIASES = {
  papel_carton: "papel",
};

const pointSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    barrio: { type: String, trim: true },
    types: [
      {
        type: String,
        enum: MATERIAL_TYPES,
      },
    ],
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
    address: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
  },
  { timestamps: true }
);

pointSchema.index({ location: "2dsphere" });

export default mongoose.model("Point", pointSchema);
export { MATERIAL_TYPES, MATERIAL_ALIASES };
