const path = require("path");
const config = require("./gatsby-config");

const ComponentTemplate = path.resolve("src/templates/component.tsx");

exports.createPages = ({
    actions : { createPage },
    graphql
}) => {
    return new Promise((resolve, reject) => {
        resolve(
            graphql(`
                {
                    allComponentMetadata {
                        edges {
                            node {
                                displayName
                            }
                        }
                    }
                }
            `).then(result => {
                if (result.errors) {
                    reject(result.errors);
                }

                const { componentPages } = config.siteMetadata;

                result.data.allComponentMetadata.edges
                    .filter(({ node: { displayName } }) => componentPages.some(
                        (page) => page.displayName === displayName)
                    )
                    .forEach(({ node: { displayName } }) => {
                        createPage({
                            path      : componentPages.find((page) => page.displayName === displayName).path,
                            component : ComponentTemplate,
                            context : {
                                displayName
                            }
                        });
                    });
            })
        );
    });
};
