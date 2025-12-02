import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Envia o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string | undefined = error?.config?.url;

    if (
      status === 401 &&
      url &&
      !url.includes("/login") &&
      !url.includes("/register")
    ) {
      // Limpa token e redireciona
      localStorage.removeItem("auth_token");
      alert("Sua sessão expirou. Faça login novamente.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
