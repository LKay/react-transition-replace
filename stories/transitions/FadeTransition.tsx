import * as React from "react";
import { Component } from "react";
import CSSTransition = require("react-transition-group/CSSTransition");
import { TransitionProps } from "react-transition-group/Transition";
import * as styles from "./fade.scss";

const TRANSITION_TIMEOUT = 300;

export type FadeTransitionProps = Partial<TransitionProps>;

export class FadeTransition extends Component<FadeTransitionProps> {

    static defaultProps = {
        in      : false,
        timeout : TRANSITION_TIMEOUT
    }

    render() {
        const {
            timeout,
            ...props
        } = this.props;

        return (
            <CSSTransition
                { ...props }
                classNames={ styles }
                timeout={ timeout }
            />
        );
    }
}
