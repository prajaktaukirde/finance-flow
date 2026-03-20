import { useState } from "react";
import { PageHeader } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { profile } from "@/data/mockData";
import { User, Mail, DollarSign, Calendar, Edit3, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your personal information">
        <button
          onClick={() => { if (editing) toast.success("Profile saved!"); setEditing(!editing); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-blue hover:opacity-90 transition-opacity"
        >
          <Edit3 size={15} /> {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </PageHeader>
      <div className="space-y-4">
        <GlassCard className="p-6" delay={0}>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-blue">{profile.avatar}</div>
              {editing && <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary shadow-sm"><Camera size={13} /></button>}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {new Date(profile.joinDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" delay={1}>
          <h3 className="font-semibold text-foreground mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Full Name", value: profile.name, icon: User },
              { label: "Email", value: profile.email, icon: Mail },
              { label: "Monthly Income", value: `₹${profile.monthlyIncome.toLocaleString("en-IN")}`, icon: DollarSign },
              { label: "Savings Rate", value: `${profile.savingsRate}%`, icon: Calendar }].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5"><Icon size={12} />{label}</label>
                {editing
                  ? <input defaultValue={value} className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                  : <p className="text-sm font-medium text-foreground bg-muted px-3 py-2 rounded-lg">{value}</p>}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Net Worth", value: "₹5,75,000", color: "text-success" },
            { label: "Goals Active", value: "4", color: "text-primary" },
            { label: "Streak", value: "47 days", color: "text-warning" }].map((s, i) => (
            <GlassCard key={s.label} className="p-4 text-center" delay={i + 2}>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
