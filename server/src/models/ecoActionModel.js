import mongoose from "mongoose";

const ECO_ACTION_TYPES = ["reporte", "reciclaje", "educacion", "punto_sugerido"];
const ECO_ACTION_STATUSES = ["pendiente", "aprobada", "rechazada"];

const ecoActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ECO_ACTION_TYPES,
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ECO_ACTION_STATUSES,
      default: "pendiente",
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

ecoActionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("EcoAction", ecoActionSchema);
export { ECO_ACTION_TYPES, ECO_ACTION_STATUSES };
