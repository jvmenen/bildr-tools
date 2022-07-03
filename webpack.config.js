const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const TerserPlugin = require("terser-webpack-plugin");
var DeclarationBundlerPlugin = require('./DeclarationBundlerPlugin');

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
            plugins: "./src/plugin/PluginEntry.ts"
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
        plugins: [
            new DeclarationBundlerPlugin({
                moduleName: 'Bildr.plugins',
                out: './dist/bildr-plugins.d.ts',
            }),
            new webpack.DefinePlugin({
                WEBPACKDEFINE_PRODUCTION: JSON.stringify(environment==="production"),
              })
        ],
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