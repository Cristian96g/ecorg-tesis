import axios from "axios";

const envBaseUrl = import.meta.env.VITE_API_URL?.trim();
const devFallbackUrl = import.meta.env.DEV ? "http://localhost:4000" : "";
const BASE_URL = (envBaseUrl || devFallbackUrl).replace(/\/+$/, "");

if (!BASE_URL) {
  throw new Error("VITE_API_URL no está definida para este entorno.");
}

const TOKEN_KEY = "ecorg_token";
const TOKEN_STORAGE_KEY = "ecorg_token_storage";
const REMEMBERED_EMAIL_KEY = "ecorg_remembered_email";

let unauthorizedHandler = null;

function hasWindow() {
  return typeof window !== "undefined";
}

function getStorage(storageName) {
  if (!hasWindow()) return null;
  return storageName === "session" ? window.sessionStorage : window.localStorage;
}

function getPreferredStorage() {
  const mode = hasWindow() ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  return mode === "session" ? "session" : "local";
}

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

export function setToken(token, remember = true) {
  const mode = remember ? "local" : "session";
  const targetStorage = getStorage(mode);
  const otherStorage = getStorage(mode === "local" ? "session" : "local");

  otherStorage?.removeItem(TOKEN_KEY);
  targetStorage?.setItem(TOKEN_KEY, token);

  if (hasWindow()) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, mode);
  }
}

export function getToken() {
  const localToken = getStorage("local")?.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  const sessionToken = getStorage("session")?.getItem(TOKEN_KEY);
  if (sessionToken) return sessionToken;

  return null;
}

export function clearToken() {
  getStorage("local")?.removeItem(TOKEN_KEY);
  getStorage("session")?.removeItem(TOKEN_KEY);
  if (hasWindow()) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function rememberEmail(email) {
  if (!hasWindow()) return;
  if (email) {
    window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim().toLowerCase());
  } else {
    window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
}

export function getRememberedEmail() {
  if (!hasWindow()) return "";
  return window.localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
}

export function clearRememberedEmail() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function isPersistentSession() {
  return getPreferredStorage() === "local";
}

export function getAssetUrl(assetPath) {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${BASE_URL}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}

function emitNotificationsUpdated() {
  if (hasWindow()) {
    window.dispatchEvent(new CustomEvent("ecorg:notifications-updated"));
  }
}

export function getFriendlyApiError(err, fallback = "Ocurrió un error inesperado.") {
  if (!err?.response) {
    if (err?.code === "ECONNABORTED") {
      return "La respuesta está tardando más de lo esperado. El servidor puede estar iniciándose. Esperá unos segundos e intentá nuevamente.";
    }

    if (err?.message === "Network Error") {
      return "No pudimos conectar con el servidor. Puede estar iniciándose o no estar disponible en este momento. Esperá unos segundos e intentá nuevamente.";
    }

    return "No pudimos conectar con el servidor. Verificá tu conexión e intentá nuevamente en unos segundos.";
  }

  const data = err.response.data;
  return data?.message || data?.error || fallback;
}

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) {
      if (err?.response) {
        console.error("API_ERROR_RESPONSE", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response.status,
          data: err.response.data,
        });
      } else {
        console.error("API_ERROR_NETWORK", {
          url: err.config?.url,
          method: err.config?.method,
          message: err.message,
        });
      }
    }

    if (err?.response?.status === 401) {
      clearToken();
      unauthorizedHandler?.();
    }

    return Promise.reject(err);
  }
);

export const AuthAPI = {
  login: async (email, password, options = {}) => {
    const { remember = true } = options;
    const { data } = await api.post("/auth/login", { email, password });
    if (data?.token) {
      setToken(data.token, remember);
    }
    if (remember) {
      rememberEmail(email);
    } else {
      clearRememberedEmail();
    }
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data?.token) setToken(data.token, true);
    if (payload?.email) {
      rememberEmail(payload.email);
    }
    return data;
  },
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  resetPassword: async (token, password) => {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
  },
  me: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },
  logout: () => clearToken(),
};

