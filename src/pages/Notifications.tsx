import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { PageHeader, Badge } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { notifications } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", badge: "warning" as const },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", badge: "success" as const },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10", badge: "info" as const },
};

export default function Notifications() {
  const [items, setItems] = useState(notifications);

  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}>
        {unreadCount > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
            <Check size={14} /> Mark all read
          </button>
        )}
      </PageHeader>

      <GlassCard className="overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          items.map((n, i) => {
            const cfg = typeConfig[n.type as keyof typeof typeConfig];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex items-start gap-4 p-4 border-b border-border last:border-0 cursor-pointer transition-colors",
                  n.read ? "hover:bg-muted/30" : "bg-primary/5 hover:bg-primary/8"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-sm font-medium", n.read ? "text-foreground" : "text-foreground font-semibold")}>{n.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={cfg.badge}>{n.type}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 animate-pulse-glow" />}
              </motion.div>
            );
          })
        )}
      </GlassCard>
    </div>
  );
}
