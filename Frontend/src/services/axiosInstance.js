import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5242/api",
});
/////////////////////////////////////////
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");

  if (stored) {
    const user = JSON.parse(stored);

    if (user?.token) {
      config.headers.Authorization =
        `Bearer ${user.token}`;
    }
  }

  return config;
});
/////////////////////////////////////////
api.interceptors.response.use(
  (res) => res,

  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.title ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default api;