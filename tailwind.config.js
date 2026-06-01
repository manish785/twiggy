/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          DEFAULT: "#f97316",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "DM Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(15, 23, 42, 0.08), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
        "card-hover":
          "0 12px 40px -8px rgba(249, 115, 22, 0.15), 0 20px 48px -12px rgba(15, 23, 42, 0.12)",
        glow: "0 0 0 3px rgba(249, 115, 22, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%)",
        "brand-gradient": "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
        "dark-gradient":
          "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
