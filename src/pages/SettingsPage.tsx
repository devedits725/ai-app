import { Moon, Sun, Share2, Star, Mail, ShieldOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import PageHeader from "@/components/layout/PageHeader";
import { toast } from "sonner";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

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
        <SettingRow icon={<ShieldOff className="w-5 h-5" />} label="Remove Ads" onClick={() => toast.info("Premium coming soon!")} badge="Coming Soon" />
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">AI Student Pocket Toolkit v1.0</p>
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
