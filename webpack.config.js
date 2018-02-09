/* eslint-disable */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { argv } = require('yargs');

const isProduction = process.env.NODE_ENV === 'production' || argv.production;

/**
 * Get plugins for build
 * @param isProd {Boolean} Is production build
 * @returns {[*,*]}
 */
function getPlugins(isProd) {
  const plugins = [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin(
      [
        { from: './src', ignore: ['*.js', '.*', '*.vue'] },
        { from: './src/assets', to: 'assets' },
      ],
      {},
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
      }),
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
            // {{#sass}}
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            // {{/sass}}
          },
          // other vue-loader options go here
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
