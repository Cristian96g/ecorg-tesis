import jwt from "jsonwebtoken";

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.sign(payload, secret, {
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
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "SesiÃ³n vencida" });
    }
    return res.status(401).json({ error: "Token invÃ¡lido" });
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

