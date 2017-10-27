const webpack = require("webpack");
const path = require("path");

const SRC_PATH = path.join(__dirname, "../src");
const STORIES_PATH = path.join(__dirname, "../stories");

module.exports = {

    plugins : [
        new webpack.WatchIgnorePlugin([
            /css\.d\.ts$/
        ])
    ],

    devtool   : "eval-source-maps",

    resolve : {
        extensions : [".ts", ".tsx", ".js", ".scss", ".css"]
    },

    module : {
        rules: [
            /*
            {
                enforce: "pre",
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "source-map"
            },
            */
            {
                test: /\.tsx?$/,
                use: [
                    "awesome-typescript-loader",
                    "source-map-loader"
                ],
                include : [
                    SRC_PATH,
                    STORIES_PATH
                ]
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 25600,
                    name: "images/[name].[hash].[ext]"
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    "style-loader",
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            camelCase: true,
                            modules: true,
                            namedExport: true
                        }
                    },
                    //"css-loader",
                    //"resolve-url-loader",
                    {
                        loader : "sass-loader",
                        options : {
                            sourceMap : true
                        }
                    }
                ]
            }
        ]
    }
}
