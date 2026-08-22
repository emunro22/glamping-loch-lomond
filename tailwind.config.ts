import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep loch-at-dusk pine — hero, footer, admin chrome
        loch: {
          950: "#0B1A17",
          900: "#0F211E",
          800: "#173029",
          700: "#20423A",
          600: "#2E5A4D",
          500: "#3F7565",
        },
        // Warm oat base — the "cosy indoors" surface
        oat: {
          50: "#F5F3EC",
          100: "#EEEBE1",
          200: "#E3DFD2",
          300: "#D2CCBA",
          400: "#B4AC96",
        },
        // Lamplight through a pod window at dusk
        lamp: {
          400: "#E8BC6B",
          500: "#D9A441",
          600: "#B9862F",
        },
        // Pod identities — the two flowers the pods are named after
        rose: {
          300: "#D9A7AE",
          500: "#B87C86",
          700: "#8E5A63",
        },
        thistle: {
          300: "#B3A6C8",
          500: "#8B7BA6",
          700: "#655780",
        },
        bracken: "#6C7A56",
        // Availability indicator — kept muted so it reads as a status dot, not an alert
        ok: "#4E7A52",
        full: "#B15A45",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.72rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      borderRadius: {
        pod: "1.75rem 1.75rem 0.5rem 0.5rem",
      },
      boxShadow: {
        lift: "0 24px 60px -32px rgba(11, 26, 23, 0.55)",
        glow: "0 0 80px -10px rgba(217, 164, 65, 0.35)",
      },
      backgroundImage: {
        dusk: "linear-gradient(180deg, #0B1A17 0%, #123029 45%, #1E4438 100%)",
      },
      keyframes: {
        emberDrift: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "15%": { opacity: "0.7" },
          "100%": { transform: "translateY(-120px) scale(0.4)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        ember: "emberDrift 9s linear infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
