const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackTemplate = require("html-webpack-template")

function buildConfig(env = "development", { host = "localhost", port = 8080 }) {
    const plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            inject : false,
            template : HtmlWebpackTemplate,
            title : "Examples",
            appMountId : "root",
            mobile : true,
            cache : true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            "process.env" : { NODE_ENV: JSON.stringify("development") }
        })
    ]

    return {
        plugins,
        entry : [
            "react-hot-loader/patch",
            //"webpack-hot-middleware/client?reload=true",
            path.join(__dirname, "index.tsx")
        ],
        output : {
            path                   : path.join(__dirname, "examples"),
            publicPath             : `http://${host}:${port}/`,
            filename               : "bundle.js",
            hotUpdateChunkFilename : "[id].hot-update.js",
            hotUpdateMainFilename  : "hot-update.json"
        },

        devtool   : "eval-source-maps",
        devServer : {
            contentBase        : path.join(__dirname, "examples"),
            port,
            host,
            hot                : true,
            historyApiFallback : true,
            inline             : true,
            overlay            : true
        },

        resolve : {
            extensions : [".ts", ".tsx", ".js", ".scss", ".css"]
        },

        resolveLoader : {
            moduleExtensions: ["-loader"],
        },

        module : {
            rules: [
                {
                    enforce: "pre",
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: "source-map"
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        "react-hot-loader/webpack",
                        {
                            loader: "awesome-typescript",
                            options: {
                                include: ["development/**/*.ts"]
                            }
                        },
                        "source-map"
                    ]
                },
                {
                    test: /\.html$/,
                    use: "html"
                },
                {
                    test: /\.(jpg|png)$/,
                    loader: 'url',
                    options: {
                        limit: 25600,
                        name: "images/[name].[hash].[ext]"
                    }
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url',
                    options: {
                        limit: 100000,
                        mimetype: "application/font-woff"
                    }
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file"
                },
                {
                    test: /\.s?css$/,
                    use: [
                        "style",
                        {
                            loader: "css",
                            options: {
                                sourceMap: true,
                                root: "/"
                            }
                        },
                        "resolve-url",
                        "sass"
                    ]
                }
            ]
        }
    }
}

module.exports = buildConfig
