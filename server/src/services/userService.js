import User from "../models/userModel.js";

export async function createUserBase({
  nombre,
  email,
  password,
  role = "user",
  telefono,
  direccion,
  barrio,
  avatarUrl,
}) {
  const cleanNombre = nombre?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = typeof password === "string" ? password.trim() : password;

  if (!cleanNombre || !cleanEmail || !cleanPassword) {
    const err = new Error("FALTAN_CAMPOS");
    err.code = "FALTAN_CAMPOS";
    throw err;
  }

  if (cleanPassword.length < 6) {
    const err = new Error("PASSWORD_INVALID");
    err.code = "PASSWORD_INVALID";
    throw err;
  }

  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    const err = new Error("EMAIL_EXISTS");
    err.code = "EMAIL_EXISTS";
    throw err;
  }

  const user = await User.create({
    nombre: cleanNombre,
    email: cleanEmail,
    password: cleanPassword,
    role,
    telefono,
    direccion,
    barrio,
    avatarUrl,
  });

  const clean = user.toObject();
  delete clean.password;
  return clean;
}

export function toSafeUser(userDoc) {
  if (!userDoc) return null;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  return obj;
}
