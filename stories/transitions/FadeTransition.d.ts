import { Component } from "react";
import { TransitionProps } from "react-transition-group/Transition";
export declare type FadeTransitionProps = Partial<TransitionProps>;
export declare class FadeTransition extends Component<FadeTransitionProps> {
    static defaultProps: {
        in: boolean;
        timeout: number;
    };
    render(): JSX.Element;
}
