import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        slate: "#6B7280",
        bg: "#0A0F1C",
        "medical-blue": "#0F5FFF",
        teal: "#0DB7A8",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1000px 600px at 10% 10%, rgba(15,95,255,0.25), transparent 60%), radial-gradient(800px 400px at 90% 30%, rgba(13,183,168,0.15), transparent 60%)",
        grid: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(15,95,255,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;


