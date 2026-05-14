import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  getAdminRewardCatalog,
  getRewardSummary,
  redeemRewardForUser,
  serializeRewardCatalogForUser,
  updateRewardCatalogItem,
} from "../services/rewardsService.js";
import { createUserBase } from "../services/userService.js";

function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeEmail(value = "") {
  return String(value).trim().toLowerCase();
}

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function countAdmins() {
  return User.countDocuments({ role: "admin" });
}

function serializeUserResponse(userDoc) {
  const user = userDoc?.toObject ? userDoc.toObject() : userDoc;
  if (!user) return user;

  return {
    ...user,
    rewardSummary: getRewardSummary(user),
  };
}

/** Perfil propio */
export async function me(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  res.json(serializeUserResponse(user));
}

export async function updateMe(req, res) {
  const { nombre, telefono, direccion, barrio } = req.body;
  const patch = { nombre, telefono, direccion, barrio };
  if (req.file) patch.avatarUrl = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true })
    .select("-password");
  res.json(serializeUserResponse(user));
}

export async function listMyRewards(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.json({
    summary: getRewardSummary(user),
    items: serializeRewardCatalogForUser(user),
  });
}

export async function redeemMyReward(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { rewardId } = req.params;
    const { reward, redemption, summary } = redeemRewardForUser(user, rewardId);
    await user.save();

    return res.json({
      ok: true,
      reward,
      redemption,
      summary,
      user: serializeUserResponse(user),
      message: "Beneficio emitido correctamente. Ya podés usarlo en el comercio adherido.",
    });
  } catch (err) {
    console.error("REDEEM_REWARD_ERROR:", err);
    const status = err.status || 500;
    const errorMessage =
      status === 500 ? "No se pudo emitir el beneficio en este momento" : err.message;
    return res.status(status).json({ error: errorMessage });
  }
}

export async function listAdminRewards(req, res) {
  const items = getAdminRewardCatalog();
  const summary = {
    total: items.length,
    active: items.filter((item) => item.status === "activo").length,
    paused: items.filter((item) => item.status === "pausado").length,
    featured: items.filter((item) => item.featured).length,
  };

  return res.json({ summary, items });
}

export async function updateAdminReward(req, res) {
  try {
    const { rewardId } = req.params;
    const updated = updateRewardCatalogItem(rewardId, req.body || {});
    return res.json({
      ok: true,
      item: updated,
      message: "Beneficio actualizado correctamente.",
    });
  } catch (err) {
    console.error("UPDATE_ADMIN_REWARD_ERROR:", err);
    const status = err.status || 500;
    return res.status(status).json({
      error: status === 500 ? "No se pudo actualizar el beneficio" : err.message,
    });
  }
}

/** Admin: listar */
export async function getUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET_USERS_ERROR:", err);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
}

/** Admin: obtener uno */
export async function getUserById(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
}

/** Admin: crear */
export async function createUser(req, res) {
  try {
    const {
      nombre,
      email,
      role = "user",
      password,
      telefono,
      direccion,
      barrio,
    } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const userClean = await createUserBase({
      nombre,
      email,
      password,
      role,
      telefono: normalizeSpaces(telefono || ""),
      direccion: normalizeSpaces(direccion || ""),
      barrio: normalizeSpaces(barrio || ""),
    });

    return res.status(201).json(userClean);
  } catch (err) {
    console.error("CREATE_USER_ERROR:", err);

    if (err.code === "EMAIL_EXISTS") {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    if (err.code === "FALTAN_CAMPOS") {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    if (err.code === "PASSWORD_INVALID") {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    return res.status(500).json({ error: "No se pudo crear el usuario" });
  }
}

/** Admin: actualizar */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nombre, email, role, password, telefono, direccion, barrio } = req.body;
    const currentUser = await User.findById(id);

    if (!currentUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const patch = {};

    if (nombre !== undefined) {
      const cleanNombre = normalizeSpaces(nombre);
      if (!cleanNombre) {
        return res.status(400).json({ error: "El nombre es obligatorio" });
      }
      patch.nombre = cleanNombre;
    }

    if (email !== undefined) {
      const cleanEmail = normalizeEmail(email);
      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        return res.status(400).json({ error: "Ingresá un email válido" });
      }

      const exists = await User.findOne({
        _id: { $ne: id },
        email: cleanEmail,
      });
      if (exists) {
        return res.status(409).json({ error: "Email ya registrado" });
      }
      patch.email = cleanEmail;
    }

    if (telefono !== undefined) patch.telefono = normalizeSpaces(telefono);
    if (direccion !== undefined) patch.direccion = normalizeSpaces(direccion);
    if (barrio !== undefined) patch.barrio = normalizeSpaces(barrio);

    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      if (
        currentUser.role === "admin" &&
        role === "user" &&
        (await countAdmins()) <= 1
      ) {
        return res.status(400).json({ error: "No podés quitar el último administrador del sistema" });
      }

      patch.role = role;
    }

    if (password !== undefined && String(password).trim()) {
      const cleanPassword = String(password).trim();
      if (cleanPassword.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
      }
      const salt = await bcrypt.genSalt(10);
      patch.password = await bcrypt.hash(cleanPassword, salt);
    }

    const user = await User.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    console.error("UPDATE_USER_ERROR:", err);
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
}

/** Admin: borrar */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ error: "No podés eliminar tu propia cuenta desde este panel" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.role === "admin" && (await countAdmins()) <= 1) {
      return res.status(400).json({ error: "No podés eliminar el último administrador del sistema" });
    }

    await User.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE_USER_ERROR:", err);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
}

/** Admin: setear rol explícito */
export async function setRole(req, res) {
  const { userId, role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido" });
  }

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (
    currentUser.role === "admin" &&
    role === "user" &&
    (await countAdmins()) <= 1
  ) {
    return res.status(400).json({ error: "No podés quitar el último administrador del sistema" });
  }

  const user = await User.findByIdAndUpdate(userId, { role }, { new: true })
    .select("-password");
  res.json(user);
}
