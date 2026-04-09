// ============================================================
// ShopAnalytics – Full React Application (JSX via Babel)
// ============================================================
const { useState, useEffect, useMemo, useRef, useCallback, useSyncExternalStore } = React;
const {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Area, AreaChart
} = Recharts;

const store = window.shopStore;
const actions = window.shopActions;

// ─── Custom hooks to replace react-redux ─────────────────
function useSelector(selector) {
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState())
    );
}

function useDispatch() {
    return store.dispatch;
}

// ─────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────
const fmt = n => "₹" + n.toLocaleString("en-IN");
const pct = (a, b) => b ? ((a / b) * 100).toFixed(1) + "%" : "0%";

// ─────────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────────
function Spinner() {
    return (
        <div className="spinner-wrap">
            <div className="spinner" />
            <p className="spinner-text">Loading data…</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────
function LoginPage() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(s => s.auth);
    const [email, setEmail] = useState("admin@shop.com");
    const [password, setPassword] = useState("admin123");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(actions.login(email, password));
    };

    return (
        <div className="login-container" id="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="brand" style={{ justifyContent: "center", marginBottom: 16 }}>
                        <span className="brand-icon" style={{ fontSize: 32 }}>🛒</span>
                        <span className="brand-name" style={{ fontSize: 26 }}>ShopAnalytics</span>
                    </div>
                    <h1 className="login-title">Admin Terminal</h1>
                    <p className="login-subtitle">Sign in to manage your shop's performance</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="mail@example.com"
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 32 }}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 20, background: "rgba(239,68,68,0.1)", padding: "12px", borderRadius: "10px", textAlign: "left" }}>❌ {error}</div>}

                    <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                    </button>
                </form>

                <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", opacity: 0.6 }}>
                    &copy; 2026 ShopAnalytics Terminal. All rights reserved.
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar({ onOpenDate, onToggleProfile, showProfile }) {
    const dispatch = useDispatch();
    const darkMode = useSelector(s => s.ui.darkMode);
    const sidebarOpen = useSelector(s => s.ui.sidebarOpen);
    const orders = useSelector(s => s.orders.data);
    const user = useSelector(s => s.auth.user);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const pending = orders.filter(o => o.status === "Pending").length;

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-left">
                <button className="sidebar-toggle" id="sidebar-toggle-btn" onClick={() => dispatch(actions.toggleSidebar())}>
                    <span className={`hamburger ${sidebarOpen ? "open" : ""}`}>
                        <span /><span /><span />
                    </span>
                </button>
                <div className="brand">
                    <span className="brand-icon">🛒</span>
                    <span className="brand-name">ShopAnalytics</span>
                </div>
            </div>

            <div className="navbar-right">


                <button
                    className="theme-toggle"
                    id="theme-toggle-btn"
                    onClick={() => dispatch(actions.toggleDarkMode())}
                >
                    {darkMode ? "🔆" : "🌙"}
                </button>

                <div style={{ position: "relative" }}>
                    <button className="profile-btn" onClick={onToggleProfile}>
                        <div className="nav-avatar">
                            {user?.name?.[0] || "SA"}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{user?.name || "Admin"}</span>
                    </button>

                    {showProfile && (
                        <div className="profile-dropdown">
                            <div className="dropdown-user">
                                <div className="dropdown-user-name">{user?.name || "Shop Admin"}</div>
                                <div className="dropdown-user-email">{user?.email || "admin@shop.com"}</div>
                            </div>
                            <button className="menu-item" onClick={() => { dispatch(actions.setActivePage("settings")); onToggleProfile(); }}>⚙️ Settings</button>
                            <button className="menu-item" onClick={() => { dispatch(actions.setActivePage("account")); onToggleProfile(); }}>👤 Account</button>
                            <button className="menu-item logout" onClick={() => dispatch(actions.logout())}>🚪 Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Orders" },
    { id: "revenue", label: "Revenue" },
    { id: "products", label: "Top Products" },
    { id: "categories", label: "Categories" },
];

function Sidebar() {
    const dispatch = useDispatch();
    const activePage = useSelector(s => s.ui.activePage);
    const sidebarOpen = useSelector(s => s.ui.sidebarOpen);
    const user = useSelector(s => s.auth.user);

    return (
        <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`} id="main-sidebar">
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
                        onClick={() => dispatch(actions.setActivePage(item.id))}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {sidebarOpen && (
                <div className="sidebar-user-footer">
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-avatar" style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", color: "white" }}>
                          {user?.name?.[0] || "SA"}
                        </div>
                        <div className="sidebar-user-details">
                            <div className="sidebar-user-name">{user?.name || "Shop Admin"}</div>
                            <div className="sidebar-user-role">{user?.email || "Administrator"}</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, color, id }) {
    return (
        <div className={`stat-card stat-card--${color}`} id={id}>
            <div className="stat-card-header" style={{ marginBottom: 12 }}>
                <span className="stat-label" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
                <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`} style={{ fontSize: 12, fontWeight: 700 }}>
                    {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
                </span>
            </div>
            <div className="stat-value" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</div>
            {sub && <div className="stat-sub" style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{sub}</div>}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
function DashboardPage() {
    const orders = useSelector(s => s.orders.data);
    const products = useSelector(s => s.products.data);
    const categories = useSelector(s => s.categories.data);
    const monthly = useSelector(s => s.revenue.monthly);
    const loading = useSelector(s => s.orders.loading || s.products.loading);

    if (loading) return <Spinner />;

    const totalRevenue = orders.reduce((a, o) => a + o.amount, 0);
    const totalOrders = orders.length;
    const totalQty = products.reduce((a, p) => a + p.qtySold, 0);
    const activeCateg = categories.length;
    const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
    const delivered = orders.filter(o => o.status === "Delivered").length;

    // Mini area chart data (last 5 months)
    const chartData = monthly.slice(-5);

    return (
        <div className="page-content" id="dashboard-page">

            {/* Stat Cards */}
            <div className="stats-grid">
                <StatCard id="card-orders" label="Total Orders" value={totalOrders} sub={`${delivered} Orders Delivered`} trend={12.4} color="purple" />
                <StatCard id="card-revenue" label="Total Revenue" value={fmt(totalRevenue)} sub={`Avg ${fmt(avgOrder)} per order`} trend={8.7} color="green" />
                <StatCard id="card-products" label="Products Sold" value={totalQty} sub={`${products.length} SKUs Available`} trend={5.2} color="blue" />
                <StatCard id="card-categs" label="Active Categories" value={activeCateg} sub="Steady Growth" trend={0} color="orange" />
            </div>

            {/* Charts row */}
            <div className="charts-row">
                {/* Revenue Trend */}
                <div className="chart-card chart-card--wide" id="dash-revenue-chart">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Revenue Trend</h2>
                        <span className="chart-badge">Last 5 Months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
                            <Tooltip
                                contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }}
                                formatter={v => [fmt(v), "Revenue"]}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div className="chart-card" id="dash-pie-chart">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Category Share</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={categories} dataKey="sales" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                                {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                            </Pie>
                            <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend">
                        {categories.map((c, i) => (
                            <div key={i} className="pie-legend-item">
                                <span className="pie-dot" style={{ background: c.color }} />
                                <span className="pie-legend-name">{c.name}</span>
                                <span className="pie-legend-val">{pct(c.sales, categories.reduce((a, x) => a + x.sales, 0))}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent orders mini table */}
            <div className="chart-card" id="dash-recent-orders">
                <div className="chart-card-header">
                    <h2 className="chart-title">Recent Orders</h2>
                    <span className="chart-badge">Latest 5</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map(o => (
                            <tr key={o.id}>
                                <td><span className="order-id">{o.id}</span></td>
                                <td>{o.customer}</td>
                                <td>{o.date}</td>
                                <td className="amount-cell">{fmt(o.amount)}</td>
                                <td><span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// ORDERS PAGE
// ─────────────────────────────────────────────────────────────
function OrdersPage() {
    const dispatch = useDispatch();
    const ordersState = useSelector(s => s.orders);
    const { data: orders, loading, search, statusFilter, sortBy, sortDir } = ordersState;
    const [exportMsg, setExportMsg] = useState("");

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 8;

    const filtered = useMemo(() => {
        let d = [...orders];
        if (search) d = d.filter(o => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));
        if (statusFilter !== "All") d = d.filter(o => o.status === statusFilter);
        d.sort((a, b) => {
            let va = a[sortBy], vb = b[sortBy];
            if (sortBy === "amount") { va = +va; vb = +vb; }
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
        return d;
    }, [orders, search, statusFilter, sortBy, sortDir]);

    const paginated = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const exportCSV = () => {
        const header = "Order ID,Customer,Date,Amount,Status,Category\n";
        const rows = filtered.map(o => `${o.id},${o.customer},${o.date},${o.amount},${o.status},${o.category}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "orders_export.csv"; a.click();
        URL.revokeObjectURL(url);
        setExportMsg("✅ Exported!");
        setTimeout(() => setExportMsg(""), 2000);
    };

    const SortIcon = ({ col }) => {
        if (sortBy !== col) return <span className="sort-icon neutral">↕</span>;
        return <span className="sort-icon active">{sortDir === "asc" ? "↑" : "↓"}</span>;
    };

    if (loading) return <Spinner />;

    return (
        <div className="page-content" id="orders-page">
            {/* Header Actions */}
            <div className="table-header-actions" id="orders-filters">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        id="orders-search"
                        type="text"
                        placeholder="Search by customer name or Order ID..."
                        value={search}
                        onChange={e => { dispatch(actions.setSearch(e.target.value)); setPage(1); }}
                    />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <select
                        id="status-filter"
                        className="btn"
                        style={{ border: "1px solid var(--border)", background: "var(--bg-3)", color: "var(--text)" }}
                        value={statusFilter}
                        onChange={e => { dispatch(actions.setStatusFilter(e.target.value)); setPage(1); }}
                    >
                        <option value="All">All Status</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <button className="btn" style={{ border: "1px solid var(--border)", background: "var(--bg-3)", color: "var(--text)" }} onClick={exportCSV}>
                        📤 Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="chart-card table-card" id="orders-table-card">
                <table className="data-table sortable-table">
                    <thead>
                        <tr>
                            <th onClick={() => dispatch(actions.setSortBy("id"))} className="sortable-th">Order ID     <SortIcon col="id" /></th>
                            <th onClick={() => dispatch(actions.setSortBy("customer"))} className="sortable-th">Customer     <SortIcon col="customer" /></th>
                            <th onClick={() => dispatch(actions.setSortBy("date"))} className="sortable-th">Date         <SortIcon col="date" /></th>
                            <th onClick={() => dispatch(actions.setSortBy("amount"))} className="sortable-th">Amount       <SortIcon col="amount" /></th>
                            <th onClick={() => dispatch(actions.setSortBy("status"))} className="sortable-th">Status       <SortIcon col="status" /></th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan="6" className="no-data">No orders match your filters.</td></tr>
                        ) : paginated.map(o => (
                            <tr key={o.id} className="order-row">
                                <td><span className="order-id">{o.id}</span></td>
                                <td>
                                    <div className="customer-cell">
                                        <div className="customer-avatar">{o.customer[0]}</div>
                                        {o.customer}
                                    </div>
                                </td>
                                <td>{o.date}</td>
                                <td className="amount-cell">{fmt(o.amount)}</td>
                                <td><span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
                                <td><span className="category-chip">{o.category}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination & Summary */}
            <div className="orders-footer">
              <div className="pagination">
                <button className="btn" disabled={page === 1} onClick={() => setPage(page-1)}>Prev</button>
                <div className="page-info">Page {page} of {totalPages || 1}</div>
                <button className="btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page+1)}>Next</button>
              </div>
              <div className="orders-summary-row">
                  <div className="summary-chip">Total: <strong>{fmt(filtered.reduce((a, o) => a + o.amount, 0))}</strong></div>
                  <div className="summary-chip">Delivered: <strong>{filtered.filter(o => o.status === "Delivered").length}</strong></div>
                  <div className="summary-chip">Pending: <strong>{filtered.filter(o => o.status === "Pending").length}</strong></div>
              </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// REVENUE PAGE
// ─────────────────────────────────────────────────────────────
function RevenuePage() {
    const dispatch = useDispatch();
    const revState = useSelector(s => s.revenue);
    const { monthly, weekly, loading, view } = revState;
    const orders = useSelector(s => s.orders.data);
    const products = useSelector(s => s.products.data || []);

    if (loading) return <Spinner />;

    const chartData = view === "monthly" ? monthly : weekly;
    const xKey = view === "monthly" ? "month" : "week";
    const totalRev = orders.reduce((a, o) => a + o.amount, 0);
    const avgOrder = orders.length ? Math.round(totalRev / orders.length) : 0;
    const peakMonth = [...monthly].sort((a, b) => b.revenue - a.revenue)[0];

    return (
        <div className="page-content" id="revenue-page">


            {/* KPI chips */}
            <div className="kpi-row">
                <div className="kpi-chip" id="kpi-total-rev">
                    <div><div className="kpi-lbl">Total Revenue</div><div className="kpi-val">{fmt(totalRev)}</div></div>
                </div>
                <div className="kpi-chip" id="kpi-avg-order">
                    <div><div className="kpi-lbl">Avg Order Value</div><div className="kpi-val">{fmt(avgOrder)}</div></div>
                </div>
                <div className="kpi-chip" id="kpi-peak">
                    <div><div className="kpi-lbl">Peak Month ({peakMonth?.month})</div><div className="kpi-val">{peakMonth ? fmt(peakMonth.revenue) : "—"}</div></div>
                </div>
                <div className="kpi-chip" id="kpi-orders-count">
                    <div><div className="kpi-lbl">Total Orders</div><div className="kpi-val">{orders.length}</div></div>
                </div>
            </div>

            {/* Line chart */}
            <div className="chart-card" id="revenue-line-chart">
                <div className="chart-card-header">
                    <h2 className="chart-title">{view === "monthly" ? "Monthly" : "Weekly"} Revenue Trend</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey={xKey} tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
                        <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }}
                            formatter={(v, n) => [n === "revenue" ? fmt(v) : v, n === "revenue" ? "Revenue" : "Orders"]} />
                        <Legend wrapperStyle={{ color: "var(--text-muted)", fontSize: 12 }} />
                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: "#6366f1", strokeWidth: 2 }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 3" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div className="chart-card" id="revenue-bar-chart">
                <div className="chart-card-header">
                    <h2 className="chart-title">Revenue vs Orders Comparison</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey={xKey} tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "k"} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }}
                            formatter={(v, n) => [n === "revenue" ? fmt(v) : v, n === "revenue" ? "Revenue" : "Orders"]} />
                        <Legend wrapperStyle={{ color: "var(--text-muted)", fontSize: 12 }} />
                        <Bar yAxisId="left" dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        <Bar yAxisId="right" dataKey="orders" fill="#ec4899" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Leaderboard */}
            <div className="chart-card" id="revenue-leaderboard">
                <div className="chart-card-header">
                    <h2 className="chart-title">Top Revenue Drivers</h2>
                </div>
                <div className="leaderboard">
                    {[...products].sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((p, i) => {
                        const topRev = [...products].sort((a,b)=>b.revenue-a.revenue)[0]?.revenue || 1;
                        const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
                        return (
                            <div key={p.id} className="lb-item" id={`rev-lb-item-${i+1}`}>
                                <div className={`lb-rank rank-${i+1}`}>#{i+1}</div>
                                <div className="lb-icon">{p.icon}</div>
                                <div className="lb-info">
                                    <div className="lb-name">{p.name}</div>
                                    <div className="lb-meta">{p.category} · {p.qtySold} sold</div>
                                    <div className="lb-bar-wrap">
                                        <div className="lb-bar" style={{ width: Math.round((p.revenue / topRev) * 100) + "%", background: COLORS[i] }} />
                                    </div>
                                </div>
                                <div className="lb-rev" style={{ color: COLORS[i] }}>{fmt(p.revenue)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────────────────────────
function ProductsPage() {
    const prodState = useSelector(s => s.products);
    const { data: products, loading } = prodState;
    const [sortBy, setSortBy] = useState("revenue");
    const [sortDir, setSortDir] = useState("desc");

    if (loading) return <Spinner />;

    const sortedProducts = useMemo(() => {
        let d = [...products];
        d.sort((a, b) => {
            let va = a[sortBy], vb = b[sortBy];
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
        return d;
    }, [products, sortBy, sortDir]);

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(col);
            setSortDir("desc");
        }
    };

    const top5 = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const maxRev = top5[0]?.revenue || 1;

    const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

    const SortIcon = ({ col }) => {
        if (sortBy !== col) return <span className="sort-icon neutral">↕</span>;
        return <span className="sort-icon active">{sortDir === "asc" ? "↑" : "↓"}</span>;
    };

    return (
        <div className="page-content" id="products-page">


            <div className="charts-row">
                {/* Leaderboard */}
                <div className="chart-card chart-card--wide" id="products-leaderboard">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Revenue Leaderboard</h2>
                    </div>
                    <div className="leaderboard">
                        {top5.map((p, i) => (
                            <div key={p.id} className="lb-item" id={`lb-item-${i + 1}`}>
                                <div className={`lb-rank rank-${i + 1}`}>#{i + 1}</div>
                                <div className="lb-icon">{p.icon}</div>
                                <div className="lb-info">
                                    <div className="lb-name">{p.name}</div>
                                    <div className="lb-meta">{p.category} · {p.qtySold} units sold</div>
                                    <div className="lb-bar-wrap">
                                        <div className="lb-bar" style={{ width: pct(p.revenue, maxRev), background: COLORS[i] }} />
                                    </div>
                                </div>
                                <div className="lb-rev" style={{ color: COLORS[i] }}>{fmt(p.revenue)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar chart */}
                <div className="chart-card" id="products-bar-chart">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Units Sold</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={top5} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                            <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                            <Bar dataKey="qtySold" name="Units Sold" radius={[0, 6, 6, 0]}>
                                {top5.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Full products table */}
            <div className="chart-card table-card" id="all-products-table">
                <div className="chart-card-header">
                    <h2 className="chart-title">All Products</h2>
                </div>
                <table className="data-table sortable-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th onClick={() => handleSort("name")} className="sortable-th">Product <SortIcon col="name" /></th>
                            <th onClick={() => handleSort("category")} className="sortable-th">Category <SortIcon col="category" /></th>
                            <th onClick={() => handleSort("qtySold")} className="sortable-th">Units Sold <SortIcon col="qtySold" /></th>
                            <th onClick={() => handleSort("revenue")} className="sortable-th">Revenue <SortIcon col="revenue" /></th>
                            <th>Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((p, i) => (
                            <tr key={p.id}>
                                <td style={{ fontSize: 22 }}>{p.icon}</td>
                                <td><strong>{p.name}</strong></td>
                                <td><span className="category-chip">{p.category}</span></td>
                                <td>{p.qtySold}</td>
                                <td className="amount-cell">{fmt(p.revenue)}</td>
                                <td><span className={`rank-badge rank-${[...products].sort((a,b) => b.revenue-a.revenue).findIndex(x => x.id === p.id) + 1}`}>#{[...products].sort((a,b) => b.revenue-a.revenue).findIndex(x => x.id === p.id) + 1}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────
function SettingsPage() {
    const dispatch = useDispatch();
    const darkMode = useSelector(s => s.ui.darkMode);

    return (
        <div className="page-content" id="settings-page">
            <div className="settings-container" style={{ maxWidth: 800 }}>
                <div className="chart-card" style={{ marginBottom: 24 }}>
                    <div className="chart-card-header">
                        <h2 className="chart-title">Appearance</h2>
                    </div>
                    <div className="settings-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Dark Mode</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Use dark theme for the interface</div>
                        </div>
                        <button className={`btn ${darkMode ? "btn-primary" : ""}`} onClick={() => dispatch(actions.toggleDarkMode())}>
                            {darkMode ? "Enabled" : "Disabled"}
                        </button>
                    </div>
                </div>

                <div className="chart-card" style={{ marginBottom: 24 }}>
                    <div className="chart-card-header">
                        <h2 className="chart-title">Notifications</h2>
                    </div>
                    <div className="settings-list">
                        {[
                            { title: "Email Notifications", sub: "Receive daily sales summaries via email" },
                            { title: "Order Alerts", sub: "Get real-time alerts for new orders" },
                            { title: "Stock Warnings", sub: "Notify when products are low on stock" }
                        ].map((s, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{s.title}</div>
                                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.sub}</div>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Data Management</h2>
                    </div>
                    <div style={{ padding: "12px 0" }}>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Clear local cache and refresh application data from the server.</p>
                        <button className="btn" style={{ border: "1px solid var(--border)", background: "var(--bg-3)" }}>🧹 Clear Cache</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// ACCOUNT PAGE
// ─────────────────────────────────────────────────────────────
function AccountPage() {
    const dispatch = useDispatch();
    const user = useSelector(s => s.auth.user) || { name: "Shop Admin", email: "admin@shop.com" };

    const [editName, setEditName] = useState(user.name);
    const [editEmail, setEditEmail] = useState(user.email);
    const [editRole, setEditRole] = useState("Primary Administrator");
    const [editTimeZone, setEditTimeZone] = useState("GMT +5:30 (IST)");
    const [saveKey, setSaveKey] = useState(0);

    const handleSave = () => {
        // Dispatching a mock update to auth store if needed, or simply showing a success state
        dispatch({ type: "auth/loginSuccess", payload: { name: editName, email: editEmail } });
        setSaveKey(prev => prev + 1);
        setTimeout(() => setSaveKey(0), 3000); // Show success message roughly for 3s
    };

    return (
        <div className="page-content" id="account-page">
            <div className="account-container" style={{ maxWidth: 800 }}>
                <div className="chart-card" style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 0" }}>
                        <div style={{ 
                            width: 100, height: 100, borderRadius: "50%", 
                            background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 40, fontWeight: 800, color: "white"
                        }}>
                            {editName[0]}
                        </div>
                        <div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{editName}</h2>
                            <div style={{ color: "var(--text-muted)", marginBottom: 12 }}>{editRole} · Since Jan 2024</div>
                            <button className="btn btn-primary" style={{ fontSize: 12, padding: "6px 16px" }}>Change Photo</button>
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 className="chart-title">Profile Information</h2>
                        {saveKey > 0 && <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 600 }}>✅ Changes Saved</span>}
                    </div>
                    <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Name</label>
                            <input type="text" className="form-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", color: "var(--text)", outline: "none" }} onFocus={e => e.target.style.borderColor = "var(--accent-1)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
                            <input type="email" className="form-input" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", color: "var(--text)", outline: "none" }} onFocus={e => e.target.style.borderColor = "var(--accent-1)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Role</label>
                            <input type="text" className="form-input" value={editRole} onChange={e => setEditRole(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", color: "var(--text)", outline: "none" }} onFocus={e => e.target.style.borderColor = "var(--accent-1)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>TimeZone</label>
                            <input type="text" className="form-input" value={editTimeZone} onChange={e => setEditTimeZone(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: 8, background: "transparent", color: "var(--text)", outline: "none" }} onFocus={e => e.target.style.borderColor = "var(--accent-1)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                        </div>
                    </div>
                    <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                        <button className="btn" style={{ border: "1px solid var(--border)" }} onClick={() => { setEditName(user.name); setEditEmail(user.email); }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
function CategoriesPage() {
    const catState = useSelector(s => s.categories);
    const { data: categories, loading } = catState;
    if (loading) return <Spinner />;

    const totalSales = categories.reduce((a, c) => a + c.sales, 0);
    const totalOrders = categories.reduce((a, c) => a + c.orders, 0);

    const RADIAN = Math.PI / 180;
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const r = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + r * Math.cos(-midAngle * RADIAN);
        const y = cy + r * Math.sin(-midAngle * RADIAN);
        return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
                {(percent * 100).toFixed(0)}%
            </text>
        ) : null;
    };

    return (
        <div className="page-content" id="categories-page">
            <div className="charts-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {/* Donut chart */}
                <div className="chart-card" id="category-donut-chart">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Sales Distribution</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={categories} dataKey="sales" cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                                paddingAngle={5} labelLine={false} label={renderCustomLabel}>
                                {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                            </Pie>
                            <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {categories.map((c, i) => (
                            <div key={i} className="pie-legend-item">
                                <span className="pie-dot" style={{ background: c.color }} />
                                <span className="pie-legend-name">{c.name}</span>
                                <span className="pie-legend-val">{fmt(c.sales)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Performance Table */}
                <div className="chart-card" id="category-details">
                    <div className="chart-card-header">
                        <h2 className="chart-title">Performance Summary</h2>
                    </div>
                    <table className="data-table" style={{ marginTop: 8 }}>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th style={{ textAlign: "right" }}>Sales</th>
                                <th style={{ textAlign: "right" }}>Share</th>
                                <th style={{ textAlign: "right" }}>Avg Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c, i) => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                                            <strong>{c.name}</strong>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "right" }}>{fmt(c.sales)}</td>
                                    <td style={{ textAlign: "right" }}>{pct(c.sales, totalSales)}</td>
                                    <td style={{ textAlign: "right" }}>{fmt(Math.round(c.sales / c.orders))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Orders bar small */}
                    <div style={{ marginTop: 32 }}>
                        <h3 className="chart-title" style={{ fontSize: 13, marginBottom: 12 }}>Order Volume</h3>
                        <ResponsiveContainer width="100%" height={120}>
                            <BarChart data={categories} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                                    {categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────
function DatePickerModal({ isOpen, onClose, currentRange, onSelect }) {
    if (!isOpen) return null;

    const ranges = ["Today", "Last 7 Days", "This Month", "Last 3 Months", "Year to Date", "All Time"];
    const [isCustom, setIsCustom] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const handleCustom = (e) => {
        e.preventDefault();
        if (customStart && customEnd) {
            onSelect(`${customStart} to ${customEnd}`);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Filter by Date</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Select a preset range or pick a custom period.</p>
                
                <div className="date-grid" style={{ marginBottom: 20 }}>
                    {ranges.map(r => (
                        <button 
                            key={r} 
                            className={`date-pill ${currentRange === r && !isCustom ? "active" : ""}`}
                            onClick={() => { setIsCustom(false); onSelect(r); onClose(); }}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div style={{ padding: "20px 0", borderTop: "1px solid var(--border)" }}>
                    <button 
                        className={`btn ${isCustom ? "active-custom" : ""}`} 
                        style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", marginBottom: isCustom ? 16 : 0, background: isCustom ? "var(--bg-3)" : "transparent", border: isCustom ? "1px solid var(--accent-1)" : "1px solid var(--border)" }}
                        onClick={() => setIsCustom(!isCustom)}
                    >
                        <span>📅 Custom Range</span>
                        <span>{isCustom ? "−" : "+"}</span>
                    </button>

                    {isCustom && (
                        <form onSubmit={handleCustom} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input type="date" className="form-input" value={customStart} onChange={e => setCustomStart(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input type="date" className="form-input" value={customEnd} onChange={e => setCustomEnd(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: "span 2", marginTop: 8 }}>Apply Custom Range</button>
                        </form>
                    )}
                </div>

                <button className="btn" onClick={onClose} style={{ width: "100%", marginTop: 12, border: "1px solid var(--border)" }}>Cancel</button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
function App() {
    const dispatch = useDispatch();
    const activePage = useSelector(s => s.ui.activePage);
    const darkMode = useSelector(s => s.ui.darkMode);
    const sidebarOpen = useSelector(s => s.ui.sidebarOpen);
    const isLoggedIn = useSelector(s => s.auth.isLoggedIn);

    const [showProfile, setShowProfile] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState("This Month");

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(actions.fetchOrders());
            dispatch(actions.fetchProducts());
            dispatch(actions.fetchRevenue());
            dispatch(actions.fetchCategories());
        }
    }, [isLoggedIn]);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleMsg = () => setShowProfile(false);
        if (showProfile) window.addEventListener("click", handleMsg);
        return () => window.removeEventListener("click", handleMsg);
    }, [showProfile]);

    if (!isLoggedIn) {
        return <LoginPage />;
    }

    const pages = {
        dashboard: <DashboardPage dateRange={dateRange} />,
        orders: <OrdersPage />,
        revenue: <RevenuePage />,
        products: <ProductsPage />,
        categories: <CategoriesPage />,
        settings: <SettingsPage />,
        account: <AccountPage />,
    };

    return (
        <div className={`app-shell ${darkMode ? "dark" : "light"} ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`} id="app-shell">
            <Navbar 
                showProfile={showProfile} 
                onToggleProfile={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}
                onOpenDate={() => setShowDatePicker(true)}
            />
            
            <div className="app-body">
                <Sidebar />
                <main className="main-content" id="main-content">
                    <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <h1 className="page-title">{activePage === "products" ? "Product Performance" : activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
                            <p className="page-subtitle">Showing data for <strong>{dateRange}</strong></p>
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            {activePage === "revenue" && (
                                <div className="view-toggle" id="revenue-view-toggle">
                                    <button id="btn-monthly" className={`toggle-btn ${store.getState().revenue.view === "monthly" ? "active" : ""}`} onClick={() => dispatch(actions.setView("monthly"))}>Monthly</button>
                                    <button id="btn-weekly" className={`toggle-btn ${store.getState().revenue.view === "weekly" ? "active" : ""}`} onClick={() => dispatch(actions.setView("weekly"))}>Weekly</button>
                                </div>
                            )}
                            
                            <div 
                                className="date-box-trigger" 
                                onClick={() => setShowDatePicker(true)}
                                style={{ 
                                    display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", 
                                    background: "var(--card-bg)", border: "1px solid var(--border)", 
                                    borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                                    boxShadow: "var(--shadow)"
                                }}
                            >
                                <span style={{ fontSize: 20 }}>📅</span>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reporting Period</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-1)" }}>{dateRange}</div>
                                </div>
                                <span style={{ marginLeft: 8, opacity: 0.4 }}>▼</span>
                            </div>
                        </div>
                    </div>
                    {pages[activePage]}
                </main>
            </div>

            <DatePickerModal 
                isOpen={showDatePicker} 
                onClose={() => setShowDatePicker(false)} 
                currentRange={dateRange}
                onSelect={setDateRange}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────────────────────
const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
