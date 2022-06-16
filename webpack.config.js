const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'development', //"development", "production"
    devtool: false, //false, "eval-source-map", "source-map"
    entry: "./src/BildrTools.ts",
    target: ['web', 'es6'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node-modules/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bildr-tools.js',
        path: path.resolve(__dirname, 'dist'),
        library: { name: "BildrTools", type: "window" }
    },
    stats: {
        errorDetails: true
    },
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
                format: {
                    preamble: `/* Copyright ${new Date().getUTCFullYear()}, Jeroen van Menen. ${require('./package.json').name} ${require('./package.json').version} (${new Date().toUTCString()}) */`
                }
            }
        })],
    }
}