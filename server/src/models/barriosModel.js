import mongoose from "mongoose";

function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function slugify(value = "") {
  return normalizeSpaces(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const barrioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: normalizeSpaces,
    },
    ciudad: {
      type: String,
      default: "Río Gallegos",
      trim: true,
      set: normalizeSpaces,
    },
    provincia: {
      type: String,
      default: "Santa Cruz",
      trim: true,
      set: normalizeSpaces,
    },
    activo: { type: Boolean, default: true },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

barrioSchema.pre("validate", function setSlug(next) {
  if (this.nombre) {
    this.slug = slugify(this.nombre);
  }
  next();
});

export default mongoose.model("Barrio", barrioSchema);
