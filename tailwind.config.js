/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}", "index.html", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        'pattern': "url('/pattern.svg')",
      }
    },
  },
  plugins: [
    import('flowbite/plugin')
  ],
}

