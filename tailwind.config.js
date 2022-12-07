module.exports = {
  content: ["./src/**/*.{html,njk}"],
  theme: {
    extend: {
      fontFamily: {
        'body': 'Minipax, serif',
        'title': '"Space Grotesk", sans-serif',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@catppuccin/tailwindcss')({
      prefix: false,
      defaultFlavour: 'latte',
    })
  ],
};
