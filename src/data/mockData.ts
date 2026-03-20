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
  { id: "t1", date: "2025-01-15", description: "Salary", category: "Income", amount: 85000, type: "income", account: "Bank" },
  { id: "t2", date: "2025-01-14", description: "Grocery Store", category: "Food & Dining", amount: -3200, type: "expense", account: "Credit Card" },
  { id: "t3", date: "2025-01-13", description: "Netflix", category: "Entertainment", amount: -649, type: "expense", account: "Credit Card" },
  { id: "t4", date: "2025-01-12", description: "Ola Cab", category: "Transportation", amount: -450, type: "expense", account: "Cash" },
  { id: "t5", date: "2025-01-11", description: "Electricity Bill", category: "Bills & Utilities", amount: -2100, type: "expense", account: "Bank" },
  { id: "t6", date: "2025-01-10", description: "Freelance Project", category: "Income", amount: 25000, type: "income", account: "Bank" },
  { id: "t7", date: "2025-01-09", description: "Amazon Purchase", category: "Shopping", amount: -4599, type: "expense", account: "Credit Card" },
  { id: "t8", date: "2025-01-08", description: "Gym Membership", category: "Health & Fitness", amount: -1500, type: "expense", account: "Bank" },
  { id: "t9", date: "2025-01-07", description: "Restaurant Dinner", category: "Food & Dining", amount: -1800, type: "expense", account: "Credit Card" },
  { id: "t10", date: "2025-01-06", description: "Spotify", category: "Entertainment", amount: -119, type: "expense", account: "Credit Card" },
  { id: "t11", date: "2025-01-05", description: "Petrol", category: "Transportation", amount: -3000, type: "expense", account: "Cash" },
  { id: "t12", date: "2025-01-04", description: "Online Course", category: "Education", amount: -1999, type: "expense", account: "Credit Card" },
  { id: "t13", date: "2025-01-03", description: "Dividend", category: "Income", amount: 4200, type: "income", account: "Investment" },
  { id: "t14", date: "2025-01-02", description: "Mobile Bill", category: "Bills & Utilities", amount: -899, type: "expense", account: "Bank" },
  { id: "t15", date: "2025-01-01", description: "Coffee Shop", category: "Food & Dining", amount: -280, type: "expense", account: "Cash" },
  { id: "t16", date: "2024-12-31", description: "Year-end Bonus", category: "Income", amount: 30000, type: "income", account: "Bank" },
  { id: "t17", date: "2024-12-30", description: "Myntra Shopping", category: "Shopping", amount: -5600, type: "expense", account: "Credit Card" },
  { id: "t18", date: "2024-12-29", description: "Movie Tickets", category: "Entertainment", amount: -700, type: "expense", account: "Cash" },
  { id: "t19", date: "2024-12-28", description: "Pharmacy", category: "Health & Fitness", amount: -950, type: "expense", account: "Cash" },
  { id: "t20", date: "2024-12-27", description: "Internet Bill", category: "Bills & Utilities", amount: -799, type: "expense", account: "Bank" },
];

export const budgets = [
  { id: "b1", category: "Food & Dining", icon: "🍽️", allocated: 8000, spent: 5280, color: "#f97316" },
  { id: "b2", category: "Transportation", icon: "🚗", allocated: 5000, spent: 3450, color: "#3b82f6" },
  { id: "b3", category: "Shopping", icon: "🛍️", allocated: 10000, spent: 10199, color: "#a855f7" },
  { id: "b4", category: "Entertainment", icon: "🎬", allocated: 3000, spent: 1468, color: "#ec4899" },
  { id: "b5", category: "Health & Fitness", icon: "💪", allocated: 4000, spent: 2450, color: "#22c55e" },
  { id: "b6", category: "Bills & Utilities", icon: "⚡", allocated: 7000, spent: 3798, color: "#eab308" },
];

export const goals = [
  { id: "g1", name: "Emergency Fund", icon: "🛡️", target: 500000, current: 325000, deadline: "2025-06-30", color: "#3b82f6", category: "Savings" },
  { id: "g2", name: "Vacation to Goa", icon: "✈️", target: 80000, current: 35000, deadline: "2025-12-31", color: "#06b6d4", category: "Travel" },
  { id: "g3", name: "New MacBook", icon: "💻", target: 150000, current: 90000, deadline: "2025-03-31", color: "#8b5cf6", category: "Electronics" },
  { id: "g4", name: "Home Down Payment", icon: "🏠", target: 2000000, current: 650000, deadline: "2026-12-31", color: "#10b981", category: "Home" },
];

export const monthlyData = [
  { month: "Jul", income: 95000, expenses: 62000, savings: 33000 },
  { month: "Aug", income: 88000, expenses: 58000, savings: 30000 },
  { month: "Sep", income: 102000, expenses: 70000, savings: 32000 },
  { month: "Oct", income: 91000, expenses: 65000, savings: 26000 },
  { month: "Nov", income: 110000, expenses: 78000, savings: 32000 },
  { month: "Dec", income: 135000, expenses: 89000, savings: 46000 },
  { month: "Jan", income: 114200, expenses: 76000, savings: 38200 },
];

export const categorySpending = [
  { name: "Food & Dining", value: 5280, color: "#f97316" },
  { name: "Transportation", value: 3450, color: "#3b82f6" },
  { name: "Shopping", value: 10199, color: "#a855f7" },
  { name: "Entertainment", value: 1468, color: "#ec4899" },
  { name: "Health", value: 2450, color: "#22c55e" },
  { name: "Bills", value: 3798, color: "#eab308" },
];

