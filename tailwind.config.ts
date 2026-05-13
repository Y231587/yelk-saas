import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yelk Finance brand colors — blauw
        yelk: {
          50:  "#f3f7ff",
          100: "#eaeeff",
          200: "#dbe7ff",
          300: "#b8caff",
          400: "#8ea4ff",
          500: "#5d87ff",
          600: "#4f6dff",
          700: "#1a39ff",
          800: "#0a1f9c",
          900: "#071436",
          950: "#0b1736",
        },
        slate: {
          850: "#1a2332",
          950: "#0d1117",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "yelk-gradient": "linear-gradient(135deg, #0a1f9c 0%, #1a39ff 58%, #4f6dff 100%)",
        "dark-gradient": "linear-gradient(180deg, #0b1736 0%, #071436 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
