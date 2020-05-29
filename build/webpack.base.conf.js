'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          }
        }],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  externals: {
    qcVideo: 'qcVideo',
    TCPlayer: 'TCPlayer',
    NoCaptcha: 'NoCaptcha',
    // AliyunUpload: 'AliyunUpload',
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
}


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style', {
    name: 'after-less-parser',
    fn: function (source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 自定义的全局样式大部分不需要转换
      if (this.resourcePath.replace(/\\/g, '/').indexOf('App.vue') > -1) {
        source = source.replace(/px/g, 'PX').replace(/-1PX/g, '-1px')
      }
      return source
    }
  }, {
    name: 'style-parser',
    fn: function (source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 避免转换1PX.less文件路径
      if (source.indexOf('1PX.less') > -1) {
        source = source.replace(/1PX.less/g, '1px.less')
      }
      return source
    }
  }]
})
