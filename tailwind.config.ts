import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4f8",
          100: "#ffe7f0",
          500: "#d94685",
          700: "#a0255f",
          900: "#571735"
        }
      }
    }
  },
  plugins: []
};

export default config;
