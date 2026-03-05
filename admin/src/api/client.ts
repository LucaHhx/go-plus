import axios from 'axios';

/** Deep convert snake_case keys to camelCase */
function toCamel(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [toCamel(k), camelizeKeys(v)])
    );
  }
  return obj;
}

const adminApi = axios.create({
  baseURL: '/api/admin',
  timeout: 10000,
});

adminApi.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem('admin_auth');
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch { /* ignore */ }
  return config;
});

adminApi.interceptors.response.use(
  (res) => {
    // Unwrap unified response: {code: 0, message: "...", data: <business>} -> <business>
    if (res.data && typeof res.data === 'object' && 'code' in res.data) {
      res.data = res.data.data;
    }
    // Convert snake_case keys to camelCase
    res.data = camelizeKeys(res.data);
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_auth');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

/** Convert params object keys to snake_case for backend query params */
function snakeParams(params?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!params) return params;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    result[k.replace(/[A-Z]/g, c => '_' + c.toLowerCase())] = v;
  }
  return result;
}

function get<T = unknown>(url: string, config?: Record<string, unknown>) {
  if (config?.params) {
    config = { ...config, params: snakeParams(config.params as Record<string, unknown>) };
  }
  return adminApi.get<T>(url, config).then(r => r.data);
}
function post<T = unknown>(url: string, data?: object) {
  return adminApi.post<T>(url, data).then(r => r.data);
}
function put<T = unknown>(url: string, data?: object) {
  return adminApi.put<T>(url, data).then(r => r.data);
}
function del<T = unknown>(url: string) {
  return adminApi.delete<T>(url).then(r => r.data);
}

// --- Auth ---
// Backend: {token, admin: {id, username, nickname, role}}
export const authApi = {
  login: (data: { username: string; password: string }) =>
    post<{ token: string; admin: { username: string } }>('/auth/login', data)
      .then(res => ({ token: res.token, username: res.admin?.username || '' })),
  me: () => get<{ username: string; role: string }>('/auth/me'),
};

// --- Dashboard ---
// Backend: {today: {...}, week: {...}, total: {...}} -- mapping done in DashboardPage
export const dashboardApi = {
  stats: () => get('/dashboard/stats'),
};

// --- Users ---
// Backend: {users: [...], total, page, page_size}
export const userMgmtApi = {
  list: (params: object) =>
    get<{ users: unknown[]; total: number }>('/users', { params })
      .then(res => ({ items: res.users || [], total: res.total || 0 })),
  // Backend: {user: {...}, wallet: {...}, recent_transactions: [...]}
  detail: (id: string) => get(`/users/${id}`),
  updateStatus: (id: string, status: string) => put(`/users/${id}/status`, { status }),
};

// --- Games ---
// Backend: {games: [...], total, page, page_size}
export const gameMgmtApi = {
  list: (params: object) =>
    get<{ games: unknown[]; total: number }>('/games', { params })
      .then(res => ({ items: res.games || [], total: res.total || 0 })),
  update: (id: string, data: object) => put(`/games/${id}`, data),
  updateStatus: (id: string, status: string) => put(`/games/${id}/status`, { status }),
};

// --- Providers ---
// Backend: {providers: [...], total}
export const providerMgmtApi = {
  list: () =>
    get<{ providers: unknown[]; total: number }>('/providers')
      .then(res => ({ items: res.providers || [], total: res.total || 0 })),
  create: (data: object) => post('/providers', data),
  update: (id: string, data: object) => put(`/providers/${id}`, data),
  updateStatus: (id: string, status: string) => put(`/providers/${id}/status`, { status }),
};

// --- Transactions ---
// Backend: {transactions: [...], total, page, page_size}
export const transactionMgmtApi = {
  list: (params: object) =>
    get<{ transactions: unknown[]; total: number }>('/transactions', { params })
      .then(res => ({ items: res.transactions || [], total: res.total || 0 })),
  pendingWithdrawals: () =>
    get<{ transactions: unknown[] }>('/withdrawals/pending')
      .then(res => ({ items: res.transactions || [] })),
  withdrawals: (params: object) =>
    get<{ transactions: unknown[]; total: number }>('/withdrawals', { params })
      .then(res => ({ items: res.transactions || [], total: res.total || 0 })),
  approve: (id: string, remark?: string) => put(`/withdrawals/${id}/approve`, { remark }),
  reject: (id: string, remark?: string) => put(`/withdrawals/${id}/reject`, { remark }),
};

// --- Banners ---
// Backend: {banners: [...], total}
export const bannerMgmtApi = {
  list: () =>
    get<{ banners: unknown[]; total: number }>('/banners')
      .then(res => ({ items: res.banners || [], total: res.total || 0 })),
  create: (data: object) => post('/banners', data),
  update: (id: string, data: object) => put(`/banners/${id}`, data),
  remove: (id: string) => del(`/banners/${id}`),
};

// --- Config ---
// Backend: {configs: {key: value, ...}}
// Config keys are stored as snake_case in DB; camelizeKeys auto-converts on read
function toSnake(str: string): string {
  return str.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

export const configMgmtApi = {
  get: () =>
    get<{ configs: Record<string, string> }>('/config')
      .then(res => res.configs || {}),
  update: (data: Record<string, unknown>) => {
    // Convert camelCase keys back to snake_case for backend
    const snaked: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      snaked[toSnake(k)] = v;
    }
    return put('/config', snaked);
  },
};
