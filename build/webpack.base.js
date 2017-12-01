const path = require('path')
const config = require('./config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoaders = require('./css-loader.js')
const dev = process.env.NODE_ENV === 'dev'

let root = path.resolve(__dirname)

let webpackBase = {
  devtool: dev ? 'source-map' : false,
  entry: config.entry,
  output: {
    path: config.assets_path,
    publicPath: config.assets_public_path,
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: root,
        enforce: 'pre',
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'resolve-url-loader']
        })
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: [...cssLoaders, 'sass-loader']
        })
      },
      {
        test: /\.(woff2?|woff|eot|ttf|otf|mp3|wav)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts/'
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[ext]',
              outputPath: './img/'
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev
            }
          }
        ]
      }
    ]
  },
  watch: dev,
  plugins: [
    new CleanWebpackPlugin(['html/assets'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'assets/fonts/',
        to: 'fonts/'
      },
      {
        from: 'assets/icons/',
        to: 'icons/'
      },
      {
        from: 'assets/img/bg-sample/',
        to: 'img/bg-sample/'
      },
      {
        from: 'assets/img/favicons/',
        to: 'img/favicons/'
      },
      {
        from: 'assets/img/sample/',
        to: 'img/sample/'
      }
    ])
  ]
}

module.exports = webpackBase