const path = require('path');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src', 'index.js'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  mode: 'development',
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
