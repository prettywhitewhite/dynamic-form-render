const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin-legacy')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const elementExternals = require('./elementUIDependencies')

const exampleConfig = {
  devtool: 'eval-source-map',
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'async',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
  ],
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
const externals = {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
  },
  lodash: {
    root: '_',
    commonjs: 'lodash',
    commonjs2: 'lodash',
    amd: 'lodash',
  },
  axios: 'axios',
  elementThemeChalk: 'element-theme-chalk',
}
elementExternals.components.forEach(function(key) {
  externals[`element-ui/lib/${key}`] = `element-ui/lib/${key}`
})
const libConfig = {
  optimization: {
    minimize: true,
    splitChunks: {
      hidePathInfo: true,
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    },
  },
  plugins: [
    new TerserPlugin({
      terserOptions: {compress: {drop_console: true}},
    }),
    new BundleAnalyzerPlugin(),
  ],
  externals: externals,
}
module.exports = {
  pages: {
    index: {
      entry: 'example/index.js',
      template: 'example/index.html',
    },
  },
  configureWebpack: () => {
    const defaultConfig = {
      resolve: {
        alias: require('./alias.config.js').webpack,
      },
    }
    if (process.env.NODE_ENV === 'production') {
      return Object.assign(defaultConfig, libConfig)
    } else {
      return Object.assign(defaultConfig, exampleConfig)
    }
  },
}
