const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const modules = require('webpack-modules');
const TerserPlugin = require('terser-webpack-plugin');
// const HtmlWebpackEsmodulesPlugin = require('webpack-module-nomodule-plugin');
// const ModernResolutionPlugin = require('webpack-syntax-resolver-plugin');
const ModernResolutionPlugin = require('./scripts/webpack-modern-resolution-plugin');
const HtmlWebpackEsmodulesPlugin = require('./scripts/webpack-module-nomodule-plugin');
const babelConfig = require('./.babelrc');

const env = babelConfig.env;

const modernTerser = new TerserPlugin({
  cache: true,
  parallel: true,
  sourceMap: true,
  terserOptions: {
    ecma: 8,
    safari10: true
  }
});

function makeConfig(mode) {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  // Build plugins
  const plugins = [new modules()];

  // multiple builds in production
  if (isProduction) {
    plugins.push(new HtmlWebpackEsmodulesPlugin(mode))
  }

  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  // Return configuration
  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'none',
    entry: mode === 'legacy' ? {
      fetch: 'whatwg-fetch',
      main: './src/index.js',
    } : {
      main: './src/index.js'
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
    stats: 'none',
    output: {
      chunkFilename: `[name]-[contenthash]${mode === 'modern' ? '.modern.js' : '.js'}`,
      filename: isProduction ? `[name]-[contenthash]${mode === 'modern' ? '.modern.js' : '.js'}` : `[name]${mode === 'modern' ? '.modern.js' : '.js'}`,
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    optimization: {
      splitChunks: { chunks: 'initial' },
      minimizer: mode === 'legacy' ? undefined : [modernTerser],
    },
    plugins: [
      new HtmlWebpackPlugin({ inject: true, template: './index.html' }),
      ...plugins
    ].filter(Boolean),
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
        "preact": path.resolve(__dirname, 'node_modules', 'preact'),
      },
      plugins: mode === 'modern' ? [new ModernResolutionPlugin()] : undefined,
    },
  };
};

module.exports = process.env.NODE_ENV === 'production' ?
  [makeConfig('modern'), makeConfig('legacy')] :
  makeConfig('legacy');
