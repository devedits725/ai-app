import { Moon, Sun, Share2, Star, Mail, ShieldOff, Info, ShieldCheck } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAds } from "@/contexts/AdsContext";
import PageHeader from "@/components/layout/PageHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { adsEnabled, toggleAds } = useAds();
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await navigator.share?.({ title: "AI Student Pocket Toolkit", text: "Check out this awesome study app!", url: window.location.origin });
    } catch {
      toast.info("Share not supported on this device");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Settings" />
      <div className="p-4 space-y-2">
        <SettingRow icon={theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} label={theme === "dark" ? "Light Mode" : "Dark Mode"} onClick={toggleTheme} />
        <SettingRow icon={<Share2 className="w-5 h-5" />} label="Share App" onClick={handleShare} />
        <SettingRow icon={<Star className="w-5 h-5" />} label="Rate App" onClick={() => toast.info("Rating coming soon!")} />
        <SettingRow icon={<Mail className="w-5 h-5" />} label="Send Feedback" onClick={() => window.open("mailto:feedback@studenttoolkit.app?subject=App Feedback")} />
        <SettingRow icon={<ShieldOff className="w-5 h-5" />} label={adsEnabled ? "Remove Ads" : "Ads Removed"} onClick={() => { toggleAds(); if (adsEnabled) toast.success("Ads removed (Premium Mock)"); else toast.info("Ads restored"); }} badge={!adsEnabled ? "Premium" : undefined} />
        <SettingRow icon={<Info className="w-5 h-5" />} label="Credits" onClick={() => navigate("/credits")} />
        <SettingRow icon={<ShieldCheck className="w-5 h-5" />} label="Privacy Policy" onClick={() => navigate("/privacy")} />
      </div>
      <div className="mt-8 px-4 text-center space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">AI Student Pocket Toolkit</p>
        <p className="text-[10px] text-muted-foreground">Version 1.0.0</p>
        <p className="text-[10px] text-muted-foreground italic">made for students by student</p>
        <p className="text-[10px] text-muted-foreground mt-2">© 2025-2026 Dev raheja all rights reserved.</p>
      </div>
    </div>
  );
};

const SettingRow = ({ icon, label, onClick, badge }: { icon: React.ReactNode; label: string; onClick: () => void; badge?: string }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-secondary/50 active:scale-[0.99] transition-all">
    {icon}
    <span className="flex-1 text-sm font-medium text-left">{label}</span>
    {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{badge}</span>}
  </button>
);

export default SettingsPage;
