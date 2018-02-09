/* eslint-disable */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { argv } = require('yargs');

const isProduction = process.env.NODE_ENV === 'production' || argv.production;

function getPlugins(isProd) {
  const plugins = [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin(
      [
        { from: './src', ignore: ['*.js', '.*', '*.vue'] },
        { from: './src/assets', to: 'assets' },
      ],
      {}
    ),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProd),
      'process.env': {
        NODE_ENV: isProd ? '"production"' : '"development"',
      },
    }),
    new HardSourceWebpackPlugin(),
  ];
  if (isProd) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.DllPlugin({
        context: __dirname,
        name: '[name]_[hash]',
        path: path.join(__dirname, 'manifest.json'),
      })
    );
  }
  return plugins;
}

const config = {
  entry: {
    background: './src/background.js',
    index: './src/ui/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      { test: /\.html$/, loader: 'html-loader', query: { minimize: true } },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      snapsvg: 'snapsvg/dist/snap.svg.js',
    },
  },
  plugins: getPlugins(isProduction),
  performance: {
    hints: false,
  },
};

module.exports = config;
