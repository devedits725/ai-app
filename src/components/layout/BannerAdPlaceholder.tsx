import { useEffect } from "react";
import { useAds } from "@/contexts/AdsContext";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const BannerAdPlaceholder = () => {
  const { adsEnabled } = useAds();

  useEffect(() => {
    if (adsEnabled) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [adsEnabled]);

  if (!adsEnabled) return null;

  return (
    <div className="w-full min-h-[64px] bg-muted/30 border-t border-border flex items-center justify-center safe-bottom overflow-hidden">
      {/* Real AdSense Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "64px" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Placeholder: User should replace this
        data-ad-slot="XXXXXXXXXX" // Placeholder: User should replace this
        data-full-width-responsive="true"
      ></ins>

      {/* Mock fallback for development/preview */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="flex items-center gap-3 px-4">
          <span className="text-[9px] font-bold px-1 rounded bg-foreground/10 text-foreground/60">AD</span>
          <p className="text-xs font-medium">AdSense Banner Area</p>
        </div>
      </div>
    </div>
  );
};

export default BannerAdPlaceholder;
