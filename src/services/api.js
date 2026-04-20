// import axios from "axios";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
// const API_URL = `${BACKEND_URL}/api`;

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("civicshield_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("civicshield_token");
//       localStorage.removeItem("civicshield_user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export const authApi = {
//   login: (data) => api.post("/auth/login", data),
//   register: (data) => api.post("/auth/register", data),
//   getMe: () => api.get("/auth/me"),
// };

// export const usersApi = {
//   getAll: () => api.get("/users"),
//   update: (id, data) => api.patch(`/users/${id}`, data),
// };

// export const helpRequestsApi = {
//   getAll: () => api.get("/help-requests"),
//   getOne: (id) => api.get(`/help-requests/${id}`),
//   create: (data) => api.post("/help-requests", data),
//   update: (id, data) => api.patch(`/help-requests/${id}`, data),
//   accept: (id) => api.post(`/help-requests/${id}/accept`),
//   complete: (id) => api.post(`/help-requests/${id}/complete`),
// };

// export const volunteersApi = {
//   getAll: () => api.get("/volunteers"),
//   updateStatus: (status) =>
//     api.patch("/volunteers/status", null, { params: { status } }),
// };

// export const missionsApi = {
//   getAll: () => api.get("/missions"),
// };

// export const dashboardApi = {
//   getStats: () => api.get("/dashboard/stats"),
// };

// export const seedApi = {
//   seed: () => api.post("/seed"),
// };

// export default api;