import * as React from "react";
import { Col, Grid, Image, Row } from "react-bootstrap";
import ExampleAddRemove from "./add-remove";

export const App = () => {
    return (
        <Grid>
            <h2>Examples for <code>react-transition-replace</code></h2>

            <ExampleAddRemove />

            <Row>
                <Col
                    xs={ 12 }
                    className="text-muted small"
                >
                    { "Photos by " }
                    <a href="https://www.flickr.com/photos/yoshikazut/">Yoshikazu Takada</a>
                    { " under the " }
                    <a href="https://creativecommons.org/licenses/by/2.0/">Creative Commons license</a>
                </Col>
            </Row>
        </Grid>
    );
};

export default App;
