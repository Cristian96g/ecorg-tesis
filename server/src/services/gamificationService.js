import EcoAction from "../models/ecoActionModel.js";
import User from "../models/userModel.js";
import {
  notifyBadgeAwarded,
  notifyPointsAwarded,
} from "./notificationService.js";

const POINTS_BY_TYPE = {
  reporte: 20,
  reciclaje: 15,
  educacion: 5,
  punto_sugerido: 10,
};

const LEVELS = [
  { min: 1000, label: "Eco héroe" },
  { min: 600, label: "Guardián ambiental" },
  { min: 300, label: "Reciclador activo" },
  { min: 100, label: "Vecino consciente" },
  { min: 0, label: "Eco principiante" },
];

const DAILY_POINTS_LIMIT = 3;
const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;
const REPORT_APPROVAL_DESCRIPTION = "Reporte comunitario validado por administracion";
const REPORT_RESOLVED_BONUS_DESCRIPTION = "Bonus por reporte comunitario resuelto";
const BADGE_DEFINITIONS = {
  primer_reporte: {
    key: "primer_reporte",
    name: "Primer reporte aprobado",
    description: "Obtuviste tu primer reporte ambiental validado por el equipo.",
  },
  cinco_reportes: {
    key: "cinco_reportes",
    name: "Vecino comprometido",
    description: "Ya alcanzaste cinco reportes aprobados dentro de EcoRG.",
  },
  primer_reciclaje: {
    key: "primer_reciclaje",
    name: "Primera accion de reciclaje",
    description: "Registraste una accion de reciclaje validada por el equipo.",
  },
  cien_puntos: {
    key: "cien_puntos",
    name: "100 puntos verdes",
    description: "Superaste los 100 puntos con acciones ambientales reales.",
  },
  eco_heroe: {
    key: "eco_heroe",
    name: "Eco heroe",
    description: "Alcanzaste el maximo nivel actual de EcoRG.",
  },
};

function getLevelForPoints(points = 0) {
  const current = LEVELS.find((item) => points >= item.min);
  return current?.label || "Eco principiante";
}

function normalizeDescription(description = "") {
  return String(description || "").trim();
}

function hasBadge(user, badgeKey) {
  return Array.isArray(user?.badges) && user.badges.some((badge) => badge?.key === badgeKey);
}

function grantBadge(user, badgeKey) {
  const badge = BADGE_DEFINITIONS[badgeKey];
  if (!badge || hasBadge(user, badgeKey)) return false;

  user.badges.push({
    key: badge.key,
    name: badge.name,
    description: badge.description,
    earnedAt: new Date(),
  });
  return true;
}

export function calculatePoints(type) {
  return POINTS_BY_TYPE[type] ?? 0;
}

export async function updateUserLevel(userId) {
  const user = await User.findById(userId);
  if (!user) return null;

  user.level = getLevelForPoints(user.points || 0);
  const { user: syncedUser, awardedBadges } = await syncUserBadges(user);
  await syncedUser.save();
  await Promise.all(
    awardedBadges.map((badge) => notifyBadgeAwarded(syncedUser._id, badge))
  );
  return syncedUser;
}

export async function assignPoints(userId, points, options = {}) {
  const user = await User.findById(userId);
  if (!user) return null;

  user.points = Math.max(0, (user.points || 0) + points);
  user.level = getLevelForPoints(user.points);
  const { user: syncedUser, awardedBadges } = await syncUserBadges(user);
  await syncedUser.save();

  await notifyPointsAwarded(syncedUser._id, points, options.relatedId || null);
  await Promise.all(
    awardedBadges.map((badge) => notifyBadgeAwarded(syncedUser._id, badge))
  );

  return syncedUser;
}

export async function syncUserBadges(userOrId) {
  const user = typeof userOrId === "string"
    ? await User.findById(userOrId)
    : userOrId;

  if (!user) return { user: null, awardedBadges: [] };

  if (!Array.isArray(user.badges)) {
    user.badges = [];
  }

  const awardedBadges = [];

  const [approvedReports, approvedRecycling] = await Promise.all([
    EcoAction.countDocuments({
      userId: user._id,
      type: "reporte",
      status: "aprobada",
      description: REPORT_APPROVAL_DESCRIPTION,
    }),
    EcoAction.countDocuments({
      userId: user._id,
      type: "reciclaje",
      status: "aprobada",
    }),
  ]);

  if (approvedReports >= 1 && grantBadge(user, "primer_reporte")) {
    awardedBadges.push(BADGE_DEFINITIONS.primer_reporte);
  }
  if (approvedReports >= 5 && grantBadge(user, "cinco_reportes")) {
    awardedBadges.push(BADGE_DEFINITIONS.cinco_reportes);
  }
  if (approvedRecycling >= 1 && grantBadge(user, "primer_reciclaje")) {
    awardedBadges.push(BADGE_DEFINITIONS.primer_reciclaje);
  }
  if ((user.points || 0) >= 100 && grantBadge(user, "cien_puntos")) {
    awardedBadges.push(BADGE_DEFINITIONS.cien_puntos);
  }
  if ((user.points || 0) >= 1000 || user.level === "Eco héroe" || user.level === "Eco heroe") {
    if (grantBadge(user, "eco_heroe")) {
      awardedBadges.push(BADGE_DEFINITIONS.eco_heroe);
    }
  }

  return { user, awardedBadges };
}

