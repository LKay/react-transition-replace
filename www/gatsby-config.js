const path = require("path");
const pkg = require("../package.json");

module.exports = {
    pathPrefix: "/react-transition-replace",
    siteMetadata: {
        title: "React Transition Replace",
        author: "Karol Janyst",
        version: pkg.version,
        componentPages: [
            {
                path: "/transition-replace",
                displayName: "TransitionReplace",
                codeSandboxId: "FAKE"
            },
            {
                path: "/react-router/switch-transition",
                displayName: "SwitchTransition",
                codeSandboxId: "FAKE"
            }
        ]
    },
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: path.join(__dirname, "src/static"),
                name: "pages",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: path.join(__dirname, "../dist"),
                name: "components",
            },
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    "gatsby-remark-prismjs",
                ],
            },
        },
        "gatsby-transformer-react-docgen",
        "gatsby-plugin-typescript",
        "gatsby-plugin-sass"
    ]
}