export const recurringTransactions = [
  { id: "r1", name: "Netflix", amount: -649, frequency: "Monthly", nextDate: "2025-02-01", category: "Entertainment", icon: "🎬", active: true },
  { id: "r2", name: "Spotify", amount: -119, frequency: "Monthly", nextDate: "2025-02-05", category: "Entertainment", icon: "🎵", active: true },
  { id: "r3", name: "Gym Membership", amount: -1500, frequency: "Monthly", nextDate: "2025-02-08", category: "Health", icon: "💪", active: true },
  { id: "r4", name: "Electricity Bill", amount: -2100, frequency: "Monthly", nextDate: "2025-02-11", category: "Utilities", icon: "⚡", active: true },
  { id: "r5", name: "Internet", amount: -799, frequency: "Monthly", nextDate: "2025-02-27", category: "Utilities", icon: "🌐", active: true },
  { id: "r6", name: "Mobile Bill", amount: -899, frequency: "Monthly", nextDate: "2025-02-02", category: "Utilities", icon: "📱", active: false },
  { id: "r7", name: "Salary", amount: 85000, frequency: "Monthly", nextDate: "2025-02-15", category: "Income", icon: "💰", active: true },
];

export const notifications = [
  { id: "n1", type: "warning", title: "Budget Alert", message: "You've reached 95% of your Shopping budget.", time: "2 hours ago", read: false },
  { id: "n2", type: "info", title: "Bill Due Soon", message: "Your Electricity Bill is due in 3 days.", time: "5 hours ago", read: false },
  { id: "n3", type: "success", title: "Goal Milestone", message: "You've reached 65% of your Emergency Fund goal!", time: "1 day ago", read: false },
  { id: "n4", type: "info", title: "Recurring Payment", message: "Netflix payment of ₹649 processed.", time: "2 days ago", read: true },
  { id: "n5", type: "success", title: "Salary Received", message: "Monthly salary of ₹85,000 deposited.", time: "3 days ago", read: true },
  { id: "n6", type: "warning", title: "Unusual Activity", message: "Large purchase detected: ₹5,600 at Myntra.", time: "5 days ago", read: true },
];

export const events = [
  {
    id: "e1",
    name: "Weekend Trip to Goa",
    icon: "🏖️",
    date: "2025-01-20",
    totalAmount: 42000,
    members: [
      { id: "m1", name: "Arjun Sharma", avatar: "AS", paid: 18000, owes: 0 },
      { id: "m2", name: "Priya Patel", avatar: "PP", paid: 12000, owes: 0 },
      { id: "m3", name: "Rohit Kumar", avatar: "RK", paid: 12000, owes: 0 },
    ],
    expenses: [
      { id: "ex1", description: "Hotel (2 nights)", amount: 18000, paidBy: "m1", splitType: "equal", date: "2025-01-20" },
      { id: "ex2", description: "Dinner at Shack", amount: 6000, paidBy: "m3", splitType: "equal", date: "2025-01-21" },
      { id: "ex3", description: "Water Sports", amount: 9000, paidBy: "m2", splitType: "equal", date: "2025-01-21" },
      { id: "ex4", description: "Train Tickets", amount: 4800, paidBy: "m1", splitType: "equal", date: "2025-01-20" },
      { id: "ex5", description: "Taxi & Sightseeing", amount: 4200, paidBy: "m3", splitType: "custom", date: "2025-01-22" },
    ],
    status: "active",
    category: "Travel",
  },
  {
    id: "e2",
    name: "Office Birthday Party",
    icon: "🎂",
    date: "2025-01-10",
    totalAmount: 8500,
    members: [
      { id: "m4", name: "Neha Singh", avatar: "NS", paid: 8500, owes: 0 },
      { id: "m5", name: "Vikram Das", avatar: "VD", paid: 0, owes: 4250 },
      { id: "m6", name: "Ananya Roy", avatar: "AR", paid: 0, owes: 4250 },
    ],
    expenses: [
      { id: "ex6", description: "Cake", amount: 1500, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
      { id: "ex7", description: "Food & Snacks", amount: 4500, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
      { id: "ex8", description: "Decorations", amount: 2500, paidBy: "m4", splitType: "equal", date: "2025-01-10" },
    ],
    status: "settled",
    category: "Party",
  },
  {
    id: "e3",
    name: "Housewarming Party",
    icon: "🏠",
    date: "2025-02-05",
    totalAmount: 22000,
    members: [
      { id: "m7", name: "Ravi Gupta", avatar: "RG", paid: 10000, owes: 0 },
      { id: "m8", name: "Meera Joshi", avatar: "MJ", paid: 12000, owes: 0 },
    ],
    expenses: [
      { id: "ex9", description: "Food & Drinks", amount: 10000, paidBy: "m8", splitType: "equal", date: "2025-02-05" },
      { id: "ex10", description: "Decorations", amount: 6000, paidBy: "m7", splitType: "equal", date: "2025-02-05" },
      { id: "ex11", description: "Venue Setup", amount: 6000, paidBy: "m8", splitType: "equal", date: "2025-02-05" },
    ],
    status: "active",
    category: "Party",
  },
];

export const profile = {
  name: "Arjun Sharma",
  email: "arjun.sharma@email.com",
  avatar: "AS",
  currency: "INR",
  timezone: "Asia/Kolkata",
  monthlyIncome: 85000,
  savingsRate: 33,
  joinDate: "2023-06-15",
};
