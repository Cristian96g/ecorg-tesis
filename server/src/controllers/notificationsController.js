import Notification from "../models/notificationModel.js";

function buildResponse(items) {
  const list = Array.isArray(items) ? items : [];
  return {
    items: list,
    unreadCount: list.filter((item) => !item.read).length,
  };
}

export async function listMyNotifications(req, res) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
    const items = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(buildResponse(items));
  } catch (error) {
    console.error("LIST_NOTIFICATIONS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron cargar las notificaciones" });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    ).lean();

    if (!item) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.json(item);
  } catch (error) {
    console.error("READ_NOTIFICATION_ERROR:", error);
    res.status(500).json({ error: "No se pudo marcar la notificación" });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({
      ok: true,
      updated: result.modifiedCount || 0,
    });
  } catch (error) {
    console.error("READ_ALL_NOTIFICATIONS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron marcar las notificaciones" });
  }
}

export async function deleteNotification(req, res) {
  try {
    const item = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();

    if (!item) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("DELETE_NOTIFICATION_ERROR:", error);
    res.status(500).json({ error: "No se pudo eliminar la notificación" });
  }
}
