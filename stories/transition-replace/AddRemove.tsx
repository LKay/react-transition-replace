import * as React from "react";
import { action } from "@storybook/addon-actions";
import { Component, ReactNode, MouseEvent } from "react";
import { FadeTransition } from "../transitions/FadeTransition";
import * as classNames from "../transitions/fade.scss";
import TransitionReplace from "../../src/index";
import { random } from "../common/utils";
import * as styles from "../common/style.scss";
import Slide from "../common/Slide";
import { SlideProps } from "../common/Slide";
import Button from "../common/Button";
import ButtonToolbar from "../common/ButtonToolbar";

const TRANSITION_TIMEOUT = 300;

export interface StoryState {
    child: ReactNode;
}

export default class Story extends Component<{}, StoryState> {

    state = {
        child : undefined
    } as any;

    private handleClickRemove = (e: MouseEvent<any>) => {
        action("=== Remove Button Clicked ===")(e)
        this.setState({ child : undefined });
    };

    private handleClickAdd = (e: MouseEvent<any>) => {
        action("=== Add Button Clicked ===")(e)
        this.setState({
            child : (<FadeTransition key={ random() }><Slide /></FadeTransition>)
        });
    };

    render() {
        const { child } = this.state;

        return (
            <div>
                <h3 className={ styles.title }>Add/Replace and git Remove Content</h3>
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
    }
}
