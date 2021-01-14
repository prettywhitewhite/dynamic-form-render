const path = require('path')
const TerserPlugin = require('terser-webpack-plugin-legacy')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const elementExternals = require('./elementUIDependencies')
const components = require('./components')
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
Object.keys(components).forEach(function(key) {
  if (key === 'app') {
    return
  }
  const sourcePath = components[key]
    .replace('index.vue', '')
    .replace('index.js', '')
    .replace('.vue', '')
    .replace('.js', '')
  externals[sourcePath] = `dynamic-form-render/dist/lib/${key}`
})
module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.entryPoints.delete('app')
    config
      .plugin('extract-css')
      .tap(options => {
        options[0] = {
          filename: 'css/index.css',
          chunkFilename: 'css/index.css',
        }
        return options
      })
      .end()
  },
  configureWebpack: {
    entry: components,
    output: {
      path: path.join(__dirname, 'dist'), //this one sets the path to serve
      filename: 'lib/[name].js',
      library: 'dynamicFormRender',
      libraryTarget: 'commonjs2',
    },
    optimization: {
      minimize: true,
      splitChunks: false,
    },
    resolve: {
      alias: require('./alias.config.js').webpack,
    },
    plugins: [
      new TerserPlugin({
        terserOptions: {compress: {drop_console: true}},
      }),
      new BundleAnalyzerPlugin(),
    ],
    externals: externals,
  },
}