export const UsersAPI = {
  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  getRewardsCatalog: async () => {
    const { data } = await api.get("/users/me/rewards");
    return data;
  },

  redeemReward: async (rewardId) => {
    const { data } = await api.post(`/users/me/rewards/${rewardId}/redeem`);
    return data;
  },

  listAdminRewards: async () => {
    const { data } = await api.get("/users/admin/rewards");
    return data;
  },

  updateAdminReward: async (rewardId, payload) => {
    const { data } = await api.put(`/users/admin/rewards/${rewardId}`, payload);
    return data;
  },

  updateMe: async (profile, file) => {
    if (file) {
      const fd = new FormData();
      Object.entries(profile || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      fd.append("avatar", file);
      const { data } = await api.put("/users/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }

    const { data } = await api.put("/users/me", profile);
    return data;
  },

  setRole: async (userId, role) => {
    const { data } = await api.put(`/users/${userId}/role`, { userId, role });
    return data;
  },

  list: async (params = {}) => {
    const { data } = await api.get("/users", { params });
    return data?.items ?? data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

export const ReportsAPI = {
  list: async (params = {}) => (await api.get("/reports", { params })).data,
  get: async (id) => (await api.get(`/reports/${id}`)).data,
  create: async (payload) => {
    const body = buildReportPayload(payload);
    const config =
      body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
    return (await api.post("/reports", body, config)).data;
  },
  update: async (id, payload) => {
    const body = buildReportPayload(payload);
    const config =
      body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
    return (await api.put(`/reports/${id}`, body, config)).data;
  },
  remove: async (id) => (await api.delete(`/reports/${id}`)).data,
  setStatus: async (id, status) => (await api.put(`/reports/${id}/moderation`, { status })).data,
  setEstado: async (id, estado) => (await api.put(`/reports/${id}/estado`, { estado })).data,
};

function buildReportPayload(payload = {}) {
  const photos = payload?.fotos;
  const hasFiles =
    photos instanceof FileList
      ? photos.length > 0
      : Array.isArray(photos)
        ? photos.length > 0
        : photos instanceof File;

  if (!hasFiles) {
    return payload;
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "fotos" || value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  if (photos instanceof FileList) {
    Array.from(photos).forEach((file) => formData.append("fotos", file));
  } else if (Array.isArray(photos)) {
    photos.forEach((file) => file && formData.append("fotos", file));
  } else if (photos instanceof File) {
    formData.append("fotos", photos);
  }

  return formData;
}

export const PointsAPI = {
  list: async (params = {}) => {
    const { data } = await api.get("/points", { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/points/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/points", payload);
    return data;
  },
  update: async (id, patch) => {
    const { data } = await api.put(`/points/${id}`, patch);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/points/${id}`);
    return data;
  },
};

export const ScheduleAPI = {
  listAll: async () => {
    const { data } = await api.get("/recycling-schedule");
    return data;
  },
  byBarrio: async (barrio) => {
    const { data } = await api.get("/recycling-schedule", { params: { barrio } });
    return data;
  },
};

export const BarriosAPI = {
  list: async (params = {}) => {
    const { data } = await api.get("/barrios", { params });
    return data?.items ?? data;
  },
  create: async (payload) => {
    const { data } = await api.post("/barrios", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/barrios/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/barrios/${id}`);
    return data;
  },
};

export const EcoActionsAPI = {
  listMine: async () => {
    const { data } = await api.get("/eco-actions/me");
    return data;
  },
  listAll: async (params = {}) => {
    const { data } = await api.get("/eco-actions", { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/eco-actions", payload);
    return data;
  },
  approve: async (id) => {
    const { data } = await api.put(`/eco-actions/${id}/approve`);
    return data;
  },
  reject: async (id) => {
    const { data } = await api.put(`/eco-actions/${id}/reject`);
    return data;
  },
};

export const NotificationsAPI = {
  listMine: async (params = {}) => {
    const { data } = await api.get("/notifications/me", { params });
    return data;
  },
  markRead: async (id) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    emitNotificationsUpdated();
    return data;
  },
  markAllRead: async () => {
    const { data } = await api.put("/notifications/read-all");
    emitNotificationsUpdated();
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    emitNotificationsUpdated();
    return data;
  },
};
