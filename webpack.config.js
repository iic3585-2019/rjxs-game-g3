const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  entry: {
    app: path.resolve(__dirname, 'src', 'index.js'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://localhost:8080/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'src', 'static'),
    port: 8080,
    headers: { 'Access-Control-Allow-Origin': 'http://localhost:8080' },
  },
  watch: true,
};
