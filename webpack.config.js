const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      stats: 'errors-only',
      open: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      { 
        test: /\.(jpe?g|gif|png|svg|woff|ttf)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      { 
        test: /\.(wav|mp3)$/,
        loader: 'file-loader?name=sounds/[name].[ext]'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Whack a Piggy',
      template: './src/index.html'
    })
  ]
};
