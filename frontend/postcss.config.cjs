module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')({
      overrideBrowserslist: ['> 0.2%', 'not dead']
    })
  ]
}
