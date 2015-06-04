var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel?stage=0'}
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};
