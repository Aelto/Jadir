const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, `/dist/`),
    filename: `bundle.server.js`
  },
  target: 'node',

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [path.resolve(__dirname, 'node_modules')]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  watch: true
}
