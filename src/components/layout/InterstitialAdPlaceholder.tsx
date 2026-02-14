import { X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
}

const InterstitialAdPlaceholder = ({ show, onClose }: Props) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-8 flex flex-col items-center gap-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary">
          <X className="w-5 h-5" />
        </button>
        <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
          <span className="text-2xl">📢</span>
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Interstitial Ad</span>
        <p className="text-sm text-muted-foreground text-center">Full-screen ad placeholder — will show AdMob interstitial in production</p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium active:scale-95 transition-all">
          Continue
        </button>
      </div>
    </div>
  );
};

export default InterstitialAdPlaceholder;
