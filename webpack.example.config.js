const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  configureWebpack: {
    entry: path.join(__dirname, 'example/index.js'),
    devtool: 'eval-source-map',
    resolve: {
      alias: require('./alias.config.js').webpack,
    },
    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'async',
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'example/index.html'),
      }),
      new webpack.ProvidePlugin({
        _: 'lodash',
      }),
    ],
  },
  devServer: {
    disableHostCheck: true,
    overlay: false,
    host: '0.0.0.0',
    port: '80',
    hot: true,
    compress: true,
    open: false,
  },
}
