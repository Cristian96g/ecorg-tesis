import Notification from "../models/notificationModel.js";

const DEDUPE_WINDOW_MS = 5 * 60 * 1000;

function normalizeText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export async function createNotification({
  userId,
  title,
  message,
  type = "sistema",
  relatedId = null,
}) {
  if (!userId) return null;

  const safeTitle = normalizeText(title);
  const safeMessage = normalizeText(message);

  if (!safeTitle || !safeMessage) return null;

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const existing = await Notification.findOne({
    userId,
    type,
    title: safeTitle,
    message: safeMessage,
    relatedId: relatedId || null,
    createdAt: { $gte: since },
  }).lean();

  if (existing) {
    return existing;
  }

  return Notification.create({
    userId,
    title: safeTitle,
    message: safeMessage,
    type,
    relatedId,
  });
}

export async function notifyReportApproved(userId, report) {
  return createNotification({
    userId,
    type: "reporte",
    relatedId: report?._id || null,
    title: "Tu reporte fue aprobado",
    message: `El reporte "${report?.titulo || "ambiental"}" fue validado por el equipo de EcoRG.`,
  });
}

export async function notifyReportRejected(userId, report) {
  return createNotification({
    userId,
    type: "reporte",
    relatedId: report?._id || null,
    title: "Tu reporte fue rechazado",
    message: `El reporte "${report?.titulo || "ambiental"}" no pudo ser validado por el equipo.`,
  });
}

export async function notifyReportInReview(userId, report) {
  return createNotification({
    userId,
    type: "reporte",
    relatedId: report?._id || null,
    title: "Tu reporte está en revisión",
    message: `El reporte "${report?.titulo || "ambiental"}" ahora está siendo gestionado por el equipo.`,
  });
}

export async function notifyReportResolved(userId, report) {
  return createNotification({
    userId,
    type: "reporte",
    relatedId: report?._id || null,
    title: "Tu reporte fue marcado como resuelto",
    message: `El reporte "${report?.titulo || "ambiental"}" fue marcado como resuelto dentro de EcoRG.`,
  });
}

export async function notifyPointsAwarded(userId, points, relatedId = null) {
  if (!points) return null;

  return createNotification({
    userId,
    type: "gamificacion",
    relatedId,
    title: "Ganaste puntos verdes",
    message: `Ganaste ${points} puntos verdes por una acción ambiental validada.`,
  });
}

export async function notifyBadgeAwarded(userId, badge) {
  if (!badge?.name) return null;

  return createNotification({
    userId,
    type: "gamificacion",
    title: `Obtuviste el logro ${badge.name}`,
    message: badge.description || "Conseguiste una nueva insignia dentro de EcoRG.",
  });
}
