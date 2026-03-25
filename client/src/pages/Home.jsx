import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <section className="border-b border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="text-sm font-medium uppercase tracking-wider text-brand-700 dark:text-brand-400">Publishing platform</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Clear writing. Thoughtful readers.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Publish long-form articles with a full editor, engage with comments, and keep your work readable in light or dark mode.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                Browse articles
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/addblog")}
                className="rounded-lg border border-brand-200 bg-white px-5 py-2.5 text-sm font-medium text-brand-800 transition hover:bg-brand-50 dark:border-brand-800 dark:bg-slate-900 dark:text-brand-200 dark:hover:bg-slate-800"
              >
                Compose
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Capabilities</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Rich editing",
                body: "Headings, lists, links, inline images, and code blocks—standard tools for serious posts.",
              },
              {
                title: "Discussion",
                body: "Likes and threaded replies help readers respond without cluttering the article.",
              },
              {
                title: "Appearance",
                body: "Light and dark themes reduce eye strain and suit any reading environment.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark"
              >
                <div className="mb-4 h-px w-10 bg-brand-600/90 dark:bg-brand-500" aria-hidden />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Start your next article</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Sign in, open the composer, and publish when you are ready.
            </p>
            <button
              type="button"
              onClick={() => navigate("/addblog")}
              className="mt-8 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Open composer
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
