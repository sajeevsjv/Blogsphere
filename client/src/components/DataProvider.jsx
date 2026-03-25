import { createContext, useEffect, useMemo, useState } from "react";

export const DataContext = createContext();

const THEME_KEY = "blogsphere-theme";

const DataProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const setTheme = (next) => {
    setThemeState(next === "dark" ? "dark" : "light");
  };

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_type");
    setIsLoggedIn(false);
  };

  const value = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, logout, theme, setTheme, toggleTheme }),
    [isLoggedIn, theme]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;