import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADS_DISABLED_UNTIL_KEY = 'ads-disabled-until';

interface AdsContextType {
  /** True when ads should be hidden (e.g. trial or "disable for N days" active). */
  adsDisabled: boolean;
  /** When ads are disabled, this is the end date (ms) or null. */
  adsDisabledUntil: number | null;
  /** Disable all ad placeholders for the next N days. */
  disableAdsForDays: (days: number) => Promise<void>;
  /** Re-enable ads immediately. */
  enableAds: () => Promise<void>;
}

const AdsContext = createContext<AdsContextType>({
  adsDisabled: false,
  adsDisabledUntil: null,
  disableAdsForDays: async () => {},
  enableAds: async () => {},
});

export const useAds = () => useContext(AdsContext);

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adsDisabledUntil, setAdsDisabledUntil] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(ADS_DISABLED_UNTIL_KEY);
        if (stored) {
          const ts = parseInt(stored, 10);
          if (!isNaN(ts)) setAdsDisabledUntil(ts);
        }
      } catch {
        setAdsDisabledUntil(null);
      }
    })();
  }, []);

  const now = Date.now();
  const adsDisabled = adsDisabledUntil !== null && now < adsDisabledUntil;

  const disableAdsForDays = async (days: number) => {
    const until = now + days * 24 * 60 * 60 * 1000;
    setAdsDisabledUntil(until);
    await AsyncStorage.setItem(ADS_DISABLED_UNTIL_KEY, String(until));
  };

  const enableAds = async () => {
    setAdsDisabledUntil(null);
    await AsyncStorage.removeItem(ADS_DISABLED_UNTIL_KEY);
  };

  return (
    <AdsContext.Provider
      value={{
        adsDisabled,
        adsDisabledUntil: adsDisabled ? adsDisabledUntil : null,
        disableAdsForDays,
        enableAds,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
};
