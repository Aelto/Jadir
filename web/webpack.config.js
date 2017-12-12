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
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },

  resolve: {
    alias: {
      Shared: path.join(__dirname, '../server/src/shared')
    }
  },

  watch: true
}
