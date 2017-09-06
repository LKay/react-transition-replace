import * as React from "react";
import { Component } from "react";
import CSSTransition = require("react-transition-group/CSSTransition");
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

require("./style.scss");

const TRANSITION_TIMEOUT = 300;

export type FadeTransitionProps = Pick<CSSTransitionProps, "in">;

export class FadeTransition extends Component<FadeTransitionProps> {
    render() {
        console.warn("FADE", this.props);
        return (
            <CSSTransition
                { ...this.props }
                classNames="fade"
                timeout={ TRANSITION_TIMEOUT }
            />
        );
    }
}
