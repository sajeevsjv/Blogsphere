import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { DataContext } from "../components/DataProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, toggleTheme, theme } = useContext(DataContext);

  const navLink =
    "text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-white";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <Link to="/" className="shrink-0 text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            <span className="text-brand-800 dark:text-brand-300">Blog</span>Sphere
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/blogs" className={navLink}>
              Articles
            </Link>
            <Link to="/addblog" className={navLink}>
              Compose
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          {isLoggedIn ? (
            <>
              <Link
                to="/addblog"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                New post
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                Sign in
              </Link>
              <Link to="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5 text-slate-200" /> : <MoonIcon className="h-5 w-5 text-slate-700" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-700 dark:text-slate-200"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-2 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <Link to="/blogs" className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => setIsOpen(false)}>
            Articles
          </Link>
          <Link to="/addblog" className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => setIsOpen(false)}>
            Compose
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => setIsOpen(false)}>
                Sign in
              </Link>
              <Link to="/signup" className="block rounded-lg px-4 py-3 text-sm font-semibold text-brand-700 dark:text-brand-400" onClick={() => setIsOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
