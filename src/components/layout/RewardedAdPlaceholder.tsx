import { useEffect } from "react";
import { Gift } from "lucide-react";
import { useAds } from "@/contexts/AdsContext";

interface Props {
  show: boolean;
  onReward: () => void;
  onClose: () => void;
}

const RewardedAdPlaceholder = ({ show, onReward, onClose }: Props) => {
  const { adsEnabled } = useAds();

  useEffect(() => {
    if (show && !adsEnabled) {
      onReward();
    }
  }, [show, adsEnabled, onReward]);

  if (!show || !adsEnabled) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-8 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gift className="w-10 h-10 text-primary" />
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Rewarded Ad</span>
        <p className="text-sm text-muted-foreground text-center">Watch a short ad to unlock this AI feature</p>
        <button onClick={onReward} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium active:scale-95 transition-all">
          Watch Ad & Continue
        </button>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RewardedAdPlaceholder;
