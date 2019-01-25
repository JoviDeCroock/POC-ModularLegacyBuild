const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const legacyBrowsersList = ['last 2 versions', 'ie >= 11', 'safari >= 7'];

const modernBrowsersList = [
  'last 2 Chrome versions',
  'not Chrome < 60',
  'last 2 Safari versions',
  'not Safari < 10.1',
  'last 2 iOS versions',
  'not iOS < 10.3',
  'last 2 Firefox versions',
  'not Firefox < 54',
  'last 2 Edge versions',
  'not Edge < 15',
];

const modernTargets = { esmodules: true };
const legacyTargets = { targets: legacyBrowsersList };

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
            babelrc: false,
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  useBuiltIns: mode === 'modern' ? 'usage' : 'entry',
                  targets: mode === 'modern' ? modernBrowsersList : legacyBrowsersList,
                }
              ],
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-export-default-from"
            ],
          }
        },
      ],
    },
  };
};

module.exports = process.env.NODE_ENV === 'production' ?
  [makeConfig('modern'), makeConfig('legacy')] :
  makeConfig('modern');
