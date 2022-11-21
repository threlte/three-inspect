/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        'default-gray': '#28292e',
      }
    },
    fontFamily: {
      'mono': ['var(--tp-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace)'],
    }
  },
  plugins: [],
}
