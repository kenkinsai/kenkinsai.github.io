const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const extractHNM = new ExtractTextPlugin({ filename: 'static/css/[name].[hash].css' })
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;

const PurifyCSSPlugin = require('purifycss-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const glob = require('glob-all')

var mode = 'production'//process.env.NODE_ENV || 'development';

module.exports = {
  devtool: (mode === 'development') ? 'inline-source-map' : false,
  entry: {
    main: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[hash].js',
    chunkFilename: 'static/js/[name].[chunkHash].chunk.js',
    publicPath: '/'
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          compact: true,
          cacheDirectory: true,
        }
      },
      {
        test:/\.css$/,
        include:[path.resolve(__dirname, './src/themes'), path.resolve(__dirname, './src/components/shares')],
        use: extractHNM.extract({
          fallback: 'style-loader',
          use: [ { 
            loader: 'css-loader', 
            options: { 
              importLoaders: 1, 
              sourceMap: false
            } 
          }]
        })
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ] // rules
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),   
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
    extractHNM,
    new HtmlWebpackPlugin(),
    new CriticalPlugin({
      src: 'index.html',
      inline: true,
      minify: true,
      dest: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};