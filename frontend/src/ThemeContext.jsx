import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// Apply dark class immediately (before React renders) to avoid flash
function getInitialDark() {
  const saved = localStorage.getItem("theme");
  const isDark = saved ? saved === "dark" : true; // default: dark
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return isDark;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    // Keep <html> class and localStorage in sync whenever dark changes
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
