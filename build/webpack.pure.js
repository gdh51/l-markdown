const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// 纯净版本，仅有Markdown编译器
module.exports = {
    mode: 'production',

    entry: {
        "l-markdown": './src/index.js'
    },

    output: {
        filename: '[name].pure.js',
        chunkFilename: '[id].js',
        path: path.join(process.cwd(), './lib'),
        library: 'l-markdown',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
        rules: [{
            test: /\.js?$/,
            exclude: file => (
                /node_modules/.test(file) &&
                !/\.vue\.js/.test(file)
            ),
            use: {
                loader: 'babel-loader'
            }

        }]
    },

    plugins: [
        new ProgressBarPlugin()
    ]
}