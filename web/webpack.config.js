const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  target: 'electron',
  output: {
    path: path.join(__dirname, `../app/`),
    filename: `bundle.app.js`
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [`node-modules`],
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },

  watch: true
}
