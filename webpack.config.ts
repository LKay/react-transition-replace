import webpack = require("webpack");
import path = require("path");
const tsconfig = require("./tsconfig.json");

module.exports = {

    entry: path.join(__dirname, "./src/index.ts"),

    output: {
        filename : process.env.NODE_ENV === "production"
            ? "react-transition-replace.min.js"
            : "react-transition-replace.js",
        path : path.join(__dirname, "dist/browser"),
        library : "ReactTransitionReplace",
        libraryTarget : "umd"
    },

    externals: {
        "react": {
            root      : "React",
            commonjs2 : "react",
            commonjs  : "react",
            amd       : "react"
        },
        "react-dom": {
            root      : "ReactDOM",
            commonjs2 : "react-dom",
            commonjs  : "react-dom",
            amd       : "react-dom"
        },
        "prop-types": {
            root      : "PropTypes",
            commonjs2 : "prop-types",
            commonjs  : "prop-types",
            amd       : "prop-types"
        },
        "react-transition-group": {
            root      : "ReactTransitionGroup",
            commonjs2 : "react-transition-group",
            commonjs  : "react-transition-group",
            amd       : "react-transition-group"
        }
    },

    resolve : {
        extensions : [".ts", ".tsx", ".js", ".scss", ".css"]
    },

    module : {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader : "ts-loader",
                        options : {
                            compilerOptions : {
                                ...tsconfig.compilerOptions,
                                module : "es6"
                            }
                        }
                    }
                ]
            }
        ]
    }
};
