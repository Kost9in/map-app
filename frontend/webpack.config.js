
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: '../backend/static/',
    filename: './js/index.js'
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015',
        exclude: /(node_modules)/
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader', { publicPath: '../' })
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/main.css'),
    new HtmlPlugin({
      title: 'Map App',
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([
      {
        context: 'src/components/',
        from: '**/template.html',
        to: 'templates'
      }
    ],
    { copyUnmodified: true })
  ],
  devServer: {
    contentBase: './build/',
    port: 8080
  },
  devtool: '#inline-source-map'
};
