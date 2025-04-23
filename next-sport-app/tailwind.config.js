/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        color: {
          gray: "#d9d9d9",
          darkGray: "#464646",
          white: "#fff",
          blue: "#2185D0",
          green: "#2CA67C",
          black: "#000",
        },
      },
    },
  },
  plugins: [],
};
