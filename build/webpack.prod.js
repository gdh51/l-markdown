const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'production',

    entry: {
        "l-markdown": './src/index.js'
    },

    output: {
        filename: '[name].component.js',
        chunkFilename: '[id].js',
        path: path.join(process.cwd(), './lib'),
        library: 'l-markdown-components',
        libraryTarget: 'umd',
        umdNamedDefine: true
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