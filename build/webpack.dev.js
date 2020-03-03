const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 测试服务器
module.exports = {
    mode: 'development',

    entry: {
        app: path.join(process.cwd(), './test/index.js')
    },

    output: {
        filename: '[name].js',
        path: path.join(process.cwd(), './test/dist')
    },

    devtool: 'inline-source-map',

    devServer: {
        contentBase: path.join(process.cwd(), './test/dist'),
        hot: true
    },

    resolve: {
        extensions: ['.js', '.vue', '.json']
    },

    module: {
        rules: [

            // 处理.vue单组件文件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            // 处理stylus预处理器
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },

            // 处理CSS文件
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },

            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },

            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'test demos',
            hash: true,
            template: './test/index.html',
            meta: {
                viewport: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            }
        }),

        new CleanWebpackPlugin(),

        new VueLoaderPlugin()
    ]
}