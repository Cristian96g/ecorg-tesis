import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      set: normalizeSpaces,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    telefono: { type: String, trim: true, set: normalizeSpaces },
    direccion: { type: String, trim: true, set: normalizeSpaces },
    barrio: { type: String, trim: true, set: normalizeSpaces },
    avatarUrl: String,
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    points: { type: Number, default: 0, min: 0 },
    level: { type: String, default: "Eco principiante" },
    rewardPointsSpent: { type: Number, default: 0, min: 0 },
    badges: [
      {
        key: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    rewardRedemptions: [
      {
        rewardId: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        partner: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        benefitLabel: { type: String, required: true, trim: true },
        pointsSpent: { type: Number, required: true, min: 0 },
        status: {
          type: String,
          enum: ["emitido", "usado", "vencido"],
          default: "emitido",
        },
        code: { type: String, required: true, trim: true },
        redeemedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
