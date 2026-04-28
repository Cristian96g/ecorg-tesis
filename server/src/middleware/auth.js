import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("Falta JWT_SECRET en las variables de entorno del servidor.");
  }
  return secret;
}

export function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

export function verifyJWT(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Sesión vencida" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function requireRole(role) {
  if (!["user", "admin"].includes(role)) role = "user";

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  };
}
