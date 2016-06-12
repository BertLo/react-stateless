const _ = require('lodash');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const examples = {
  'oneGif': 'oneGif.cjsx',
  'catGifList': 'catGifList.cjsx',
  'customGifList': 'customGifList.cjsx',
  'oneCounter': 'oneCounter.jsx',
  'twoCounters': 'twoCounters.jsx',
  'counterList': 'counterList.jsx',
  'inputList': 'inputList.jsx',
  'reduxRoot': 'reduxRoot.cjsx',
};

const base = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /(.\js|\.jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
      },
    }, {
      test: /(\.cjsx)$/,
      exclude: /node_modules/,
      loader: 'coffee!cjsx',
    }],
  },
};


module.exports.buildExamples = function (example) {
  return _.extend({}, base, {
    entry: {
      index: './examples/' + examples[example],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: example + '.js',
    },
    plugins: [new HtmlWebpackPlugin({
      inject: 'body',
      filename: example + '.html',
    })],
  });
};

module.exports.examples = examples;

module.exports = _.extend({}, base, {
  entry: {
    index: './src/index.jsx',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
  },
  externals: [
    'react',
  ],
});
