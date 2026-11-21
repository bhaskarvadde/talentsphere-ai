import axios from "axios";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return import.meta.env.PROD ? "" : "http://localhost:8080";
  }
  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl;
  }
  return `https://${envUrl}`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((cfg) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    cfg.headers.Authorization = `Bearer ${user.token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => {
  if (!e) return "An unexpected error occurred";
  if (e.response?.data) {
    if (typeof e.response.data === "string") return e.response.data;
    if (e.response.data.message) return e.response.data.message;
    if (e.response.data.error) return e.response.data.error;
    if (e.response.data.detail) return e.response.data.detail;
  }
  if (e.response?.status === 403) return "You are not authorized to perform this action.";
  return e.message || "Network request failed.";
};

export default api;
