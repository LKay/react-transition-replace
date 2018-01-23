const webpack = require("webpack");
const path = require("path");
const tsconfig = require("../tsconfig.json");

const SRC_PATH = path.join(__dirname, "../src");
const STORIES_PATH = path.join(__dirname, "../stories");


module.exports = {

    plugins : [
        new webpack.WatchIgnorePlugin([
            /css\.d\.ts$/
        ])
    ],

    devtool   : "cheap-module-source-map",

    resolve : {
        extensions : [".ts", ".tsx", ".js", ".scss", ".css"]
    },

    module : {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader : "awesome-typescript-loader",
                        options : {
                            ...tsconfig.compilerOptions,
                            module : "es6"
                        }
                    },
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
