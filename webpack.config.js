const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
    let fileExtension = "js"
    let environment = "development";
    if (env.production) {
        fileExtension = "min.js";
        environment = "production";
    }

    let config = {
        mode: `${environment}`, //"development", "production"
        devtool: "source-map", // "", "eval-source-map", "source-map"
        entry: {
            tools: "./src/tools/BildrTools.ts",
            plugins: "./src/plugin/PluginEntry.ts",
            marketplace: "./src/bildr-marketplace-plugin-v1.ts"
        },
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
            filename: `bildr-[name].${fileExtension}`,
            path: path.resolve(__dirname, 'dist'),
            library: ["Bildr", "[name]"],
            libraryTarget: "umd"
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
    return config
}