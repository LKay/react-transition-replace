import * as React from "react";
import { StatelessComponent } from "react";
import { Button, Col, Panel, Row } from "react-bootstrap";

require("./style.scss");

const CrossFade: StatelessComponent<{}> = () => {
    return (
        <Row>
            <Col>
                <Panel />
            </Col>
        </Row>
    );
};

export default CrossFade;
