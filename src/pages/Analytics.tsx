import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { PageHeader } from "@/components/UI";
import { GlassCard, StatCard } from "@/components/StatCard";
import { monthlyData, categorySpending } from "@/data/mockData";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

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

const dailyData = Array.from({ length: 14 }, (_, i) => ({
  day: `Jan ${i + 1}`,
  spending: Math.floor(Math.random() * 5000) + 500,
}));

const netWorthData = [
  { month: "Aug", netWorth: 380000 },
  { month: "Sep", netWorth: 415000 },
  { month: "Oct", netWorth: 442000 },
  { month: "Nov", netWorth: 478000 },
  { month: "Dec", netWorth: 530000 },
  { month: "Jan", netWorth: 575000 },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Analytics" subtitle="Deep dive into your financial patterns" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Net Worth" value="₹5,75,000" subtitle="Total assets - liabilities" icon={<DollarSign size={20} />} trend={{ value: 8.9, label: "this month" }} delay={0} />
        <StatCard title="Avg Daily Spend" value="₹2,450" subtitle="Last 30 days" icon={<Activity size={20} />} trend={{ value: -4.2, label: "vs prev month" }} gradient="bg-gradient-expense" delay={1} />
        <StatCard title="Top Category" value="Shopping" subtitle="₹10,199 this month" icon={<TrendingDown size={20} />} gradient="bg-gradient-income" delay={2} />
        <StatCard title="Savings Rate" value="33.5%" subtitle="vs 30.1% last month" icon={<TrendingUp size={20} />} trend={{ value: 3.4 }} gradient="bg-gradient-savings" delay={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GlassCard className="p-5" delay={4}>
          <h3 className="font-semibold text-foreground mb-4">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ left: -5, right: 10 }} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={5}>
          <h3 className="font-semibold text-foreground mb-4">Net Worth Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={netWorthData} margin={{ left: -5, right: 10 }}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#3b82f6" strokeWidth={2.5} fill="url(#nwGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5" delay={6}>
          <h3 className="font-semibold text-foreground mb-4">Daily Spending (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyData} margin={{ left: -5, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Line type="monotone" dataKey="spending" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5" delay={7}>
          <h3 className="font-semibold text-foreground mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categorySpending} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                {categorySpending.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categorySpending.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-muted-foreground truncate">{c.name}</span>
                </div>
                <span className="font-medium text-foreground">₹{c.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
