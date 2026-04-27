import Barrio from "../models/barriosModel.js";

function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBarrioPayload(body = {}) {
  return {
    nombre: normalizeSpaces(body.nombre || ""),
    ciudad: normalizeSpaces(body.ciudad || "Río Gallegos") || "Río Gallegos",
    provincia: normalizeSpaces(body.provincia || "Santa Cruz") || "Santa Cruz",
    activo: body.activo !== undefined ? Boolean(body.activo) : true,
  };
}

export async function listBarrios(req, res) {
  try {
    const items = await Barrio.find().sort({ nombre: 1 });
    res.json(items);
  } catch (error) {
    console.error("LIST_BARRIOS_ERROR:", error);
    res.status(500).json({ error: "No se pudieron cargar los barrios" });
  }
}

export async function createBarrio(req, res) {
  try {
    const payload = buildBarrioPayload(req.body);

    if (!payload.nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const exists = await Barrio.findOne({
      nombre: new RegExp(`^${escapeRegex(payload.nombre)}$`, "i"),
    });

    if (exists) {
      return res.status(409).json({ error: "Ya existe un barrio con ese nombre" });
    }

    const barrio = await Barrio.create(payload);
    res.status(201).json(barrio);
  } catch (error) {
    console.error("CREATE_BARRIO_ERROR:", error);
    res.status(500).json({ error: "No se pudo crear el barrio" });
  }
}

export async function updateBarrio(req, res) {
  try {
    const { id } = req.params;
    const payload = buildBarrioPayload(req.body);

    if (!payload.nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const exists = await Barrio.findOne({
      _id: { $ne: id },
      nombre: new RegExp(`^${escapeRegex(payload.nombre)}$`, "i"),
    });

    if (exists) {
      return res.status(409).json({ error: "Ya existe un barrio con ese nombre" });
    }

    const updated = await Barrio.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Barrio no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE_BARRIO_ERROR:", error);
    res.status(500).json({ error: "No se pudo actualizar el barrio" });
  }
}

export async function deleteBarrio(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Barrio.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Barrio no encontrado" });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("DELETE_BARRIO_ERROR:", error);
    res.status(500).json({ error: "No se pudo eliminar el barrio" });
  }
}
