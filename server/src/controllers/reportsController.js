import Report from "../models/reportModel.js";
import EcoAction from "../models/ecoActionModel.js";
import {
  REPORT_APPROVAL_DESCRIPTION,
  REPORT_RESOLVED_BONUS_DESCRIPTION,
  approvePendingEcoActionByRelated,
  createSystemApprovedEcoAction,
  ensurePendingEcoAction,
  rejectPendingEcoActionByRelated,
} from "../services/gamificationService.js";
import {
  notifyReportApproved,
  notifyReportInReview,
  notifyReportRejected,
  notifyReportResolved,
} from "../services/notificationService.js";

const REPORT_POPULATE = {
  path: "user",
  select: "nombre email role points level",
};

function codeFromId(id) {
  const short = id.toString().slice(-6).toUpperCase();
  return `RG-${short}`;
}

function buildLocationPatch(lng, lat) {
  const hasCoords = Number.isFinite(Number(lng)) && Number.isFinite(Number(lat));
  if (!hasCoords) return undefined;

  return {
    type: "Point",
    coordinates: [Number(lng), Number(lat)],
  };
}

async function populateReport(docOrId) {
  const report = typeof docOrId === "string"
    ? await Report.findById(docOrId)
    : docOrId;

  if (!report) return null;
  await report.populate(REPORT_POPULATE);
  return report;
}

function buildReportResponse(report, gamification = null) {
  if (!report) return null;
  const serialized = typeof report.toObject === "function" ? report.toObject() : { ...report };
  if (gamification) {
    serialized.gamification = gamification;
  }
  return serialized;
}

async function hasResolvedBonusAssigned(userId, relatedId) {
  if (!userId || !relatedId) return false;
  const existing = await EcoAction.findOne({
    userId,
    type: "reporte",
    relatedId,
    description: REPORT_RESOLVED_BONUS_DESCRIPTION,
    status: "aprobada",
  }).lean();

  return Boolean(existing);
}

export async function createReport(req, res) {
  try {
    const { barrio, titulo, direccion, descripcion, severidad, lng, lat, status } = req.body;
    const fotos = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const location = buildLocationPatch(lng, lat);

    const doc = await Report.create({
      user: req.user?.id,
      barrio,
      titulo,
      direccion,
      descripcion,
      severidad,
      status: status || "pending",
      estado: "abierto",
      ...(location ? { location } : {}),
      fotos,
    });

    if (!doc.code) {
      doc.code = codeFromId(doc._id);
      await doc.save();
    }

    if (doc.user) {
      await ensurePendingEcoAction({
        userId: doc.user,
        type: "reporte",
        points: 20,
        description: REPORT_APPROVAL_DESCRIPTION,
        relatedId: doc._id,
        image: fotos[0] || "",
      });
    }

    const hydrated = await populateReport(doc);
    res.status(201).json(buildReportResponse(hydrated));
  } catch (error) {
    console.error("CREATE_REPORT_ERROR:", error);
    res.status(500).json({ error: "No se pudo crear el reporte" });
  }
}

