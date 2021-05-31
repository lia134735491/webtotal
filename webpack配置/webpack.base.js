const path = require("path");
// html-webpack-plugin -D
const HtmlWebpackPlugin = require("html-webpack-plugin");
// clean-webpack-pluginss -D
const CleanWebpackPlugin = require("clean-webapck-plugin");
// 分离css代码
let miniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩js
const TerserPlugin = require('terser-webpack-plugin');
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require(optimize-css-assets-webpack-plugin)
module.exports = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer :{
        contentBase: './dist',
        // 模块热更新
        hot: true,
        proxy: {
            'yixiantong': {
               target: 'https://www.bilibili.com/' ,
               changeOringin: true,
               pathRewrite: {
                   '^/api': ''
               }
            }
        }
    },
    optimization: {
        minimizer: [
            // 压缩js
            new TerserPlugin(),
            // 压缩css
            new OptimizeCssAssetsWebpackPlugin()
        ],
        splitChunks: {
            // all  对同步、异步代码都做代码分割
            // async 只对异步代码做代码分割
            // initial 只对同步代码做代码分割
            // 同步代码 例如 import lodash from 'lodash'
            // 异步代码 例如 import('lodash')
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    // 每个组的名字
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    // 优先级
                    priority: -10,
                    // 大于5*1024才进行分割
                    minSize: 5*1024,
                    // 引入多少次才打包
                    minChunks: 2,
                },
                common: {
                    // 每个组的名字
                    name: 'common',
                    // 优先级
                    priority: -10,
                    // 大于5*1024才进行分割
                    minSize: 5*1024,
                    // 引入多少次才打包
                    minChunks: 2,
                },
            }
        }
    },
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /.jpg$/,
                use: 'file-loader',
                options: {
                    // name表示图片的名字，ext代表后缀名
                    name: '[name]-[hash].[ext]',
                    // 图片打包会主动创建该文件，并将打包图片保存在该文件夹下
                    outputPath: 'images/'
                }
            },
            // 使用url-loader生成base64位的图片，减少http请求，需要设置limit
            {
                test: /.jpg$/,
                use: 'url-loader',
                options: {
                    // name表示图片的名字，ext代表后缀名
                    name: '[name]-[hash].[ext]',
                    // 图片打包会主动创建该文件，并将打包图片保存在该文件夹下
                    outputPath: 'images/',
                    // 小于5*1024的图片，打包成base64的编码
                    limit: 5*1024,
                }
            },
            // 处理字体图标
            {
                test: '/.(eot|svg|ttf|woff)/',
                use: 'file-loader',
                options: {
                    outputPath: 'iconfonts/',
                }
            },
            {
                test: '/.css$/',
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: '/.scss$/',
                use: [
                    'style-loader',
                    // 分离css代码
                    miniCssExtractPlugin.loader,
                    // 启动css-loader的模块化功能，使其不影响没有引入的文件，该方法不好描述，以后百度
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    // postcss、postcss-loader -D自动给css添加前缀，在package.json文件中添加browserslist字段和配置,并且创建postcss.config.js文件
                    // "browserslist": [
                    //     "> 1%",
                    //     "last 2 version"
                    // ],
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            // babel-loader @babel/core @babel/preset-env -D es6转es5
            // @babel/polyfill
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env'],
                            {
                                useBuiltIns: 'usage'
                            }
                        ]
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: 'other.html',
            // 需要引入的入口文件
            chunks: ['index'],
            // html压缩
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        }),
        // 每次打包之前都会先清空上一次打包的文件
        new CleanWebpackPlugin(),
        // 分离的代码生成在那个目录下
        new miniCssExtractPlugin({
            filename: 'css/main.[contentHash:8].css'
        })
    ]
}