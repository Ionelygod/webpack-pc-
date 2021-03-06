const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanCSSPlugin = require("less-plugin-clean-css");
const webpack = require('webpack');


module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/built.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.less$/,
      //   use: [{
      //     loader: "style-loader" // creates style nodes from JS strings
      //   }, {
      //     loader: "css-loader" // translates CSS into CommonJS
      //   }, {
      //     loader: "less-loader" // compiles Less to CSS
      //   }]
      // }
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'postcss-loader',{
            loader: "less-loader", options: {
              plugins: [
                new CleanCSSPlugin({ advanced: true })
              ]
            }
          }]
        })
      }
      ,
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit:8192,   //文件大小
              publicPath:'../images',    //引入图片的路径
              outputPath:'./images',    //决定图片的输出路径
              name:'[hash:5].[ext]'   //重命名
            }
          }
        ]
      },
      {
        test: /\.js$/, // 涵盖 .js 文件
        enforce: "pre", // 预先加载好 jshint loader
        exclude: /node_modules/, // 排除掉 node_modules 文件夹下的所有文件
        use: [
          {
            loader: "jshint-loader",
            options: {
              // 查询 jslint 配置项，请参考 http://www.jshint.com/docs/options/
              // 例如
              camelcase: true,
              //jslint 的错误信息在默认情况下会显示为 warning（警告）类信息
              //将 emitErrors 参数设置为 true 可使错误显示为 error（错误）类信息
              emitErrors: false,
              //jshint 默认情况下不会打断webpack编译
              //如果你想在 jshint 出现错误时，立刻停止编译
              //请设置 failOnHint 参数为true
              failOnHint: false,
              esversion: 6
              //自定义报告函数
              // reporter: function(errors) { }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      minify:{
        collapseWhitespace:true,
        removeComments:true
      }
    }),
    new ExtractTextPlugin('./css/built.css'),
    new webpack.optimize.UglifyJsPlugin()
  ],
};