const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Components = require('../components');


// 三个组件单独打包的
module.exports = {
    mode: 'production',

    entry: Components,

    output: {
        filename: '[name].js',
        chunkFilename: '[id].js',
        path: path.join(process.cwd(), './lib'),
        publicPath: '/dist/',
        libraryTarget: 'commonjs2'
    },

    externals: {
        vue: "vue"
    },

    resolve: {
        extensions: ['.js', '.vue', '.json']
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },

    module: {
        rules: [

            // 处理.vue单组件文件
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
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
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }

            }
        ]
    },

    plugins: [
        new ProgressBarPlugin(),

        new VueLoaderPlugin()
    ]
}