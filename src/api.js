const BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const TOKEN_KEY = "nginaplangsung.token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Pastikan API berjalan.", 0, {});
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || `Permintaan gagal (HTTP ${res.status}).`;
    throw new ApiError(message, res.status, (data && data.errors) || {});
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = {
  listRooms: () => request("/rooms"),
  availability: () => request("/rooms/availability"),
  createBooking: (payload) => request("/bookings", { method: "POST", body: payload }),
  uploadProof: (kode, file) => {
    const fd = new FormData();
    fd.append("bukti", file, file.name || "bukti.jpg");
    return request(`/bookings/${encodeURIComponent(kode)}/proof`, { method: "POST", formData: fd });
  },
  getBooking: (kode) => request(`/bookings/${encodeURIComponent(kode)}`),

  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  logout: () => request("/auth/logout", { method: "POST", auth: true }),
  me: () => request("/auth/me", { auth: true }),

  adminStats: () => request("/admin/stats", { auth: true }),
  adminList: (perPage = 100) => request(`/admin/bookings?per_page=${perPage}`, { auth: true }),
  adminConfirm: (id) => request(`/admin/bookings/${id}/confirm`, { method: "PATCH", auth: true }),
  adminDelete: (id) => request(`/admin/bookings/${id}`, { method: "DELETE", auth: true }),
  adminClear: () => request("/admin/bookings", { method: "DELETE", auth: true }),
};
