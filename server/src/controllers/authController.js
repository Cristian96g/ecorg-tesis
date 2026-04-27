import User from "../models/userModel.js";
import { signToken } from "../middleware/auth.js";
import { createUserBase, toSafeUser } from "../services/userService.js";

export async function register(req, res) {
  try {
    const { nombre, email, password, telefono, direccion, barrio } = req.body;

    const userClean = await createUserBase({
      nombre,
      email,
      password,
      role: "user",
      telefono,
      direccion,
      barrio,
    });

    const token = signToken({
      id: userClean._id,
      email: userClean.email,
      role: userClean.role,
    });

    return res.status(201).json({ token, user: userClean });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);

    if (err.code === "EMAIL_EXISTS") {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    if (err.code === "FALTAN_CAMPOS") {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    if (err.code === "PASSWORD_INVALID") {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    return res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
}

export async function login(req, res) {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "Email y contraseña son requeridos",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "USER_NOT_FOUND",
        message: "El usuario no está registrado",
      });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(400).json({
        error: "WRONG_PASSWORD",
        message: "La contraseña es incorrecta",
      });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return res.status(500).json({
      error: "LOGIN_FAILED",
      message: "Error al iniciar sesión",
    });
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
}
