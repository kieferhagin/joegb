// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    target: 'node',
    context: path.resolve(__dirname + '/src'),
    entry: {
        app: ['webpack/hot/dev-server', './index.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.bundle.js',
        publicPath: 'http://localhost:8080/build/'
    },
    devServer: {
        contentBase: './public',
        publicPath: 'http://localhost:8080/build/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react-app']
                }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
        //new CopyWebpackPlugin([
        //    {
        //        from: path.resolve(__dirname + '/src') + '/Tetris.gb',
        //        to: path.resolve(__dirname + '/build')
        //    }
        //])
    ]
};

module.exports = config;