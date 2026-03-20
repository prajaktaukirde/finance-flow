import { useState } from "react";
import { PageHeader } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Bell, Shield, Globe, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", checked ? "bg-primary" : "bg-muted")}>
      <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({ budgetAlerts: true, billReminders: true, goalMilestones: true, weeklyReport: false });
  const toggle = (k: keyof typeof notifications) => setNotifications(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Settings" subtitle="Customize your finance app experience" />
      <div className="space-y-4">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Globe size={16} className="text-primary" />Appearance</h3>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={18} className="text-muted-foreground" /> : <Sun size={18} className="text-warning" />}
              <div><p className="text-sm font-medium text-foreground">Dark Mode</p><p className="text-xs text-muted-foreground">Switch between light and dark theme</p></div>
            </div>
            <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Bell size={16} className="text-primary" />Notifications</h3>
          {[{ key: "budgetAlerts", label: "Budget Alerts", desc: "Get notified when you exceed 80% of a budget" },
            { key: "billReminders", label: "Bill Reminders", desc: "Reminders for upcoming bills" },
            { key: "goalMilestones", label: "Goal Milestones", desc: "Celebrate when you hit savings milestones" },
            { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly spending summary" }].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              <ToggleSwitch checked={notifications[key as keyof typeof notifications]} onChange={() => toggle(key as keyof typeof notifications)} />
            </div>
          ))}
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><DollarSign size={16} className="text-primary" />Financial</h3>
          {[{ label: "Currency", options: ["USD", "EUR", "GBP", "JPY"], defaultVal: "USD" },
            { label: "Date Format", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], defaultVal: "MM/DD/YYYY" }].map(({ label, options, defaultVal }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <select defaultValue={defaultVal} className="text-sm bg-muted px-2 py-1 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Shield size={16} className="text-primary" />Security</h3>
          <button onClick={() => toast.success("Password reset email sent!")} className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Change Password</button>
        </GlassCard>
      </div>
    </div>
  );
}
