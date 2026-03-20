import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GlassCard } from "@/components/StatCard";
import { PageHeader } from "@/components/UI";
import { Modal } from "@/components/Modal";
import { transactions, monthlyData, categorySpending, budgets, goals } from "@/data/mockData";
import { cn } from "@/lib/utils";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-semibold" fontSize={11}>
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
            {p.name}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [addModal, setAddModal] = useState(false);
  const recentTransactions = transactions.slice(0, 7);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Dashboard" subtitle="Welcome back, Alex! Here's your financial overview.">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Balance"
          value={`$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtitle="Across all accounts"
          icon={<Wallet size={20} />}
          trend={{ value: 8.2, label: "vs last month" }}
          gradient="gradient-primary"
          delay={0}
        />
        <StatCard
          title="Monthly Income"
          value={`$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtitle="This month"
          icon={<TrendingUp size={20} />}
          trend={{ value: 12.5, label: "vs last month" }}
          gradient="bg-gradient-income"
          delay={1}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtitle="This month"
          icon={<TrendingDown size={20} />}
          trend={{ value: -3.8, label: "vs last month" }}
          gradient="bg-gradient-expense"
          delay={2}
        />
        <StatCard
          title="Savings Rate"
          value="30.2%"
          subtitle="Of monthly income"
          icon={<Target size={20} />}
          trend={{ value: 2.1, label: "vs last month" }}
          gradient="bg-gradient-savings"
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Area Chart */}
        <GlassCard className="lg:col-span-2 p-5" delay={4}>
          <h3 className="font-semibold text-foreground mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Pie Chart */}
        <GlassCard className="p-5" delay={5}>
          <h3 className="font-semibold text-foreground mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={categorySpending} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} dataKey="value">
                {categorySpending.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `$${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categorySpending.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-medium text-foreground">${c.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <GlassCard className="lg:col-span-2 p-5" delay={6}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            <a href="/transactions" className="text-xs text-primary hover:underline">View all →</a>
          </div>
          <div className="space-y-1">
            {recentTransactions.map((t, i) => (
              <motion.div
                key={t.id}
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
                  <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className={cn("text-sm font-semibold flex-shrink-0", t.type === "income" ? "text-success" : "text-destructive")}>
                  {t.type === "income" ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Budget Overview */}
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
                <div key={b.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <span>{b.icon}</span> {b.category}
                    </span>
                    <span className={cn("font-semibold", isOver ? "text-destructive" : "text-muted-foreground")}>
                      ${b.spent.toFixed(0)} / ${b.allocated}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", isOver ? "bg-destructive" : "bg-primary")}
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
            <button className="py-2.5 rounded-xl border-2 border-success/50 bg-success/10 text-success text-sm font-medium">💰 Income</button>
            <button className="py-2.5 rounded-xl border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">💸 Expense</button>
          </div>
          {["Description", "Amount", "Date"].map((label) => (
            <div key={label}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
              <input type={label === "Amount" ? "number" : label === "Date" ? "date" : "text"} placeholder={label === "Amount" ? "0.00" : `Enter ${label.toLowerCase()}`}
                className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
            <select className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground">
              {["Food & Dining", "Transportation", "Shopping", "Entertainment", "Health", "Bills"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
