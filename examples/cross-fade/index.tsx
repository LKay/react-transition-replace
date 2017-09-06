import * as React from "react";
import { Component, ReactType } from "react";
import { Button, Col, Panel, Row } from "react-bootstrap";

export interface AddRemoveState {
    child: ReactType;
}

export default class AddRemove extends Component<{}, AddRemoveState> {

    state = {
        child : null
    }

    render() {
        return (
            <Row>
                <Col>
                    <Panel />
                </Col>
            </Row>
        );
    }
}
