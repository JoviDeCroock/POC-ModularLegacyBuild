const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function makeConfig(mode) {
  const { NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';

  // Build plugins
  const plugins = [];
  plugins.push(new HtmlWebpackPlugin({ template: './index.html' }))
  if (!isProduction) { plugins.push(new webpack.HotModuleReplacementPlugin()) }

  // Return configuration
  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'source-map',
    entry: {
      main: './src/index.js'
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
      chunkFilename: `[name]-[contenthash]${mode === 'modern' ? '.mjs' : '.js'}`,
      filename: isProduction ? `[name]-[contenthash]${mode === 'modern' ? '.mjs' : '.js'}` : `[name]-[hash]${mode === 'modern' ? '.mjs' : '.js'}`,
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
    },
    optimization: {
      concatenateModules: false,
      splitChunks: { chunks: 'all' },
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.js/,
          include: [
            path.resolve(__dirname, "src"),
            // path.resolve(__dirname, "node_modules/<some_lib>")
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
