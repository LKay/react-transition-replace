const path = require("path");

module.exports = {
    pathPrefix: "/react-transition-replace",
    siteMetadata: {
        title: "React Transition Replace Documentation",
        author: "Karol Janyst",
    },
    plugins: [
        "gatsby-plugin-typescript",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: path.join(__dirname, "src/pages"),
                name: "pages",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: path.join(__dirname, "../lib"),
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
        "gatsby-plugin-sass"
    ],
}
