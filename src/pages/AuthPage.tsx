import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome, ArrowRight, ChevronLeft, CheckCircle2, Apple } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type AuthMode = "login" | "signup" | "forgot";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setGuestMode } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false }
  });

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" }
  });

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
    setLoading(false);
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.name }
      }
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please verify your email.");
      navigate("/profile-setup");
    }
    setLoading(false);
  };

  const onForgot = async (values: z.infer<typeof forgotSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reset link sent!");
      setMode("login");
    }
    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login integration coming soon!`);
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfdff] dark:bg-[#0a0a0c] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-6 shadow-2xl shadow-blue-500/20"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Toolkit Auth</h1>
          <p className="text-muted-foreground mt-3 text-lg">Your premium study companion</p>
        </div>

        <div className="bg-white/80 dark:bg-card/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[40px] p-10 shadow-2xl shadow-blue-500/5 transition-all">
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Welcome back</h2>
                  <p className="text-muted-foreground">Log in to your account</p>
                </div>

                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        {...loginForm.register("email")}
                        type="email"
                        placeholder="name@example.com"
                        className="pl-12 h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-xs text-destructive mt-1 ml-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <Label className="text-sm font-semibold">Password</Label>
                      <button type="button" onClick={() => setMode("forgot")} className="text-xs font-bold text-blue-600 hover:text-purple-600 transition-colors">Forgot?</button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        {...loginForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-12 h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-destructive mt-1 ml-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-1">
                    <Checkbox
                      id="remember"
                      checked={loginForm.watch("rememberMe")}
                      onCheckedChange={(val) => loginForm.setValue("rememberMe", !!val)}
                      className="rounded-md"
                    />
                    <Label htmlFor="remember" className="text-sm font-medium cursor-pointer text-muted-foreground">Remember me</Label>
                  </div>

                  <Button type="submit" className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Log In"}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white dark:bg-card px-3 text-muted-foreground font-bold">Or connect via</span></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-13 rounded-2xl border-secondary bg-secondary/20 hover:bg-secondary/40" onClick={() => handleSocialLogin('Google')}>
                    <Chrome className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-13 rounded-2xl border-secondary bg-secondary/20 hover:bg-secondary/40" onClick={() => handleSocialLogin('Apple')}>
                    <Apple className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-13 rounded-2xl border-secondary bg-secondary/20 hover:bg-secondary/40" onClick={() => handleSocialLogin('Github')}>
                    <Github className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  New here?{" "}
                  <button onClick={() => setMode("signup")} className="font-bold text-blue-600 hover:text-purple-600 underline underline-offset-4">Create Account</button>
                </p>
              </motion.div>
            )}

            {mode === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <button onClick={() => setMode("login")} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-blue-600 transition-colors mb-2 uppercase tracking-wider">
                    <ChevronLeft className="mr-1 w-4 h-4" /> Back to login
                  </button>
                  <h2 className="text-2xl font-bold">Start your journey</h2>
                  <p className="text-muted-foreground">Unlock your full potential</p>
                </div>

                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                      <Input {...signupForm.register("name")} placeholder="John Doe" className="pl-12 h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all" />
                      {signupForm.formState.errors.name && (
                        <p className="text-xs text-destructive mt-1 ml-1">{signupForm.formState.errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                      <Input {...signupForm.register("email")} type="email" placeholder="name@example.com" className="pl-12 h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all" />
                      {signupForm.formState.errors.email && (
                        <p className="text-xs text-destructive mt-1 ml-1">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Password</Label>
                      <Input {...signupForm.register("password")} type="password" placeholder="••••••" className="h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all" />
                      {signupForm.formState.errors.password && (
                        <p className="text-xs text-destructive mt-1 ml-1">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Confirm</Label>
                      <Input {...signupForm.register("confirmPassword")} type="password" placeholder="••••••" className="h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all" />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-destructive mt-1 ml-1">{signupForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 ml-1 pt-2">
                    <Checkbox id="terms" checked={signupForm.watch("terms")} onCheckedChange={(val) => signupForm.setValue("terms", !!val)} className="rounded-md mt-0.5" />
                    <Label htmlFor="terms" className="text-xs font-medium leading-relaxed text-muted-foreground cursor-pointer">
                      I accept the <span className="text-blue-600 font-bold">Terms</span> & <span className="text-blue-600 font-bold">Privacy Policy</span>
                    </Label>
                  </div>
                  {signupForm.formState.errors.terms && (
                    <p className="text-[10px] text-destructive ml-1">{signupForm.formState.errors.terms.message}</p>
                  )}

                  <Button type="submit" className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg mt-2 active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Create Account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already joined?{" "}
                  <button onClick={() => setMode("login")} className="font-bold text-blue-600 hover:text-purple-600 underline underline-offset-4">Log In</button>
                </p>
              </motion.div>
            )}

            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <button onClick={() => setMode("login")} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-blue-600 transition-colors mb-2 uppercase tracking-wider">
                    <ChevronLeft className="mr-1 w-4 h-4" /> Back to login
                  </button>
                  <h2 className="text-2xl font-bold">Reset security</h2>
                  <p className="text-muted-foreground">We'll help you get back in</p>
                </div>

                <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input {...forgotForm.register("email")} type="email" placeholder="name@example.com" className="pl-12 h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all" />
                      {forgotForm.formState.errors.email && (
                        <p className="text-xs text-destructive mt-1 ml-1">{forgotForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Reset Link"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { setGuestMode(true); navigate("/"); }}
            className="group text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
          >
            Skip for now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
