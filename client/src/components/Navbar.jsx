import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { DataContext } from "../components/DataProvider";
import UserAvatar from "../components/UserAvatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userName, logout, toggleTheme, theme } = useContext(DataContext);

  const navLink =
    "rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-violet-500/10 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-fuchsia-500/10 dark:hover:text-fuchsia-200";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-violet-200/40 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <Link to="/" className="shrink-0 text-base font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400">
              Blog
            </span>
            <span className="text-slate-900 dark:text-white">Sphere</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/blogs" className={navLink}>
              Feed
            </Link>
            <Link to="/addblog" className={navLink}>
              New drop
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/60 bg-white/80 text-violet-700 shadow-sm transition hover:scale-105 hover:border-fuchsia-300 hover:shadow-glow dark:border-slate-700 dark:bg-slate-900 dark:text-amber-200 dark:hover:border-amber-500/40 dark:hover:shadow-glow-dark"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          {isLoggedIn ? (
            <>
              <div className="mr-1 flex max-w-[200px] items-center gap-2 rounded-full border border-violet-100 bg-violet-50/80 py-1 pl-1 pr-3 dark:border-slate-700 dark:bg-slate-900/80">
                <UserAvatar name={userName} size="md" />
                <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100" title={userName || undefined}>
                  {userName || "Signed in"}
                </span>
              </div>
              <Link
                to="/addblog"
                className="rounded-full bg-btn-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-btn-primary-hover hover:shadow-lg hover:shadow-fuchsia-500/20"
              >
                Post something
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Peace out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-500/10 hover:text-violet-800 dark:text-slate-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-btn-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-btn-primary-hover"
              >
                Join the vibe
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/60 dark:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5 text-amber-200" /> : <MoonIcon className="h-5 w-5 text-violet-700" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 text-slate-700 dark:text-slate-200"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-violet-100 bg-white/95 px-2 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          <Link
            to="/blogs"
            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-violet-50 dark:text-slate-100 dark:hover:bg-slate-900"
            onClick={() => setIsOpen(false)}
          >
            Feed
          </Link>
          <Link
            to="/addblog"
            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-violet-50 dark:text-slate-100 dark:hover:bg-slate-900"
            onClick={() => setIsOpen(false)}
          >
            New drop
          </Link>
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
                <UserAvatar name={userName} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{userName || "Signed in"}</p>
                  <p className="text-xs text-violet-600 dark:text-fuchsia-300">You&apos;re in</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Peace out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block rounded-2xl px-4 py-3 text-sm font-bold text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text dark:from-violet-400 dark:to-fuchsia-400"
                onClick={() => setIsOpen(false)}
              >
                Join the vibe
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
