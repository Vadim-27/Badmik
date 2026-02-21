

// lib/http/api.ts
import axios, { CanceledError, isCancel } from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// корисно для зв'язки логів клієнт ↔ proxy
// function makeReqId() {
//   return Math.random().toString(36).slice(2, 10);
// }

// api.interceptors.request.use((config) => {
//   const url = (config.baseURL ?? '') + (config.url ?? '');
//   const method = (config.method ?? 'get').toUpperCase();
//   // console.log(`[API ▶] ${method} ${url}`);
//   return config;
// });

// api.interceptors.response.use(
//   (res) => {
//     const url = (res.config.baseURL ?? '') + (res.config.url ?? '');
//     const method = (res.config.method ?? 'get').toUpperCase();
//     console.log(`[API ◀] ${method} ${url} → ${res.status}`);
//     return res;
//   },
//   (err) => {
//     if (err instanceof CanceledError || isCancel(err) || err?.code === 'ERR_CANCELED') {
//       return Promise.reject(err);
//     }
//     const url = (err?.config?.baseURL ?? '') + (err?.config?.url ?? '');
//     const method = (err?.config?.method ?? 'get').toUpperCase();
//     // console.error(
//     //   `[API ✖] ${method} ${url} →`,
//     //   'status:', err?.response?.status, 'message:', err?.message, 'code:', err?.code
//     // );
//     return Promise.reject(err);
//   }
// );


// export default api;
