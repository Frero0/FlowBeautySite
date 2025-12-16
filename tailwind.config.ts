import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        nude: {
          50: "#FCF8F4",
          100: "#F6F0EB",
          200: "#E7D6C8",
          300: "#D5BBA7",
          800: "#6E625A"
        },
        ink: "#1D1B1A",
        accent: "#B89B7A"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        card: "0 12px 40px rgba(0,0,0,0.06)",
        soft: "0 8px 24px rgba(0,0,0,0.04)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 20% 20%, rgba(232,214,200,0.35), transparent 35%), radial-gradient(circle at 80% 0%, rgba(184,155,122,0.25), transparent 30%), linear-gradient(180deg, #FCF8F4 0%, #F6F0EB 100%)"
      }
    }
  },
  plugins: []
};

export default config;