export async function hasExceededDailyLimit(userId, date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const count = await EcoAction.countDocuments({
    userId,
    status: "aprobada",
    createdAt: { $gte: start, $lte: end },
  });

  return count >= DAILY_POINTS_LIMIT;
}

export async function hasRecentDuplicateAction({
  userId,
  type,
  description = "",
  relatedId = null,
}) {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const normalizedDescription = String(description || "").trim();
  const filter = {
    userId,
    type,
    createdAt: { $gte: since },
  };

  if (relatedId) {
    filter.relatedId = relatedId;
  } else if (normalizedDescription) {
    filter.description = normalizedDescription;
  }

  const existing = await EcoAction.findOne(filter).lean();
  return Boolean(existing);
}

export async function approveEcoAction(actionId) {
  const action = await EcoAction.findById(actionId);
  if (!action) {
    const error = new Error("Acción no encontrada");
    error.status = 404;
    throw error;
  }

  if (action.status === "aprobada") {
    return action;
  }

  if (action.status === "rechazada") {
    const error = new Error("No se puede aprobar una acción ya rechazada");
    error.status = 400;
    throw error;
  }

  if (await hasExceededDailyLimit(action.userId, action.createdAt || new Date())) {
    const error = new Error("El usuario ya alcanzó el máximo diario de acciones con puntos");
    error.status = 400;
    throw error;
  }

  action.status = "aprobada";
  if (!action.points) {
    action.points = calculatePoints(action.type);
  }
  await action.save();
  await assignPoints(action.userId, action.points, {
    relatedId: action.relatedId || null,
  });
  return action;
}

export async function rejectEcoAction(actionId) {
  const action = await EcoAction.findById(actionId);
  if (!action) {
    const error = new Error("Acción no encontrada");
    error.status = 404;
    throw error;
  }

  if (action.status === "aprobada") {
    const error = new Error("No se puede rechazar una acción ya aprobada");
    error.status = 400;
    throw error;
  }

  action.status = "rechazada";
  await action.save();
  return action;
}

export async function ensurePendingEcoAction({
  userId,
  type,
  points,
  description,
  relatedId = null,
  image = "",
}) {
  const normalizedDescription = normalizeDescription(description);
  const existing = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
  });

  if (existing) {
    return existing;
  }

  return EcoAction.create({
    userId,
    type,
    points: points ?? calculatePoints(type),
    status: "pendiente",
    description: normalizedDescription,
    relatedId,
    image: String(image || "").trim(),
  });
}

export async function approvePendingEcoActionByRelated({
  userId,
  type,
  relatedId,
  description,
  points,
}) {
  const normalizedDescription = normalizeDescription(description);
  const existingApproved = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
    status: "aprobada",
  });

  if (existingApproved) {
    return { action: existingApproved, awarded: false, alreadyAwarded: true };
  }

  const pending = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
    status: "pendiente",
  });

  if (pending) {
    pending.points = points ?? pending.points ?? calculatePoints(type);
    await pending.save();
    const action = await approveEcoAction(pending._id);
    return { action, awarded: true, alreadyAwarded: false };
  }

  const action = await createSystemApprovedEcoAction({
    userId,
    type,
    points: points ?? calculatePoints(type),
    description: normalizedDescription,
    relatedId,
  });

  return { action, awarded: true, alreadyAwarded: false };
}

export async function rejectPendingEcoActionByRelated({
  userId,
  type,
  relatedId,
  description,
}) {
  const normalizedDescription = normalizeDescription(description);
  const action = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
    status: "pendiente",
  });

  if (!action) {
    return null;
  }

  action.status = "rechazada";
  await action.save();
  return action;
}

export async function createSystemApprovedEcoAction({
  userId,
  type,
  points,
  description,
  relatedId = null,
}) {
  const normalizedDescription = normalizeDescription(description);

  const existing = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
    status: "aprobada",
  });

  if (existing) {
    return existing;
  }

  const pending = await EcoAction.findOne({
    userId,
    type,
    relatedId,
    description: normalizedDescription,
    status: "pendiente",
  });

  if (pending) {
    pending.points = points;
    await pending.save();
    return approveEcoAction(pending._id);
  }

  const action = await EcoAction.create({
    userId,
    type,
    points,
    status: "aprobada",
    description: normalizedDescription,
    relatedId,
  });

  await assignPoints(userId, points, { relatedId: relatedId || null });
  return action;
}

export {
  BADGE_DEFINITIONS,
  DAILY_POINTS_LIMIT,
  DUPLICATE_WINDOW_MS,
  LEVELS,
  REPORT_APPROVAL_DESCRIPTION,
  REPORT_RESOLVED_BONUS_DESCRIPTION,
};
