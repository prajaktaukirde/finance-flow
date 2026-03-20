export const categories = [
  { id: "1", name: "Food & Dining", icon: "🍽️", color: "#f97316" },
  { id: "2", name: "Transportation", icon: "🚗", color: "#3b82f6" },
  { id: "3", name: "Shopping", icon: "🛍️", color: "#a855f7" },
  { id: "4", name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { id: "5", name: "Health & Fitness", icon: "💪", color: "#22c55e" },
  { id: "6", name: "Bills & Utilities", icon: "⚡", color: "#eab308" },
  { id: "7", name: "Income", icon: "💰", color: "#10b981" },
  { id: "8", name: "Savings", icon: "🏦", color: "#6366f1" },
  { id: "9", name: "Travel", icon: "✈️", color: "#06b6d4" },
  { id: "10", name: "Education", icon: "📚", color: "#8b5cf6" },
];

export const transactions = [
  { id: "t1", date: "2025-01-15", description: "Salary", category: "Income", amount: 5500, type: "income", account: "Bank" },
  { id: "t2", date: "2025-01-14", description: "Grocery Store", category: "Food & Dining", amount: -142.50, type: "expense", account: "Credit Card" },
  { id: "t3", date: "2025-01-13", description: "Netflix", category: "Entertainment", amount: -15.99, type: "expense", account: "Credit Card" },
  { id: "t4", date: "2025-01-12", description: "Uber", category: "Transportation", amount: -24.00, type: "expense", account: "Cash" },
  { id: "t5", date: "2025-01-11", description: "Electric Bill", category: "Bills & Utilities", amount: -89.00, type: "expense", account: "Bank" },
  { id: "t6", date: "2025-01-10", description: "Freelance Project", category: "Income", amount: 850, type: "income", account: "Bank" },
  { id: "t7", date: "2025-01-09", description: "Amazon Purchase", category: "Shopping", amount: -67.80, type: "expense", account: "Credit Card" },
  { id: "t8", date: "2025-01-08", description: "Gym Membership", category: "Health & Fitness", amount: -45.00, type: "expense", account: "Bank" },
  { id: "t9", date: "2025-01-07", description: "Restaurant Dinner", category: "Food & Dining", amount: -78.50, type: "expense", account: "Credit Card" },
  { id: "t10", date: "2025-01-06", description: "Spotify", category: "Entertainment", amount: -9.99, type: "expense", account: "Credit Card" },
  { id: "t11", date: "2025-01-05", description: "Gas Station", category: "Transportation", amount: -55.00, type: "expense", account: "Cash" },
  { id: "t12", date: "2025-01-04", description: "Online Course", category: "Education", amount: -29.99, type: "expense", account: "Credit Card" },
  { id: "t13", date: "2025-01-03", description: "Dividend", category: "Income", amount: 125, type: "income", account: "Investment" },
  { id: "t14", date: "2025-01-02", description: "Phone Bill", category: "Bills & Utilities", amount: -65.00, type: "expense", account: "Bank" },
  { id: "t15", date: "2025-01-01", description: "Coffee Shop", category: "Food & Dining", amount: -12.50, type: "expense", account: "Cash" },
  { id: "t16", date: "2024-12-31", description: "Year-end Bonus", category: "Income", amount: 2000, type: "income", account: "Bank" },
  { id: "t17", date: "2024-12-30", description: "Department Store", category: "Shopping", amount: -234.00, type: "expense", account: "Credit Card" },
  { id: "t18", date: "2024-12-29", description: "Movie Tickets", category: "Entertainment", amount: -32.00, type: "expense", account: "Cash" },
  { id: "t19", date: "2024-12-28", description: "Pharmacy", category: "Health & Fitness", amount: -38.50, type: "expense", account: "Cash" },
  { id: "t20", date: "2024-12-27", description: "Internet Bill", category: "Bills & Utilities", amount: -79.99, type: "expense", account: "Bank" },
];

export const budgets = [
  { id: "b1", category: "Food & Dining", icon: "🍽️", allocated: 500, spent: 342.50, color: "#f97316" },
  { id: "b2", category: "Transportation", icon: "🚗", allocated: 200, spent: 79.00, color: "#3b82f6" },
  { id: "b3", category: "Shopping", icon: "🛍️", allocated: 300, spent: 301.80, color: "#a855f7" },
  { id: "b4", category: "Entertainment", icon: "🎬", allocated: 150, spent: 57.98, color: "#ec4899" },
  { id: "b5", category: "Health & Fitness", icon: "💪", allocated: 100, spent: 83.50, color: "#22c55e" },
  { id: "b6", category: "Bills & Utilities", icon: "⚡", allocated: 400, spent: 233.99, color: "#eab308" },
];

export const goals = [
  { id: "g1", name: "Emergency Fund", icon: "🛡️", target: 10000, current: 6500, deadline: "2025-06-30", color: "#3b82f6", category: "Savings" },
  { id: "g2", name: "Vacation to Japan", icon: "✈️", target: 5000, current: 2100, deadline: "2025-12-31", color: "#06b6d4", category: "Travel" },
  { id: "g3", name: "New Laptop", icon: "💻", target: 2000, current: 1450, deadline: "2025-03-31", color: "#8b5cf6", category: "Electronics" },
  { id: "g4", name: "Down Payment", icon: "🏠", target: 50000, current: 18000, deadline: "2026-12-31", color: "#10b981", category: "Home" },
];

export const monthlyData = [
  { month: "Jul", income: 6200, expenses: 4100, savings: 2100 },
  { month: "Aug", income: 5800, expenses: 3900, savings: 1900 },
  { month: "Sep", income: 6500, expenses: 4300, savings: 2200 },
  { month: "Oct", income: 6100, expenses: 4500, savings: 1600 },
  { month: "Nov", income: 7200, expenses: 5100, savings: 2100 },
  { month: "Dec", income: 8500, expenses: 5800, savings: 2700 },
  { month: "Jan", income: 6350, expenses: 4200, savings: 2150 },
];

export const categorySpending = [
  { name: "Food & Dining", value: 342.50, color: "#f97316" },
  { name: "Transportation", value: 79.00, color: "#3b82f6" },
  { name: "Shopping", value: 301.80, color: "#a855f7" },
  { name: "Entertainment", value: 57.98, color: "#ec4899" },
  { name: "Health", value: 83.50, color: "#22c55e" },
  { name: "Bills", value: 233.99, color: "#eab308" },
];

export const recurringTransactions = [
  { id: "r1", name: "Netflix", amount: -15.99, frequency: "Monthly", nextDate: "2025-02-01", category: "Entertainment", icon: "🎬", active: true },
  { id: "r2", name: "Spotify", amount: -9.99, frequency: "Monthly", nextDate: "2025-02-05", category: "Entertainment", icon: "🎵", active: true },
  { id: "r3", name: "Gym Membership", amount: -45.00, frequency: "Monthly", nextDate: "2025-02-08", category: "Health", icon: "💪", active: true },
  { id: "r4", name: "Electric Bill", amount: -89.00, frequency: "Monthly", nextDate: "2025-02-11", category: "Utilities", icon: "⚡", active: true },
  { id: "r5", name: "Internet", amount: -79.99, frequency: "Monthly", nextDate: "2025-02-27", category: "Utilities", icon: "🌐", active: true },
  { id: "r6", name: "Phone Bill", amount: -65.00, frequency: "Monthly", nextDate: "2025-02-02", category: "Utilities", icon: "📱", active: false },
  { id: "r7", name: "Salary", amount: 5500, frequency: "Monthly", nextDate: "2025-02-15", category: "Income", icon: "💰", active: true },
];

export const notifications = [
  { id: "n1", type: "warning", title: "Budget Alert", message: "You've reached 95% of your Shopping budget.", time: "2 hours ago", read: false },
  { id: "n2", type: "info", title: "Bill Due Soon", message: "Your Electric Bill is due in 3 days.", time: "5 hours ago", read: false },
  { id: "n3", type: "success", title: "Goal Milestone", message: "You've reached 65% of your Emergency Fund goal!", time: "1 day ago", read: false },
  { id: "n4", type: "info", title: "Recurring Payment", message: "Netflix payment of $15.99 processed.", time: "2 days ago", read: true },
  { id: "n5", type: "success", title: "Salary Received", message: "Monthly salary of $5,500.00 deposited.", time: "3 days ago", read: true },
  { id: "n6", type: "warning", title: "Unusual Activity", message: "Large purchase detected: $234.00 at Department Store.", time: "5 days ago", read: true },
];

export const events = [
  {
    id: "e1",
    name: "Weekend Trip to NYC",
    icon: "🗽",
    date: "2025-01-20",
    totalAmount: 1240.00,
    members: [
      { id: "m1", name: "Alex Johnson", avatar: "AJ", paid: 450, owes: 0 },
      { id: "m2", name: "Sam Williams", avatar: "SW", paid: 290, owes: 0 },
      { id: "m3", name: "Jordan Lee", avatar: "JL", paid: 500, owes: 0 },
    ],
    expenses: [
      { id: "ex1", description: "Hotel (2 nights)", amount: 600, paidBy: "m1", splitType: "equal", date: "2025-01-20" },
      { id: "ex2", description: "Dinner at Restaurant", amount: 180, paidBy: "m3", splitType: "equal", date: "2025-01-21" },
      { id: "ex3", description: "Museum Tickets", amount: 90, paidBy: "m2", splitType: "equal", date: "2025-01-21" },
      { id: "ex4", description: "Train Tickets", amount: 240, paidBy: "m1", splitType: "equal", date: "2025-01-20" },
      { id: "ex5", description: "Souvenirs", amount: 130, paidBy: "m3", splitType: "custom", date: "2025-01-22" },
    ],
    status: "active",
    category: "Travel",
  },
  {
    id: "e2",
    name: "Office Birthday Party",
    icon: "🎂",
    date: "2025-01-10",
    totalAmount: 320.00,
    members: [
      { id: "m4", name: "Taylor Brown", avatar: "TB", paid: 320, owes: 0 },
      { id: "m5", name: "Morgan Davis", avatar: "MD", paid: 0, owes: 160 },
      { id: "m6", name: "Casey Wilson", avatar: "CW", paid: 0, owes: 160 },
    ],
    expenses: [
      { id: "ex6", description: "Cake", amount: 80, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
      { id: "ex7", description: "Food & Snacks", amount: 150, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
      { id: "ex8", description: "Decorations", amount: 90, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
    ],
    status: "settled",
    category: "Party",
  },
  {
    id: "e3",
    name: "Housewarming Party",
    icon: "🏠",
    date: "2025-02-05",
    totalAmount: 580.00,
    members: [
      { id: "m7", name: "Riley Garcia", avatar: "RG", paid: 200, owes: 0 },
      { id: "m8", name: "Quinn Martinez", avatar: "QM", paid: 380, owes: 0 },
    ],
    expenses: [
      { id: "ex9", description: "Food & Drinks", amount: 280, paidBy: "m8", splitType: "equal", date: "2025-02-05" },
      { id: "ex10", description: "Decorations", amount: 150, paidBy: "m7", splitType: "equal", date: "2025-02-05" },
      { id: "ex11", description: "Venue Setup", amount: 150, paidBy: "m8", splitType: "equal", date: "2025-02-05" },
    ],
    status: "active",
    category: "Party",
  },
];

export const profile = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "AJ",
  currency: "USD",
  timezone: "America/New_York",
  monthlyIncome: 6350,
  savingsRate: 30,
  joinDate: "2023-06-15",
};