export async function listReports(req, res) {
  try {
    const { q, barrio, estado, severidad, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (barrio) filter.barrio = barrio;
    if (estado) filter.estado = estado;
    if (status) filter.status = status;
    if (severidad) filter.severidad = severidad;
    if (q) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { code: regex },
        { titulo: regex },
        { direccion: regex },
        { descripcion: regex },
        { barrio: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Report.find(filter)
        .populate(REPORT_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("LIST_REPORTS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron obtener los reportes" });
  }
}

export async function getReport(req, res) {
  const doc = await Report.findById(req.params.id).populate(REPORT_POPULATE);
  if (!doc) return res.status(404).json({ error: "No encontrado" });
  res.json(buildReportResponse(doc));
}

export async function updateReport(req, res) {
  try {
    const { barrio, titulo, direccion, descripcion, severidad, lng, lat } = req.body;
    const fotos = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const location = buildLocationPatch(lng, lat);
    const patch = {
      barrio,
      titulo,
      direccion,
      descripcion,
      severidad,
      ...(location ? { location } : {}),
      ...(fotos.length > 0 ? { fotos } : {}),
    };

    const doc = await Report.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!doc) return res.status(404).json({ error: "No encontrado" });
    const hydrated = await populateReport(doc);
    res.json(buildReportResponse(hydrated));
  } catch (error) {
    console.error("UPDATE_REPORT_ERROR:", error);
    res.status(500).json({ error: "No se pudo actualizar el reporte" });
  }
}

export async function deleteReport(req, res) {
  try {
    const doc = await Report.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (error) {
    console.error("DELETE_REPORT_ERROR:", error);
    res.status(500).json({ error: "No se pudo eliminar el reporte" });
  }
}

export async function setModerationStatus(req, res) {
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Status invalido" });
  }

  const patch = { status };
  if (status === "approved" || status === "rejected") {
    patch.estado = "abierto";
  }

  const previous = await Report.findById(req.params.id);
  if (!previous) return res.status(404).json({ error: "No encontrado" });

  const doc = await Report.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!doc) return res.status(404).json({ error: "No encontrado" });

  let gamification = null;

  if (previous.status !== "approved" && status === "approved" && doc.user) {
    const result = await approvePendingEcoActionByRelated({
      userId: doc.user,
      type: "reporte",
      relatedId: doc._id,
      description: REPORT_APPROVAL_DESCRIPTION,
      points: 20,
    });

    gamification = result?.alreadyAwarded
      ? {
          action: "approval_points",
          awarded: false,
          message: "Este reporte ya tenia puntos asignados.",
        }
      : {
          action: "approval_points",
          awarded: true,
          message: "Reporte aprobado y puntos asignados.",
        };
  }

  if (previous.status !== "rejected" && status === "rejected" && doc.user) {
    await rejectPendingEcoActionByRelated({
      userId: doc.user,
      type: "reporte",
      relatedId: doc._id,
      description: REPORT_APPROVAL_DESCRIPTION,
    });
  }

  if (previous.status !== "approved" && status === "approved" && doc.user) {
    await notifyReportApproved(doc.user, doc);
  }

  if (previous.status !== "rejected" && status === "rejected" && doc.user) {
    await notifyReportRejected(doc.user, doc);
  }

  const hydrated = await populateReport(doc);
  res.json(buildReportResponse(hydrated, gamification));
}

export async function setOperationalState(req, res) {
  const { estado } = req.body;

  if (!["abierto", "en_revision", "resuelto"].includes(estado)) {
    return res.status(400).json({ error: "Estado invalido" });
  }

  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ error: "No encontrado" });
  if (report.status !== "approved") {
    return res.status(400).json({
      error: "Solo se puede cambiar el estado operativo de reportes aprobados",
    });
  }

  const previousEstado = report.estado;
  report.estado = estado;
  await report.save();

  let gamification = null;

  if (previousEstado !== "resuelto" && estado === "resuelto" && report.user) {
    const alreadyAwarded = await hasResolvedBonusAssigned(report.user, report._id);

    if (!alreadyAwarded) {
      await createSystemApprovedEcoAction({
        userId: report.user,
        type: "reporte",
        points: 40,
        description: REPORT_RESOLVED_BONUS_DESCRIPTION,
        relatedId: report._id,
      });
    }

    gamification = alreadyAwarded
      ? {
          action: "resolved_bonus",
          awarded: false,
          message: "Este reporte ya tenia el bonus por resolucion asignado.",
        }
      : {
          action: "resolved_bonus",
          awarded: true,
          message: "Reporte resuelto y bonus asignado.",
        };
  }

  if (previousEstado !== "en_revision" && estado === "en_revision" && report.user) {
    await notifyReportInReview(report.user, report);
  }

  if (previousEstado !== "resuelto" && estado === "resuelto" && report.user) {
    await notifyReportResolved(report.user, report);
  }

  const hydrated = await populateReport(report);
  res.json(buildReportResponse(hydrated, gamification));
}
