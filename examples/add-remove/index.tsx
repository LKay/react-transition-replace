import * as React from "react";
import {cloneElement, Component, createElement, ReactNode} from "react";
import { Button, ButtonToolbar, Col, Panel, Row } from "react-bootstrap";
import { FadeTransition } from "../cross-fade/FadeTransition";
import TransitionReplace from "../../src/index";
import { random } from "../common/utils";
import Slide from "../common/Slide";
import { SlideProps } from "../common/Slide";

const TRANSITION_TIMEOUT = 300;

export interface AddRemoveState {
    child: ReactNode;
}

export default class AddRemove extends Component<{}, AddRemoveState> {

    state = {
        child : undefined
    }

    private handleClickRemove = () => {
        this.setState({ child : undefined });
    }

    private handleClickAdd = () => {
        this.setState({
            child : (<FadeTransition key={ random() }><Slide /></FadeTransition>)
        });
    }

    render() {
        const { child } = this.state;
        const header = (<h3>Add/Replace and git Remove Content</h3>);
        const slide = (<Slide />);

        return (
            <Row>
                <Col xs={ 12 }>
                    <Panel header={ header }>
                        <ButtonToolbar>
                            <Button
                                bsStyle="success"
                                onClick={ this.handleClickAdd }
                            >
                                Add/Replace
                            </Button>
                            <Button
                                bsStyle="danger"
                                onClick={ this.handleClickRemove }
                            >
                                Remove
                            </Button>
                        </ButtonToolbar>

                        <TransitionReplace
                            classNames="fade"
                            timeout={ TRANSITION_TIMEOUT }
                            overflowHidden
                        >
                            { child }
                        </TransitionReplace>
                    </Panel>
                </Col>
            </Row>
        );
    }
}
