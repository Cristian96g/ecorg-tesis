import Point, { MATERIAL_ALIASES, MATERIAL_TYPES } from "../models/pointModel.js";

function normalizeMaterial(value) {
  const clean = String(value || "").trim().toLowerCase();
  return MATERIAL_ALIASES[clean] || clean;
}

function normalizeTypes(types) {
  const arr = Array.isArray(types) ? types : [types];
  return [...new Set(
    arr
      .map(normalizeMaterial)
      .filter((type) => MATERIAL_TYPES.includes(type))
  )];
}

function normalizePointForResponse(pointDoc) {
  const point = pointDoc?.toObject ? pointDoc.toObject() : pointDoc;
  return {
    ...point,
    types: normalizeTypes(point?.types || []),
  };
}

function parseCoordinate(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPointPayload(body, { partial = false } = {}) {
  const payload = {};
  const errors = [];

  if (body.title !== undefined || !partial) {
    const title = String(body.title || "").trim();
    if (!title) {
      errors.push("El título es obligatorio.");
    } else {
      payload.title = title;
    }
  }

  if (body.address !== undefined || !partial) {
    const address = String(body.address || "").trim();
    if (!address) {
      errors.push("La dirección es obligatoria.");
    } else {
      payload.address = address;
    }
  }

  if (body.barrio !== undefined) {
    payload.barrio = String(body.barrio || "").trim();
  } else if (!partial) {
    payload.barrio = "";
  }

  if (body.estado !== undefined) {
    if (!["activo", "inactivo"].includes(body.estado)) {
      errors.push("El estado es inválido.");
    } else {
      payload.estado = body.estado;
    }
  } else if (!partial) {
    payload.estado = "activo";
  }

  if (body.types !== undefined || !partial) {
    payload.types = normalizeTypes(body.types || []);
  }

  const hasLng = body.lng !== undefined;
  const hasLat = body.lat !== undefined;
  const hasCoordinates =
    Array.isArray(body.location?.coordinates) && body.location.coordinates.length >= 2;

  if (!partial || hasLng || hasLat || hasCoordinates) {
    const lng = hasCoordinates
      ? parseCoordinate(body.location.coordinates[0])
      : parseCoordinate(body.lng);
    const lat = hasCoordinates
      ? parseCoordinate(body.location.coordinates[1])
      : parseCoordinate(body.lat);

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      errors.push("Las coordenadas son obligatorias y deben ser válidas.");
    } else {
      payload.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }
  }

  return { payload, errors };
}

export async function listPoints(req, res) {
  const { tipo, barrio, estado } = req.query;
  const filter = {};

  if (tipo) {
    filter.types = normalizeMaterial(tipo);
  }
  if (barrio) filter.barrio = barrio;
  if (estado) filter.estado = estado;

  const items = await Point.find(filter).sort({ createdAt: -1 });
  res.json(items.map(normalizePointForResponse));
}

export async function createPoint(req, res) {
  const { payload, errors } = buildPointPayload(req.body, { partial: false });

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  const doc = await Point.create(payload);
  res.status(201).json(normalizePointForResponse(doc));
}

export async function updatePoint(req, res) {
  const { payload, errors } = buildPointPayload(req.body, { partial: true });

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  const doc = await Point.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return res.status(404).json({ error: "Punto verde no encontrado." });
  }

  res.json(normalizePointForResponse(doc));
}

export async function deletePoint(req, res) {
  const deleted = await Point.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Punto verde no encontrado." });
  }

  res.json({ ok: true });
}
