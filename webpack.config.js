const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackEsmodulesPlugin = require('./scripts/webpack-esmodule-plugin');

function makeConfig(mode) {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  // Build plugins
  const plugins = [];

  // multiple builds in production
  if (isProduction) {
    plugins.push(new HtmlWebpackEsmodulesPlugin())
  }

  if (!isProduction) { plugins.push(new webpack.HotModuleReplacementPlugin()) }
  // Return configuration
  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'none',
    entry: {
      main: './src/index.js',
    },
    context: path.resolve(__dirname, './'),
    stats: 'normal',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      host: 'localhost',
      port: 8080,
      historyApiFallback: true,
      hot: true,
      inline: true,
      publicPath: '/',
      clientLogLevel: 'none',
      open: true,
      overlay: true,
    },
    output: {
      chunkFilename: `[name]-[contenthash]${mode === 'modern' ? '.modern.js' : '.js'}`,
      filename: isProduction ? `[name]-[contenthash]${mode === 'modern' ? '.modern.js' : '.js'}` : `[name]${mode === 'modern' ? '.mjs' : '.js'}`,
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    optimization: {
      minimizer: mode === 'modern' && isProduction ? [
        new TerserWebpackPlugin({
          test: /\.js$/,
          cache: true,
          sourceMap: true,
          parallel: 8,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: mode === 'modern' ? 8 : 5,
            },
            output: {
              ecma: mode === 'modern' ? 8 : 5,
            },
          },
        })
      ] : undefined,
      splitChunks: { chunks: 'initial' },
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, template: './index.html' }),
      ...plugins
    ],
    module: {
      rules: [
        {
          test: /\.js/,
          include: [
            path.resolve(__dirname, "src"),
          ],
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            envName: mode
          }
        },
      ],
    },
  };
};

module.exports = process.env.NODE_ENV === 'production' ?
  [makeConfig('modern'), makeConfig('legacy')] :
  makeConfig('modern');
