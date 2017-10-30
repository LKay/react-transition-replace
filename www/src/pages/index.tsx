import * as React from "react";
import { Component } from "react";
import * as PropTypes from "prop-types";
import ComponentPage from "../components/ComponentPage";

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
        console.warn(this.props);

        const { data: { transitionReplace } } = this.props;

        return (
            <div className="container" style={{ marginTop: "2rem" }}>
                <h1>React Transition Replace</h1>
                <section>
                    <h2>Getting Started</h2>
                    <p>

                    </p>
                    <h3 className="h4">Installation</h3>
                    <pre>
<code>{`
# npm
npm install react-transition-replace --save
# yarn
yarn add react-transition-replace
`}
</code>
</pre>

                    <h3 className="h4">CDN / External</h3>
                    <p>
                        Since react-transition-group is fairly small, the overhead of including the library in your application is
                        negligible. However, in situations where it may be useful to benefit from an external CDN when bundling, link
                        to the following CDN: <a href="https://unpkg.com/react-transition-replace/dist/react-transition-replace.min.js">
                        https://unpkg.com/react-transition-group/dist/react-transition-replace.min.js</a>
                    </p>
                </section>
                <h2>Components</h2>
                <ComponentPage metadata={ transitionReplace } />
            </div>
        );
    }
}

export default Index;

export const pageQuery = graphql`
  query Components {
    transitionReplace: componentMetadata(displayName: { eq: "TransitionReplace" }) {
      ...ComponentPage_metadata
    }
  }
`;
