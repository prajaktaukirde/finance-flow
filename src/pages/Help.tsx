import { motion } from "framer-motion";
import { PageHeader } from "@/components/UI";
import { GlassCard } from "@/components/StatCard";
import { HelpCircle, MessageCircle, Book, Mail } from "lucide-react";

const faqs = [
  { q: "How do I add a transaction?", a: "Go to Transactions and click 'Add'. Fill in the details and hit Save." },
  { q: "How does budget tracking work?", a: "Set a monthly limit per category in Budgets. The app tracks your spending against it automatically." },
  { q: "Can I export my data?", a: "Yes! Go to Reports and use Export CSV or Export PDF buttons." },
  { q: "How do group expenses work?", a: "Create an Event in the Events page, add members and expenses, and the app calculates who owes whom." },
  { q: "What are recurring transactions?", a: "These are automatic entries for subscriptions, salaries, or bills that repeat on a schedule." },
];

export default function Help() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Help & Support" subtitle="Find answers to common questions" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[{ icon: Book, label: "Documentation", desc: "Browse guides & tutorials", color: "text-primary" },
          { icon: MessageCircle, label: "Live Chat", desc: "Chat with support team", color: "text-success" },
          { icon: Mail, label: "Email Support", desc: "support@financeos.app", color: "text-warning" }].map(({ icon: Icon, label, desc, color }, i) => (
          <GlassCard key={label} className="p-4 text-center cursor-pointer hover-lift" delay={i}>
            <Icon size={24} className={`mx-auto mb-2 ${color}`} />
            <p className="font-medium text-foreground text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="overflow-hidden" delay={3}>
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><HelpCircle size={16} className="text-primary" />Frequently Asked Questions</h3>
        </div>
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }} className="p-5 border-b border-border last:border-0">
            <p className="font-medium text-foreground text-sm mb-1">{faq.q}</p>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </motion.div>
        ))}
      </GlassCard>
    </div>
  );
}
