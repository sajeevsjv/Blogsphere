import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="bg-mesh-light dark:bg-mesh-dark min-h-[calc(100vh-4rem)] dark:min-h-0">
          <section className="border-b border-violet-200/40 bg-white/60 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-700 shadow-sm dark:border-fuchsia-500/30 dark:bg-slate-900/80 dark:text-fuchsia-200">
                <SparklesIcon className="h-4 w-4" />
                No cap — just good posts
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Write loud.{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-300">
                  Read real.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                A clean editor, threaded comments, likes, and themes that don&apos;t hurt your eyes at 2am. Post your story — the feed is waiting.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/blogs")}
                  className="inline-flex items-center gap-2 rounded-full bg-btn-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-btn-primary-hover hover:shadow-fuchsia-500/25"
                >
                  Hit the feed
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/addblog")}
                  className="rounded-full border-2 border-violet-300/80 bg-white/90 px-6 py-3 text-sm font-bold text-violet-800 transition hover:border-fuchsia-400 hover:bg-fuchsia-50/80 dark:border-slate-600 dark:bg-slate-900/80 dark:text-fuchsia-200 dark:hover:border-fuchsia-500/50 dark:hover:bg-slate-800"
                >
                  Drop a post
                </button>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-fuchsia-300">Why it slaps</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Editor that keeps up",
                  body: "Headings, lists, embeds, code blocks — format it like you mean it.",
                },
                {
                  title: "Comments with depth",
                  body: "Replies and likes so convos stay under the post, not in the group chat.",
                },
                {
                  title: "Themes that get it",
                  body: "Light for daytime scrolls, dark for late-night reads. Toggle anytime.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-violet-100/80 bg-white/90 p-7 shadow-card ring-1 ring-violet-500/5 transition hover:-translate-y-1 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-card-dark dark:ring-fuchsia-500/10 dark:hover:shadow-glow-dark"
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-black text-white shadow-md"
                    aria-hidden
                  >
                    ✦
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-violet-100 bg-white/70 py-16 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your next post starts here</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-600 dark:text-slate-400">
                Sign in, open the composer, publish when it feels right.
              </p>
              <button
                type="button"
                onClick={() => navigate("/addblog")}
                className="mt-8 rounded-full bg-btn-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-btn-primary-hover"
              >
                Open composer
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
