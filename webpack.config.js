const path = require('path');

module.exports = {
    mode: 'development',
    devtool: false, //"source-map", //false or "source-map"
    entry: "./src/Bildr-tools.ts",
    target: ['web', 'es6'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node-modules/,
                include: [path.resolve(__dirname, 'src')],
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        //        publicPath: "dist",
        filename: 'bildr-tools.js',
        path: path.resolve(__dirname, 'dist'),
        library: { name: "BildrTools", type: "window" }
    },
    stats: {
        errorDetails: true
    }
}