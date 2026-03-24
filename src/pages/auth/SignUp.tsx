import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, TrendingUp, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    toast.success(`Welcome to Finance Flow, ${form.name.split(" ")[0]}! 🎊`);
    setTimeout(() => navigate("/"), 800);
  };

  const field = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const pwdStrength = passwordRules.filter((r) => r.test(form.password)).length;
  const strengthLabel = ["Weak", "Fair", "Strong"][pwdStrength - 1] ?? "";
  const strengthColor = ["bg-destructive", "bg-warning", "bg-success"][pwdStrength - 1] ?? "bg-muted";
  const strengthTextColor = ["text-destructive", "text-warning", "text-success"][pwdStrength - 1] ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-background to-primary/20" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-blue mb-3">
            <TrendingUp className="text-primary-foreground" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finance Flow</h1>
          <p className="text-muted-foreground text-sm mt-1">Start your financial journey today</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-border">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Create account</h2>
            <p className="text-muted-foreground text-sm mt-1">Join thousands managing their finances smarter</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type="text" value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="Arjun Sharma"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.name ? "border-destructive" : "border-border focus:border-primary"}`} />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)} placeholder="arjun@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.email ? "border-destructive" : "border-border focus:border-primary"}`} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => field("password", e.target.value)} placeholder="Create a strong password"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.password ? "border-destructive" : "border-border focus:border-primary"}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              {form.password && (
                <div className="space-y-2 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < pwdStrength ? strengthColor : "bg-muted"}`} />
                      ))}
                    </div>
                    {strengthLabel && <span className={`text-xs font-medium ${strengthTextColor}`}>{strengthLabel}</span>}
                  </div>
                  <div className="space-y-0.5">
                    {passwordRules.map((r) => (
                      <div key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${r.test(form.password) ? "text-success" : "text-muted-foreground"}`}>
                        <CheckCircle2 size={11} className={r.test(form.password) ? "text-success" : "text-muted-foreground/40"} />
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => field("confirmPassword", e.target.value)} placeholder="Repeat your password"
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.confirmPassword ? "border-destructive" : form.confirmPassword && form.password === form.confirmPassword ? "border-success" : "border-border focus:border-primary"}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs text-success flex items-center gap-1"><CheckCircle2 size={11} /> Passwords match</p>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our{" "}
              <button type="button" onClick={() => toast("Terms of Service", { icon: "📄" })} className="text-primary hover:underline">Terms</button>
              {" & "}
              <button type="button" onClick={() => toast("Privacy Policy", { icon: "🔒" })} className="text-primary hover:underline">Privacy Policy</button>
            </p>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-blue hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Creating account...</>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2024 Finance Flow • Secure & Private</p>
      </div>
    </div>
  );
}
