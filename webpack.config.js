const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const modules = require('webpack-modules');
const HtmlWebpackEsmodulesPlugin = require('webpack-module-nomodule-plugin');
const ModernResolutionPlugin = require('./scripts/webpack-modern-resolution-plugin');
const babelConfig = require('./.babelrc');

const env = babelConfig.env;

function makeConfig(mode) {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  // Build plugins
  const plugins = [new modules()];

  // multiple builds in production
  if (isProduction) {
    plugins.push(new HtmlWebpackEsmodulesPlugin({ mode }))
  }

  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  // Return configuration
  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'none',
    entry: {
      main: './src/index.js',
    },
    context: path.resolve(__dirname, './'),
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
      filename: isProduction ? `[name]-[contenthash]${mode === 'modern' ? '.modern.js' : '.js'}` : `[name]${mode === 'modern' ? '.modern.js' : '.js'}`,
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    optimization: {
      splitChunks: { chunks: 'initial' },
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, template: './index.html' }),
      ...plugins
    ],
    module: {
      rules: [
        {
          // Support preact.
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.js/,
          include: [
            path.resolve(__dirname, "src"),
          ],
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            ...env[mode],
          }
        },
      ],
    },
    resolve: {
      mainFields: ['module', 'main', 'browser'],
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        // "hooked-form": mode === 'modern' ? "hooked-form/dist/hooked-form.modern.js" : "hooked-form",
      },
      plugins: mode === 'modern' ? [new ModernResolutionPlugin()] : undefined,
    },
  };
};

module.exports = process.env.NODE_ENV === 'production' ?
  [makeConfig('modern'), makeConfig('legacy')] :
  makeConfig('legacy');
