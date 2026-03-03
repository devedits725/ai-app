/**
 * Placeholder hooks for ad integration.
 * Do not hardcode ad IDs. Configure via environment or app config.
 */

export function useBannerAd() {
  // Return config for banner: unitId, size, etc.
  return { unitId: null as string | null, enabled: false };
}

export function useInterstitialAd() {
  // Return load + show for interstitial
  return {
    load: async () => {},
    show: async () => {},
    isLoaded: false,
  };
}

export function useRewardedAd() {
  // Return load + show with reward callback
  return {
    load: async () => {},
    show: async () => {},
    isLoaded: false,
    onRewarded: () => {},
  };
}
