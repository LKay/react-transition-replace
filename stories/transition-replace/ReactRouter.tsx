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
                <h3 className={ styles.title }>Intergration wth React Router</h3>
                <ButtonToolbar>
                    <Button>Route 1</Button>
                    <Button>Route 2</Button>
                    <Button>Route 3</Button>
                </ButtonToolbar>
                <h1>WIP</h1>
            </div>
        );
    }
}
