import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';
const AUTH_URL = 'http://127.0.0.1:8000/api/auth';
const ADMIN_URL = 'http://127.0.0.1:8000/api/admin';

const defaultResearch = [
  {
    id: 1,
    ticker: "CTRA.JK",
    title: "Ciputra Group (CTRA) - Strong Pre-sales and Solid Financials",
    date: "SEP 23, 2025",
    readingTime: "5 min read",
    analyst: { name: "Budi Santoso", role: "Senior Equity Analyst, Real Estate", avatar: "BS", color: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    metrics: { rating: "BUY", targetPrice: "Rp 1,500", currentPrice: "Rp 1,250", upside: "+20.0%", riskLevel: "Medium", rawCurrentPrice: 1250, rawTargetPrice: 1500 },
    tags: ["Real Estate", "Pre-Sales", "Value"],
    sourceData: [" Laporan Keuangan & Keterbukaan Informasi", " Bank Indonesia: Data Suku Bunga", " Yahoo Finance: Historis Harga"],
    contentSections: [
      {
        id: "overview", title: "Executive Overview",
        body: `<p class="text-lg leading-relaxed text-slate-700 mb-6"><strong>Ciputra Development Tbk (CTRA)</strong> has demonstrated strong financial performance in early 2025, driven by robust pre-sales in key residential projects across major cities. We anticipate sustained growth momentum supported by favorable interest rate environments and government incentives for home buyers.</p>
        <div class="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 my-8">
            <h4 class="text-indigo-900 font-bold mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 2-1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Key Catalysts</h4>
            <ul class="list-disc pl-5 text-indigo-800 space-y-2">
                <li>Mortgage rate cuts expected in Q3 2025.</li>
                <li>Expansion of premium residential clusters in Greater Jakarta.</li>
                <li>Strong balance sheet with declining debt-to-equity ratio.</li>
            </ul>
        </div>`
      }
    ]
  },
  {
    id: 2,
    ticker: "TLKM.JK",
    title: "Telkom Indonesia (TLKM) - Expanding Digital Infrastructure",
    date: "JAN 9, 2026",
    readingTime: "7 min read",
    analyst: { name: "Siti Rahma", role: "TMT Sector Head", avatar: "SR", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    metrics: { rating: "HOLD", targetPrice: "Rp 4,100", currentPrice: "Rp 3,950", upside: "+3.7%", riskLevel: "Low", rawCurrentPrice: 3950, rawTargetPrice: 4100 },
    tags: ["Telecom", "Tech", "Dividend Yield"],
    sourceData: [" Laporan Kinerja Tahunan Telkom Indonesia", " Riset Data Center"],
    contentSections: [
      { id: "overview", title: "Sector Domination", body: `<p class="text-lg leading-relaxed text-slate-700"><strong>Telkom Indonesia (TLKM)</strong> continues its strategic push into data centers and B2B IT solutions, offsetting the plateauing growth in legacy mobile segments. While dividend yields remain attractive, near-term capital expenditures may constrain free cash flow generation.</p>` }
    ]
  },
  {
    id: 3,
    ticker: "VALE.JK",
    title: "PT Vale Indonesia Tbk (INCO) - Nickel Market Dynamic",
    date: "AUG 13, 2025",
    readingTime: "6 min read",
    analyst: { name: "Anto Wijaya", role: "Commodities Analyst", avatar: "AW", color: "bg-gradient-to-br from-amber-500 to-orange-600" },
    metrics: { rating: "BUY", targetPrice: "Rp 4,800", currentPrice: "Rp 4,100", upside: "+17.1%", riskLevel: "High", rawCurrentPrice: 4100, rawTargetPrice: 4800 },
    tags: ["Mining", "Nickel", "ESG"],
    sourceData: [" Laporan Keuangan Vale Indonesia", " Laporan Komoditas Nikel Dunia"],
    contentSections: [
      { id: "overview", title: "Nickel Demand", body: `<p class="text-lg leading-relaxed text-slate-700"><strong>PT Vale Indonesia Tbk (INCO)</strong> remains key player in the electric vehicle supply chain. We project a recovery in nickel prices by late 2025, lifting revenue growth.</p>` }
    ]
  }
];

const useStore = create(
  persist(
    (set, get) => ({
      // ─── Auth State ───
      isLoggedIn: false,
      currentUser: null,  // { user_id, username, is_admin, is_active }

      login: async (username, password) => {
        const res = await axios.post(`${AUTH_URL}/login`, { username, password });
        const data = res.data;
        set({ isLoggedIn: true, currentUser: data });
        axios.defaults.headers.common['X-User-Username'] = data.username;
        return data;
      },

      register: async (payload) => {
        const res = await axios.post(`${AUTH_URL}/register`, payload);
        const data = res.data;
        set({ isLoggedIn: true, currentUser: data });
        axios.defaults.headers.common['X-User-Username'] = data.username;
        return data;
      },

      logout: () => {
        set({
          isLoggedIn: false,
          currentUser: null,
          userProfile: null,
          watchlists: [],
          trades: [],
          alerts: [],
          notes: [],
          adminUsers: [],
        });
        delete axios.defaults.headers.common['X-User-Username'];
      },

      // ─── Forgot Password ───
      forgotGetQuestion: async (username) => {
        const res = await axios.post(`${AUTH_URL}/forgot-password/question`, { username });
        return res.data;
      },

      forgotVerifyAnswer: async (username, security_answer) => {
        const res = await axios.post(`${AUTH_URL}/forgot-password/verify`, { username, security_answer });
        return res.data;
      },

      forgotResetPassword: async (username, security_answer, new_password) => {
        const res = await axios.post(`${AUTH_URL}/forgot-password/reset`, { username, security_answer, new_password });
        return res.data;
      },

      // ─── User Profile ───
      userProfile: null,

      fetchUserProfile: async () => {
        try {
          const res = await axios.get(`${API_URL}/user/profile`);
          set({ userProfile: res.data });
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      },

      updateUserProfile: async (risk_profile) => {
        try {
          const res = await axios.put(`${API_URL}/user/profile`, { risk_profile });
          set({ userProfile: res.data });
        } catch (error) {
          console.error("Failed to update user profile", error);
        }
      },

      // ─── Admin ───
      adminUsers: [],

      fetchAdminUsers: async () => {
        try {
          const res = await axios.get(`${ADMIN_URL}/users`);
          set({ adminUsers: res.data });
        } catch (error) {
          console.error("Failed to fetch admin users", error);
          throw error;
        }
      },

      adminToggleUser: async (userId) => {
        try {
          const res = await axios.put(`${ADMIN_URL}/users/${userId}/toggle`);
          set((state) => ({
            adminUsers: state.adminUsers.map(u => u.id === userId ? res.data : u),
          }));
        } catch (error) {
          console.error("Failed to toggle user", error);
          throw error;
        }
      },

      adminResetPassword: async (userId, newPassword) => {
        try {
          const res = await axios.put(`${ADMIN_URL}/users/${userId}/reset-password`, { new_password: newPassword });
          return res.data;
        } catch (error) {
          console.error("Failed to reset password", error);
          throw error;
        }
      },

      adminDeleteUser: async (userId) => {
        try {
          await axios.delete(`${ADMIN_URL}/users/${userId}`);
          set((state) => ({
            adminUsers: state.adminUsers.filter(u => u.id !== userId),
          }));
        } catch (error) {
          console.error("Failed to delete user", error);
          throw error;
        }
      },

      // ─── Watchlists ───
      watchlists: [],

      fetchWatchlists: async () => {
        try {
          const res = await axios.get(`${API_URL}/watchlists`);
          set({ watchlists: res.data });
        } catch (error) {
          console.error("Failed to fetch watchlists", error);
        }
      },
      addWatchlist: async (ticker) => {
        try {
          const res = await axios.post(`${API_URL}/watchlists`, { ticker });
          set((state) => ({ watchlists: [...state.watchlists, res.data] }));
        } catch (error) {
          console.error("Failed to add watchlist", error);
        }
      },
      removeWatchlist: async (id) => {
        try {
          await axios.delete(`${API_URL}/watchlists/${id}`);
          set((state) => ({ watchlists: state.watchlists.filter(w => w.id !== id) }));
        } catch (error) {
          console.error("Failed to remove watchlist", error);
        }
      },

      // ─── Trades ───
      trades: [],

      fetchTrades: async () => {
        try {
          const res = await axios.get(`${API_URL}/trades`);
          set({ trades: res.data });
        } catch (error) {
          console.error("Failed to fetch trades", error);
        }
      },
      addTrade: async (trade) => {
        try {
          const res = await axios.post(`${API_URL}/trades`, trade);
          set((state) => ({ trades: [...state.trades, res.data] }));
        } catch (error) {
          console.error("Failed to add trade", error);
        }
      },
      removeTrade: async (id) => {
        try {
          await axios.delete(`${API_URL}/trades/${id}`);
          set((state) => ({ trades: state.trades.filter(t => t.id !== id) }));
        } catch (error) {
          console.error("Failed to remove trade", error);
        }
      },

      // ─── Alerts ───
      alerts: [],

      fetchAlerts: async () => {
        try {
          const res = await axios.get(`${API_URL}/alerts`);
          set({ alerts: res.data });
        } catch (error) {
          console.error("Failed to fetch alerts", error);
        }
      },
      addAlert: async (alert) => {
        try {
          const res = await axios.post(`${API_URL}/alerts`, alert);
          set((state) => ({ alerts: [...state.alerts, res.data] }));
        } catch (error) {
          console.error("Failed to add alert", error);
        }
      },
      updateAlertStatus: async (id, status) => {
        try {
          const res = await axios.put(`${API_URL}/alerts/${id}?status=${status}`);
          set((state) => ({
            alerts: state.alerts.map(a => a.id === id ? res.data : a)
          }));
        } catch (error) {
          console.error("Failed to update alert status", error);
        }
      },
      removeAlert: async (id) => {
        try {
          await axios.delete(`${API_URL}/alerts/${id}`);
          set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) }));
        } catch (error) {
          console.error("Failed to remove alert", error);
        }
      },

      // ─── Notes ───
      notes: [],

      fetchNotes: async () => {
        try {
          const res = await axios.get(`${API_URL}/notes`);
          set({ notes: res.data });
        } catch (error) {
          console.error("Failed to fetch notes", error);
        }
      },
      addNote: async (note) => {
        try {
          const res = await axios.post(`${API_URL}/notes`, note);
          set((state) => ({ notes: [...state.notes, res.data] }));
        } catch (error) {
          console.error("Failed to add note", error);
        }
      },
      updateNote: async (id, note) => {
        try {
          const res = await axios.put(`${API_URL}/notes/${id}`, note);
          set((state) => ({
            notes: state.notes.map(n => n.id === id ? res.data : n)
          }));
        } catch (error) {
          console.error("Failed to update note", error);
        }
      },
      removeNote: async (id) => {
        try {
          await axios.delete(`${API_URL}/notes/${id}`);
          set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
        } catch (error) {
          console.error("Failed to remove note", error);
        }
      },

      // ─── Dynamic Research Reports ───
      researchList: defaultResearch,
      addResearch: (report) => {
        set((state) => ({
          researchList: [...state.researchList, { ...report, id: Date.now() }]
        }));
      },
      updateResearch: (id, updatedReport) => {
        set((state) => ({
          researchList: state.researchList.map(r => r.id === id ? { ...r, ...updatedReport } : r)
        }));
      },
      deleteResearch: (id) => {
        set((state) => ({
          researchList: state.researchList.filter(r => r.id !== id)
        }));
      },

      // ─── Misc ───
      isLoading: false,
      error: null,

      fetchAll: async () => {
        set({ isLoading: true });
        await Promise.all([
          get().fetchUserProfile(),
          get().fetchWatchlists(),
          get().fetchTrades(),
          get().fetchAlerts(),
          get().fetchNotes()
        ]);
        set({ isLoading: false });
      }
    }),
    {
      name: 'sisvest-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser,
        researchList: state.researchList,
      }),
    }
  )
);

// Restore headers on startup if user is logged in
const saved = localStorage.getItem('sisvest-storage');
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (parsed.state && parsed.state.currentUser && parsed.state.currentUser.username) {
      axios.defaults.headers.common['X-User-Username'] = parsed.state.currentUser.username;
    }
  } catch (e) {
    console.error("Failed to restore default auth header from storage", e);
  }
}

export default useStore;
