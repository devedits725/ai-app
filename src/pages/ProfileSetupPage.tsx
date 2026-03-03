import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, User, Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileSetupPage = () => {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: avatarUrl }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile setup complete!");
      navigate("/");
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfdff] dark:bg-[#0a0a0c] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-10 relative z-10"
      >
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block"
          >
            <Sparkles className="w-12 h-12 text-purple-600 mb-2" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Setup profile</h1>
          <p className="text-muted-foreground text-lg">Just a few more details to get started</p>
        </div>

        <div className="bg-white/80 dark:bg-card/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[40px] p-10 shadow-2xl shadow-purple-500/5 space-y-10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="w-36 h-36 border-8 border-white dark:border-card shadow-2xl relative">
                <AvatarImage src={avatarUrl || ""} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <User className="w-14 h-14 text-blue-600 dark:text-blue-400" />
                </AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all">
                <Camera className="w-5 h-5" />
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Upload Avatar</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-sm font-semibold ml-1">Display Name</Label>
              <Input
                id="display-name"
                placeholder="What should we call you?"
                className="h-13 rounded-2xl bg-secondary/30 border-secondary focus:bg-white transition-all text-center text-lg font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button onClick={handleComplete} className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
              {loading ? "Saving..." : "Start Learning"}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
};

export default ProfileSetupPage;
