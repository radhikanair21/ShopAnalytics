// ShopAnalytics – Static Data (simulates /api/orders, /api/products, /api/revenue, /api/categories)
const SHOP_DATA = {
  orders: [
    { id: "ORD-001", customer: "Amit Kumar",       date: "2026-04-01", amount: 1200, status: "Delivered", category: "Electronics" },
    { id: "ORD-002", customer: "Arjun Mehta",      date: "2026-04-02", amount: 850,  status: "Pending",   category: "Clothing" },
    { id: "ORD-003", customer: "Sonia Verma",      date: "2026-04-02", amount: 3400, status: "Delivered", category: "Electronics" },
    { id: "ORD-004", customer: "Karan Kapoor",     date: "2026-04-03", amount: 560,  status: "Delivered", category: "Accessories" },
    { id: "ORD-005", customer: "Sneha Reddy",      date: "2026-04-03", amount: 1900, status: "Pending",   category: "Clothing" },
    { id: "ORD-006", customer: "Vikram Patel",     date: "2026-04-04", amount: 720,  status: "Delivered", category: "Accessories" },
    { id: "ORD-007", customer: "Ananya Joshi",     date: "2026-04-04", amount: 2800, status: "Delivered", category: "Electronics" },
    { id: "ORD-008", customer: "Rohan Desai",      date: "2026-04-05", amount: 490,  status: "Pending",   category: "Clothing" },
    { id: "ORD-009", customer: "Meera Pillai",     date: "2026-04-05", amount: 1650, status: "Delivered", category: "Electronics" },
    { id: "ORD-010", customer: "Aditya Singh",     date: "2026-04-06", amount: 330,  status: "Delivered", category: "Accessories" },
    { id: "ORD-011", customer: "Kavya Menon",      date: "2026-04-06", amount: 4200, status: "Delivered", category: "Electronics" },
    { id: "ORD-012", customer: "Rahul Gupta",      date: "2026-04-06", amount: 780,  status: "Pending",   category: "Clothing" },
    { id: "ORD-013", customer: "Divya Krishnan",   date: "2026-03-25", amount: 950,  status: "Delivered", category: "Accessories" },
    { id: "ORD-014", customer: "Nikhil Rao",       date: "2026-03-26", amount: 2100, status: "Delivered", category: "Electronics" },
    { id: "ORD-015", customer: "Sanya Bose",       date: "2026-03-27", amount: 640,  status: "Pending",   category: "Clothing" },
    { id: "ORD-016", customer: "Tarun Verma",      date: "2026-03-28", amount: 1380, status: "Delivered", category: "Electronics" },
    { id: "ORD-017", customer: "Pooja Iyer",       date: "2026-03-29", amount: 890,  status: "Delivered", category: "Accessories" },
    { id: "ORD-018", customer: "Sameer Khan",      date: "2026-03-30", amount: 2350, status: "Delivered", category: "Electronics" },
    { id: "ORD-019", customer: "Isha Chatterjee",  date: "2026-03-31", amount: 710,  status: "Pending",   category: "Clothing" },
    { id: "ORD-020", customer: "Dev Malhotra",     date: "2026-03-31", amount: 1540, status: "Delivered", category: "Electronics" },
  ],

  products: [
    { id: "P001", name: "Wireless Headphones",  category: "Electronics",  qtySold: 142, revenue: 85200,  icon: "🎧" },
    { id: "P002", name: "Running Sneakers",      category: "Clothing",     qtySold: 98,  revenue: 49000,  icon: "👟" },
    { id: "P003", name: "Smart Watch",           category: "Electronics",  qtySold: 87,  revenue: 78300,  icon: "⌚" },
    { id: "P004", name: "Leather Wallet",        category: "Accessories",  qtySold: 76,  revenue: 22800,  icon: "👜" },
    { id: "P005", name: "Bluetooth Speaker",     category: "Electronics",  qtySold: 65,  revenue: 32500,  icon: "🔊" },
    { id: "P006", name: "Denim Jacket",          category: "Clothing",     qtySold: 54,  revenue: 27000,  icon: "🧥" },
    { id: "P007", name: "Sunglasses",            category: "Accessories",  qtySold: 48,  revenue: 19200,  icon: "🕶️" },
    { id: "P008", name: "Laptop Bag",            category: "Accessories",  qtySold: 39,  revenue: 23400,  icon: "💼" },
  ],

  monthlyRevenue: [
    { month: "Oct",  revenue: 48200, orders: 38 },
    { month: "Nov",  revenue: 62800, orders: 51 },
    { month: "Dec",  revenue: 89500, orders: 74 },
    { month: "Jan",  revenue: 71300, orders: 58 },
    { month: "Feb",  revenue: 55900, orders: 44 },
    { month: "Mar",  revenue: 83700, orders: 67 },
    { month: "Apr",  revenue: 34120, orders: 20 },
  ],

  weeklyRevenue: [
    { week: "Week 1", revenue: 18400, orders: 14 },
    { week: "Week 2", revenue: 22100, orders: 17 },
    { week: "Week 3", revenue: 19800, orders: 16 },
    { week: "Week 4", revenue: 23400, orders: 20 },
  ],

  categories: [
    { name: "Electronics", sales: 268300, orders: 68, color: "#6366f1" },
    { name: "Clothing",    sales: 102900, orders: 42, color: "#ec4899" },
    { name: "Accessories", sales: 65400,  orders: 30, color: "#f59e0b" },
  ],
};
