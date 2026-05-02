import crypto from "crypto";
import User from "../models/userModel.js";
import { signToken } from "../middleware/auth.js";
import { createUserBase, toSafeUser } from "../services/userService.js";

const RESET_TOKEN_MINUTES = 30;
const RESET_RESPONSE_MESSAGE =
  "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.";

function shouldExposeResetLink() {
  return process.env.NODE_ENV !== "production" && process.env.SHOW_RESET_LINK === "true";
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
}

async function sendPasswordResetEmail({ email, resetUrl }) {
  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    if (shouldExposeResetLink()) {
      console.info("PASSWORD_RESET_URL_DEV", { email, resetUrl });
      return { delivered: false, resetUrl };
    }

    return { delivered: false };
  }

  console.info("SMTP_CONFIG_DETECTED_BUT_NOT_IMPLEMENTED", { email });
  return shouldExposeResetLink()
    ? { delivered: false, resetUrl }
    : { delivered: false };
}

function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);

  return { rawToken, hashedToken, expiresAt };
}

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

export async function forgotPassword(req, res) {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Ingresá un email válido." });
    }

    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.json({ message: RESET_RESPONSE_MESSAGE });
    }

    const { rawToken, hashedToken, expiresAt } = createResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const resetUrl = `${getFrontendUrl().replace(/\/+$/, "")}/reset-password?token=${rawToken}`;
    const emailResult = await sendPasswordResetEmail({ email, resetUrl });

    const response = { message: RESET_RESPONSE_MESSAGE };
    if (shouldExposeResetLink() && emailResult?.resetUrl) {
      response.resetUrl = emailResult.resetUrl;
    }

    return res.json(response);
  } catch (err) {
    console.error("FORGOT_PASSWORD_ERROR:", err);
    return res.status(500).json({
      message: "No pudimos procesar la solicitud en este momento.",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const token = req.body?.token?.trim();
    const password = req.body?.password;

    if (!token || !password) {
      return res.status(400).json({
        message: "El token y la nueva contraseña son obligatorios.",
      });
    }

    if (String(password).trim().length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "El enlace de recuperación es inválido o expiró.",
      });
    }

    user.password = String(password).trim();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (err) {
    console.error("RESET_PASSWORD_ERROR:", err);
    return res.status(500).json({
      message: "No pudimos actualizar la contraseña.",
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
