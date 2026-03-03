import React, { createContext, useContext, useState, useEffect } from "react";

interface AdsContextType {
  adsEnabled: boolean;
  toggleAds: () => void;
  setAdsEnabled: (enabled: boolean) => void;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adsEnabled, setAdsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem("ads-enabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const setAdsEnabled = (enabled: boolean) => {
    setAdsEnabledState(enabled);
    localStorage.setItem("ads-enabled", JSON.stringify(enabled));
  };

  const toggleAds = () => {
    setAdsEnabled(!adsEnabled);
  };

  return (
    <AdsContext.Provider value={{ adsEnabled, toggleAds, setAdsEnabled }}>
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return context;
};
