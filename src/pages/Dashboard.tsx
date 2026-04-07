import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Target, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GlassCard } from "@/components/StatCard";
import { PageHeader } from "@/components/UI";
import { Modal } from "@/components/Modal";
import { formatINR } from "@/utils/currency";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { transactionAPI, budgetAPI } from "@/services/api";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-sm border border-border">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: ₹{Number(p.value).toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Transaction form state
  const [txForm, setTxForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "Food & Dining",
    account: "Savings"
  });

  // Fetch data from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in first');
      navigate('/signin');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [txRes, budgetRes] = await Promise.all([
          transactionAPI.getAll(),
          budgetAPI.getAll()
        ]);
        setTransactions(txRes.data);
        setBudgets(budgetRes.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please sign in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
        } else {
          toast.error('Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const recentTransactions = transactions.slice(0, 7);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  // Calculate monthly data for chart (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("en-IN", { month: "short" });
      const monthStart = month.getTime();
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).getTime();
      
      const monthTransactions = transactions.filter(t => {
        const txDate = new Date(t.date).getTime();
        return txDate >= monthStart && txDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      
      months.push({ month: monthName, income, expenses });
    }
    return months;
  }, [transactions]);

  // Calculate category spending for pie chart
  const categorySpending = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const cat = t.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
      });
    
    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  // Calculate savings rate
  const savingsRate = totalIncome > 0 
    ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    : "0";

  const handleSaveTransaction = async () => {
    if (!txForm.description.trim() || !txForm.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const amount = parseFloat(txForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const response = await transactionAPI.create({
        description: txForm.description,
        amount: txType === "expense" ? -amount : amount,
        type: txType,
        category: txForm.category,
        date: new Date(txForm.date),
        account: txForm.account
      });
      
      setTransactions(prev => [response.data, ...prev]);
      toast.success("Transaction added!");
      setAddModal(false);
      
      // Reset form
      setTxForm({
        description: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "Food & Dining",
        account: "Savings"
      });
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Dashboard" subtitle="Welcome back, Arjun! Here's your financial overview.">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Balance" value={formatINR(balance)} subtitle="Across all accounts" icon={<Wallet size={20} />} trend={{ value: 8.2, label: "vs last month" }} gradient="gradient-primary" delay={0} />
        <StatCard title="Monthly Income" value={formatINR(totalIncome)} subtitle="This month" icon={<TrendingUp size={20} />} trend={{ value: 12.5, label: "vs last month" }} gradient="bg-gradient-income" delay={1} />
        <StatCard title="Monthly Expenses" value={formatINR(totalExpenses)} subtitle="This month" icon={<TrendingDown size={20} />} trend={{ value: -3.8, label: "vs last month" }} gradient="bg-gradient-expense" delay={2} />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} subtitle="Of monthly income" icon={<Target size={20} />} trend={{ value: 2.1, label: "vs last month" }} gradient="bg-gradient-savings" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GlassCard className="lg:col-span-2 p-5" delay={4}>
          <h3 className="font-semibold text-foreground mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={5}>
          <h3 className="font-semibold text-foreground mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={categorySpending} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} dataKey="value">
                {categorySpending.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categorySpending.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-medium text-foreground">₹{c.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5" delay={6}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            <a href="/transactions" className="text-xs text-primary hover:underline">View all →</a>
          </div>
          <div className="space-y-1">
            {recentTransactions.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-base flex-shrink-0">
                  {t.type === "income" ? "💰" : t.category === "Food & Dining" ? "🍽️" : t.category === "Entertainment" ? "🎬" : t.category === "Transportation" ? "🚗" : t.category === "Bills & Utilities" ? "⚡" : t.category === "Shopping" ? "🛍️" : t.category === "Health & Fitness" ? "💪" : "💳"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                </div>
                <div className={cn("text-sm font-semibold flex-shrink-0", t.type === "income" ? "text-success" : "text-destructive")}>
                  {t.type === "income" ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={7}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Budget Status</h3>
            <a href="/budgets" className="text-xs text-primary hover:underline">View all →</a>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 5).map((b) => {
              const pct = Math.min((b.spent / b.allocated) * 100, 100);
              const isOver = pct >= 95;
              return (
                <div key={b._id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <span>{b.icon}</span> {b.category}
                    </span>
                    <span className={cn("font-semibold", isOver ? "text-destructive" : "text-muted-foreground")}>
                      ₹{b.spent.toLocaleString("en-IN")} / ₹{b.allocated.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", isOver ? "bg-destructive" : "")}
                      style={{ backgroundColor: isOver ? undefined : b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Add Transaction Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Transaction">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTxType("income")}
              className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", txType === "income" ? "border-success bg-success/10 text-success" : "border-border text-muted-foreground hover:border-success/50")}
            >
              💰 Income
            </button>
            <button
              onClick={() => setTxType("expense")}
              className={cn("py-2.5 rounded-xl border-2 text-sm font-medium transition-colors", txType === "expense" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:border-destructive/50")}
            >
              💸 Expense
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
            <input 
              type="text" 
              value={txForm.description}
              onChange={e => setTxForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Enter description"
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground" 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (₹)</label>
            <input 
              type="number" 
              value={txForm.amount}
              onChange={e => setTxForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground" 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
            <input 
              type="date" 
              value={txForm.date}
              onChange={e => setTxForm(p => ({ ...p, date: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground" 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select 
              value={txForm.category}
              onChange={e => setTxForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            >
              {["Food & Dining", "Transportation", "Shopping", "Entertainment", "Health & Fitness", "Bills & Utilities", "Education", "Income"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Account</label>
            <select 
              value={txForm.account}
              onChange={e => setTxForm(p => ({ ...p, account: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            >
              {["Savings", "Checking", "Cash", "Credit Card"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleSaveTransaction} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}