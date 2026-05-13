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
        // Yelk Finance brand colors
        yelk: {
          50:  "#f0f9f4",
          100: "#dcf1e6",
          200: "#bbe3cf",
          300: "#8bcdb0",
          400: "#56b08d",
          500: "#2d9970",  // primary green
          600: "#1e7a58",
          700: "#196247",
          800: "#164f3a",
          900: "#134130",
          950: "#0a2620",
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
        "yelk-gradient": "linear-gradient(135deg, #2d9970 0%, #196247 100%)",
        "dark-gradient": "linear-gradient(180deg, #0d1117 0%, #0a2620 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
