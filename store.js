// ============================================================
// ShopAnalytics Redux Store (Redux Toolkit)
// ============================================================

const { createSlice, configureStore, createAsyncThunk } = window.RTK;

// ─── Async Thunks (simulates API fetch) ─────────────────────
const fetchOrders = createAsyncThunk("orders/fetch", async () => {
    await new Promise(r => setTimeout(r, 600));
    return SHOP_DATA.orders;
});

const fetchProducts = createAsyncThunk("products/fetch", async () => {
    await new Promise(r => setTimeout(r, 700));
    return SHOP_DATA.products;
});

const fetchRevenue = createAsyncThunk("revenue/fetch", async () => {
    await new Promise(r => setTimeout(r, 500));
    return { monthly: SHOP_DATA.monthlyRevenue, weekly: SHOP_DATA.weeklyRevenue };
});

const fetchCategories = createAsyncThunk("categories/fetch", async () => {
    await new Promise(r => setTimeout(r, 550));
    return SHOP_DATA.categories;
});

// ─── Orders Slice ────────────────────────────────────────────
const ordersSlice = createSlice({
    name: "orders",
    initialState: { data: [], loading: false, error: null, search: "", statusFilter: "All", sortBy: "date", sortDir: "desc" },
    reducers: {
        setSearch: (s, a) => { s.search = a.payload; },
        setStatusFilter: (s, a) => { s.statusFilter = a.payload; },
        setSortBy: (s, a) => {
            if (s.sortBy === a.payload) s.sortDir = s.sortDir === "asc" ? "desc" : "asc";
            else { s.sortBy = a.payload; s.sortDir = "asc"; }
        },
    },
    extraReducers: b => {
        b.addCase(fetchOrders.pending, s => { s.loading = true; });
        b.addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; });
        b.addCase(fetchOrders.rejected, s => { s.loading = false; s.error = "Failed to fetch orders"; });
    },
});

// ─── Products Slice ──────────────────────────────────────────
const productsSlice = createSlice({
    name: "products",
    initialState: { data: [], loading: false, error: null },
    reducers: {},
    extraReducers: b => {
        b.addCase(fetchProducts.pending, s => { s.loading = true; });
        b.addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; });
        b.addCase(fetchProducts.rejected, s => { s.loading = false; s.error = "Failed to fetch products"; });
    },
});

// ─── Revenue Slice ───────────────────────────────────────────
const revenueSlice = createSlice({
    name: "revenue",
    initialState: { monthly: [], weekly: [], loading: false, error: null, view: "monthly" },
    reducers: {
        setView: (s, a) => { s.view = a.payload; },
    },
    extraReducers: b => {
        b.addCase(fetchRevenue.pending, s => { s.loading = true; });
        b.addCase(fetchRevenue.fulfilled, (s, a) => { s.loading = false; s.monthly = a.payload.monthly; s.weekly = a.payload.weekly; });
        b.addCase(fetchRevenue.rejected, s => { s.loading = false; s.error = "Failed to fetch revenue"; });
    },
});

// ─── Categories Slice ────────────────────────────────────────
const categoriesSlice = createSlice({
    name: "categories",
    initialState: { data: [], loading: false, error: null },
    reducers: {},
    extraReducers: b => {
        b.addCase(fetchCategories.pending, s => { s.loading = true; });
        b.addCase(fetchCategories.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; });
        b.addCase(fetchCategories.rejected, s => { s.loading = false; s.error = "Failed to fetch categories"; });
    },
});

// ─── UI Slice ────────────────────────────────────────────────
const uiSlice = createSlice({
    name: "ui",
    initialState: { activePage: "dashboard", darkMode: true, sidebarOpen: true },
    reducers: {
        setActivePage: (s, a) => { s.activePage = a.payload; },
        toggleDarkMode: s => { s.darkMode = !s.darkMode; document.documentElement.setAttribute("data-theme", s.darkMode ? "dark" : "light"); },
        toggleSidebar: s => { s.sidebarOpen = !s.sidebarOpen; },
    },
});

// ─── Store ───────────────────────────────────────────────────
const store = configureStore({
    reducer: {
        orders: ordersSlice.reducer,
        products: productsSlice.reducer,
        revenue: revenueSlice.reducer,
        categories: categoriesSlice.reducer,
        ui: uiSlice.reducer,
    },
});

// Export actions + thunks to global scope for JSX files
window.shopActions = {
    ...ordersSlice.actions,
    ...revenueSlice.actions,
    ...uiSlice.actions,
    fetchOrders,
    fetchProducts,
    fetchRevenue,
    fetchCategories,
};
window.shopStore = store;
