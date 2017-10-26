import * as React from "react";
import { storiesOf } from "@storybook/react";


import {cloneElement, Component, createElement, ReactNode} from "react";
// import { Button, ButtonToolbar, Col, Panel, Row } from "react-bootstrap";
import { FadeTransition } from "../transitions/FadeTransition";
import * as classNames from "../transitions/fade.scss";
import TransitionReplace from "../../src/index";
import { random } from "../common/utils";
import * as styles from "../common/style.scss";
import Slide from "../common/Slide";
import { SlideProps } from "../common/Slide";
import Button from "../common/Button";
import ButtonToolbar from "../common/ButtonToolbar";

const TRANSITION_TIMEOUT = 1000;

export interface StoryState {
    child: ReactNode;
}

export default class Story extends Component<{}, StoryState> {

    state = {
        child : undefined
    } as any;

    private handleClickRemove = () => {
        this.setState({ child : undefined });
    };

    private handleClickAdd = () => {
        this.setState({
            child : (<FadeTransition key={ random() }><Slide /></FadeTransition>)
        });
    };

    render() {
        const { child } = this.state;
        const header = (<h3>Add/Replace and git Remove Content</h3>);
        const slide = (<Slide />);

        return (
            <div>
                <ButtonToolbar>
                    <Button onClick={ this.handleClickAdd }>Add/Replace</Button>
                    <Button onClick={ this.handleClickRemove }>Remove</Button>
                </ButtonToolbar>
                <div className={ styles.slideContainer }>
                    <TransitionReplace
                        classNames={ classNames }
                        timeout={ TRANSITION_TIMEOUT }
                        overflowHidden
                    >
                        { child }
                    </TransitionReplace>
                </div>
            </div>
        );

        /*
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
                            changeWidth
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
        */
    }
}
