import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const DataContext = createContext();

const THEME_KEY = "blogsphere-theme";
const USER_NAME_KEY = "user_name";

const DataProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [userName, setUserNameState] = useState(() => localStorage.getItem(USER_NAME_KEY) || "");
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  const setUserName = (name) => {
    const v = name && String(name).trim() ? String(name).trim() : "";
    if (v) {
      localStorage.setItem(USER_NAME_KEY, v);
    } else {
      localStorage.removeItem(USER_NAME_KEY);
    }
    setUserNameState(v);
  };

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
      setUserNameState(localStorage.getItem(USER_NAME_KEY) || "");
    };

    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  /** Backfill display name for sessions that have a token but no stored name */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const uid = localStorage.getItem("user_id");
    const existing = localStorage.getItem(USER_NAME_KEY);
    if (!token || !uid || existing) return;

    const id = typeof uid === "string" ? uid : uid?.toString?.();
    if (!id || id === "undefined") return;

    let cancelled = false;
    (async () => {
      try {
        const res = await axios({
          url: `http://localhost:3005/getsingleuser/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data?.data;
        const name = u?.name;
        if (!cancelled && name) {
          localStorage.setItem(USER_NAME_KEY, name);
          setUserNameState(name);
        }
      } catch {
        /* ignore — user may lack permission or network error */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

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
    localStorage.removeItem(USER_NAME_KEY);
    setIsLoggedIn(false);
    setUserNameState("");
  };

  const value = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, userName, setUserName, logout, theme, setTheme, toggleTheme }),
    [isLoggedIn, userName, theme]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
