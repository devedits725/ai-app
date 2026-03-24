import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Enhanced theme detection with fallbacks
    const stored = localStorage.getItem("app-theme");
    const systemPrefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (stored === "dark" || stored === "light") {
      return stored; // Use explicitly stored theme if valid
    }
    
    // If no stored theme, use system preference with fallback to light
    return systemPrefers ? "dark" : "light";
  });

  useEffect(() => {
    // Apply theme immediately and save to localStorage
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);
    
    // Also set a CSS custom property for immediate theme application
    document.documentElement.setAttribute('data-theme', theme);
    
    console.log("Theme set to:", theme, "Stored:", stored, "System prefers:", systemPrefers ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Log theme changes for debugging
    console.log("Theme toggled from", theme, "to", newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
