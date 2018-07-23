import * as React from "react";
import { graphql, Link } from "gatsby";
import { Nav, NavItem } from "reactstrap";
import Layout, { SiteData } from "../components/Layout";
import StaticSection from "../components/StaticSection";

export interface IndexPageData {
    allMarkdownRemark: {
        edges: Array<{
            node: {
                id: string;
            }
        }>;
    };
    site: SiteData;
}

export const indexPageQuery = graphql`
    query IndexQuery {
        allMarkdownRemark(
            filter: {
                fileAbsolutePath : {
                    regex : "/static/"
                }
            }
            sort: {
                fields : [fileAbsolutePath]
                order  : ASC
            }
        ) {
            edges {
                node {
                    frontmatter {
                        link
                        title
                    }
                    html
                }
            }
        }
        site {
            ...Layout_Site
        }
    }
`;

export interface IndexProps {
    data: IndexPageData;
    location: any;
}

export default class extends React.Component<IndexProps> {
    render() {
        const {
            data : {
                allMarkdownRemark : { edges : staticSections },
                site : { siteMetadata : { componentPages, title, version } }
            },
            location
        } = this.props;

        return (
            <Layout
                data={ this.props.data }
                location={ location }
            >
                <h1 className="mb-1">{ title }</h1>

                <div className="mb-4">
                    <a
                        href="https://www.npmjs.com/package/react-transition-replace"
                        className="mr-1"
                    >
                        <img
                            src="https://img.shields.io/npm/v/react-transition-replace.svg?style=flat-square"
                            alt="npm"
                        />
                    </a>
                    <a
                        href="https://circleci.com/gh/LKay/react-transition-replace/tree/master"
                        className="mr-1"
                    >
                        <img
                            src={ `https://img.shields.io/circleci/project/github/LKay/react-transition-replace/${version}.svg?style=flat-square` }
                            alt="CircleCI"
                        />
                    </a>
                    <a href="https://coveralls.io/github/LKay/react-transition-replace">
                        <img
                            src={ `https://img.shields.io/coveralls/LKay/react-transition-replace/${version}.svg?style=flat-square` }
                            alt="Coveralls"
                        />
                    </a>
                </div>

                {
                    staticSections.map(({ node : metadata }) => <StaticSection metadata={ metadata } />)
                }

                <h2 id="Components">Components</h2>
                <Nav vertical className="mb-3">
                    { componentPages.map(
                        ({ path, displayName }) => (
                            <NavItem key={ path }>
                                <Link
                                    to={ path }
                                    className="nav-link"
                                >
                                    { displayName }
                                </Link>
                            </NavItem>
                        )
                    )}
                </Nav>
            </Layout>
        );
    }
}
