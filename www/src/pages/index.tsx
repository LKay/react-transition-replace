import * as React from "react";
import { Component } from "react";
import * as PropTypes from "prop-types";
import StaticPage from "../components/StaticPage";
import ComponentPage from "../components/ComponentPage";

const pkg = require("../../../package.json");
const icon = require("../images/github.svg");

require("../css/bootstrap.scss");
require("../css/prism-theme.scss");

export interface IndexProps {
    data: any;
}

class Index extends Component<IndexProps> {
    static propTypes = {
        data: PropTypes.object.isRequired
    }

    componentDidMount() {
        document.title = "react-transition-replace";
    }

    render() {
        const {
            data: {
                allMarkdownRemark : { edges : sections },
                transitionReplace,
                switchTransition
            }
        } = this.props;
        const components = [transitionReplace, switchTransition];

        return (
            <div className="container" style={{ marginTop: "2rem" }}>
                <h1>
                    React Transition Replace
                    <small style={{ marginLeft : "10px" }}>
                        [
                        <code>
                            <a href={ `https://github.com/LKay/react-transition-replace/tree/${pkg.version}` }>
                                { pkg.version }
                            </a>
                        </code>
                        ]
                    </small>
                </h1>

                {
                    sections
                        .filter((section) => section.node.frontmatter.title.length > 0)
                        .map(({ node : section }, key) => (<StaticPage key={ key } metadata={ section } />))
                }

                <h2>Components</h2>
                { components.map((component, key) => (<ComponentPage key={ key } metadata={ component } />)) }
            </div>
        );
    }
}

export default Index;

export const pageQuery = graphql`
  query PagesAndComponents {
    allMarkdownRemark {
      edges {
        node {
          html
          frontmatter {
            title
            link
          }
        }
      }
    }
    transitionReplace: componentMetadata(displayName: { eq: "TransitionReplace" }) {
      ...ComponentPage_metadata
    }
    switchTransition: componentMetadata(displayName: { eq: "SwitchTransition" }) {
      ...ComponentPage_metadata
    }
  }
`;
