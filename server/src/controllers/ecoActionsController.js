import EcoAction, { ECO_ACTION_TYPES } from "../models/ecoActionModel.js";
import {
  approveEcoAction,
  calculatePoints,
  hasExceededDailyLimit,
  hasRecentDuplicateAction,
  rejectEcoAction,
} from "../services/gamificationService.js";

function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

export async function listMyEcoActions(req, res) {
  try {
    const items = await EcoAction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(items);
  } catch (error) {
    console.error("LIST_ECO_ACTIONS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron cargar las acciones ecológicas" });
  }
}

export async function listAdminEcoActions(req, res) {
  try {
    const { status, type, q } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const items = await EcoAction.find(filter)
      .populate("userId", "nombre email points level")
      .sort({ createdAt: -1 })
      .lean();

    const normalizedQuery = String(q || "").trim().toLowerCase();
    const filtered = !normalizedQuery
      ? items
      : items.filter((item) => {
          const haystack = [
            item.description,
            item.type,
            item.status,
            item.userId?.nombre,
            item.userId?.email,
            item.relatedId?.toString?.(),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        });

    res.json(filtered);
  } catch (error) {
    console.error("LIST_ADMIN_ECO_ACTIONS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron cargar las acciones ecológicas" });
  }
}

export async function createEcoAction(req, res) {
  try {
    const { type, description, image, relatedId } = req.body;
    const normalizedType = String(type || "").trim();
    const normalizedDescription = normalizeSpaces(description || "");

    if (!ECO_ACTION_TYPES.includes(normalizedType)) {
      return res.status(400).json({ error: "Tipo de acción inválido" });
    }

    if (!normalizedDescription) {
      return res.status(400).json({ error: "La descripción es obligatoria" });
    }

    if (await hasExceededDailyLimit(req.user.id)) {
      return res.status(400).json({
        error: "Ya alcanzaste el máximo diario de acciones con puntos",
      });
    }

    const duplicate = await hasRecentDuplicateAction({
      userId: req.user.id,
      type: normalizedType,
      description: normalizedDescription,
      relatedId: relatedId || null,
    });

    if (duplicate) {
      return res.status(409).json({
        error: "Ya registraste una acción similar hace poco tiempo",
      });
    }

    const action = await EcoAction.create({
      userId: req.user.id,
      type: normalizedType,
      points: calculatePoints(normalizedType),
      status: "pendiente",
      description: normalizedDescription,
      image: image ? String(image).trim() : "",
      relatedId: relatedId || null,
    });

    res.status(201).json(action);
  } catch (error) {
    console.error("CREATE_ECO_ACTION_ERROR:", error);
    res.status(500).json({ error: "No se pudo crear la acción ecológica" });
  }
}

export async function approveEcoActionController(req, res) {
  try {
    const action = await approveEcoAction(req.params.id);
    const hydrated = await EcoAction.findById(action._id)
      .populate("userId", "nombre email points level");
    res.json(hydrated);
  } catch (error) {
    console.error("APPROVE_ECO_ACTION_ERROR:", error);
    res.status(error.status || 500).json({
      error: error.message || "No se pudo aprobar la acción ecológica",
    });
  }
}

export async function rejectEcoActionController(req, res) {
  try {
    const action = await rejectEcoAction(req.params.id);
    const hydrated = await EcoAction.findById(action._id)
      .populate("userId", "nombre email points level");
    res.json(hydrated);
  } catch (error) {
    console.error("REJECT_ECO_ACTION_ERROR:", error);
    res.status(error.status || 500).json({
      error: error.message || "No se pudo rechazar la acción ecológica",
    });
  }
}
