// Categories for transactions
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

// Types
export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type Budget = {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
  color: string;
};

export type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
  savings: number;
};

export type CategorySpending = {
  name: string;
  value: number;
  color: string;
};

export type RecurringTransaction = {
  id: string;
  name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly";
  nextDate: string;
  category: string;
  type: "income" | "expense";
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
};

export type EventMember = {
  id: string;
  name: string;
  avatar: string;
  paid: number;
  owes: number;
  email?: string;
};

export type EventExpense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitType?: "equal" | "custom" | "selective";
  customSplits?: Record<string, number>;
  selectedMembers?: string[];
  isSettlement?: boolean;
};

export type Event = {
  id: string;
  name: string;
  category: string;
  date: string;
  icon: string;
  status: "active" | "settled";
  members: EventMember[];
  expenses: EventExpense[];
  totalAmount?: number;
};

// Empty initial data - app starts fresh
export const transactions: Transaction[] = [];
export const budgets: Budget[] = [];
export const goals: Goal[] = [];
export const monthlyData: MonthlyData[] = [];
export const categorySpending: CategorySpending[] = [];
export const recurringTransactions: RecurringTransaction[] = [];
export const notifications: Notification[] = [];
export const events: Event[] = [];

export const profile = {
  name: "",
  email: "",
  avatar: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
  monthlyIncome: 0,
  savingsRate: 0,
  joinDate: new Date().toISOString().split("T")[0],
};
