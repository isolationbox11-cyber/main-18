module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
      "*.{js,ts,jsx,tsx,mdx}"
],
  theme: {
    extend: {
      colors: {
        primary: '#0e6fff',
        halloween: {
          eyes: '#0e6fff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
