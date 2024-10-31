import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // extend: {
    //   keyframes: {
    //     floating: {
    //       "0%": { transform: "translate(0, 0)" },
    //       "50%": { transform: "translate(-10px, -10px)" },
    //       "100%": { transform: "translate(0, 0)" },
    //     },
    //   },
    //   animation: {
    //     floating: "floating 6s ease-in-out infinite",
    //   },
    // },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0E1A32",
          secondary: "#102343",
          accent: "#0040A1",
          neutral: "#0063F9",
          "base-100": "#ffffff",
        },
      },
    ],
  },
});

export default config;
