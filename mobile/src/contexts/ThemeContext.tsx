import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/theme';

const THEME_KEY = 'app-theme';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof colors.light | typeof colors.dark;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: colors.light,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'dark' || stored === 'light') {
          setTheme(stored);
        } else {
          setTheme(systemScheme === 'dark' ? 'dark' : 'light');
        }
      } catch {
        setTheme(systemScheme === 'dark' ? 'dark' : 'light');
      }
    })();
  }, [systemScheme]);

  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const activeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: activeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
