/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        surfaceDark: "#111111",
        accentPink: "#FF2D55",
        accentPinkLight: "#FFE4E6",
        accentGreen: "#22C55E",
        neutral900: "#111111",
        neutral800: "#1F2937",
        neutral700: "#374151",
        neutral600: "#4B5563",
        neutral500: "#6B7280",
        neutral400: "#9CA3AF",
        neutral300: "#D1D5DB",
        neutral200: "#E5E7EB",
        neutral100: "#F3F4F6",
        neutral50:  "#F9FAFB",
      },
      borderRadius: {
        pill: "9999px",
        dock: "32px",
        card: "22px",
        service: "16px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0, 0, 0, 0.06)",
        dock: "0 10px 30px rgba(0, 0, 0, 0.35)",
        pinkGlow: "0 4px 14px rgba(255, 45, 85, 0.4)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
