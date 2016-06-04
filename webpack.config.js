const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = function (example) {
  return {
    entry: {
      index: './examples/' + examples[example],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: example + '.js',
    },
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
    plugins: [new HtmlWebpackPlugin({
      inject: 'body',
      filename: example + '.html',
    })],
  };
};

module.exports.examples = examples;
