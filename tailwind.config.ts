import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f4c81",
          dark: "#0a3558",
          light: "#eaf3fb"
        }
      }
    }
  },
  plugins: []
};

export default config;
