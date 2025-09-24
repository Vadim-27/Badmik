// import axios from "axios";

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// // опційний response-інтерсептор (логування/алерти)
// api.interceptors.response.use(
//   (r) => r,
//   (e) => Promise.reject(e)
// );

// lib/http/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' },
});


let refreshing = false;
let waiters: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err || {};
    if (response?.status !== 401 || (config as any).__retried) {
      return Promise.reject(err);
    }

    if (refreshing) {
      await new Promise<void>((res) => waiters.push(res));
    } else {
      refreshing = true;
      try {
        await api.post('/auth/refresh');
        waiters.forEach((r) => r());
        waiters = [];
      } finally {
        refreshing = false;
      }
    }

    (config as any).__retried = true;
    return api.request(config);
  }
);

export default api;
