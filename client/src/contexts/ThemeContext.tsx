import { createContext, useContext, useEffect, useState } from "react";

type ThemePrefs = { light: string; dark: string };
type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  prefs: ThemePrefs;
  setMode: (mode: ThemeMode) => void;
  setPrefs: (prefs: ThemePrefs) => void;
}

const defaultPrefs: ThemePrefs = { light: "emerald", dark: "forest" };

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  prefs: defaultPrefs,
  setMode: () => {},
  setPrefs: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem("theme-mode") as ThemeMode) || "dark"
  );
  const [prefs, setPrefs] = useState<ThemePrefs>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("theme-prefs") || ""
      ) as ThemePrefs;
    } catch {
      return defaultPrefs;
    }
  });

  // Apply theme on change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", prefs[mode]);
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-prefs", JSON.stringify(prefs));
  }, [mode, prefs]);

  return (
    <ThemeContext.Provider value={{ mode, prefs, setMode, setPrefs }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
