/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-light":
          "radial-gradient(at 40% 20%, rgb(196 181 253 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(165 243 252 / 0.4) 0px, transparent 45%), radial-gradient(at 0% 50%, rgb(251 207 232 / 0.35) 0px, transparent 50%)",
        "mesh-dark":
          "radial-gradient(at 40% 20%, rgb(76 29 149 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(14 116 144 / 0.25) 0px, transparent 45%), radial-gradient(at 0% 50%, rgb(157 23 77 / 0.2) 0px, transparent 50%)",
        "btn-primary": "linear-gradient(135deg, #6366f1 0%, #a855f7 45%, #ec4899 100%)",
        "btn-primary-hover": "linear-gradient(135deg, #4f46e5 0%, #9333ea 45%, #db2777 100%)",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
        "card-dark": "0 4px 6px -1px rgb(0 0 0 / 0.35), 0 2px 4px -2px rgb(0 0 0 / 0.25)",
        glow: "0 0 40px -10px rgb(99 102 241 / 0.45)",
        "glow-dark": "0 0 48px -12px rgb(167 139 250 / 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};
