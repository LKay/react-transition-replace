import * as React from "react";
import { cloneElement, ComponentType, ReactElement, Component } from "react";
import { withRouter, RouteProps, match } from "react-router-dom";
import { Switch, SwitchProps, matchPath } from "react-router";
import { TransitionProps } from "react-transition-group/Transition";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import * as PropTypes from "prop-types";
import * as invariant from "invariant";
import * as warning from "warning";
import TransitionReplace, { TransitionReplaceProps } from "../TransitionReplace";
import { Omit } from "../types";

export type SwitchTransitionProps = SwitchProps & TransitionReplaceProps & Omit<CSSTransitionProps, "in"> & {
    transition: ComponentType<Partial<TransitionProps | CSSTransitionProps>>;
    [prop: string]: any;
};

export default class SwitchTransition extends Component<SwitchTransitionProps> {

    static contextTypes = {
        router : PropTypes.shape({
            route : PropTypes.object.isRequired
        }).isRequired
    };

    static propTypes = {
        children : PropTypes.node,
        location : PropTypes.object
    };

    componentWillMount() {
        invariant(
            this.context.router,
            "You should not use <SwitchTransition> outside a <Router>"
        );
    }

    componentWillReceiveProps(nextProps: SwitchTransitionProps) {
        warning(
            !(nextProps.location && !this.props.location),
            "<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no"
            + "\"location\" prop and then provided one on a subsequent render."
        );

        warning(
            !(!nextProps.location && this.props.location),
            "<SwitchTransition> elements should not change from controlled to uncontrolled (or vice versa). You provided"
            + "a \"location\" prop initially but omitted it on a subsequent render."
        );
    }

    render() {
        const { route } = this.context.router;

        const {
            children,
            classNames,
            transition : Transition,
            timeout,
            mountOnEnter,
            unmountOnExit,
            onExited,
            onExit,
            onExiting,
            onEntered,
            onEnter,
            onEntering,
            addEndListener,
            location : propLocation,
            ...props
        } = this.props;
        const location = propLocation || route.location;

        let match: match<any> = null;
        let child: ReactElement<any> = null;

        React.Children.forEach(children, (element: ReactElement<RouteProps & { from?: string }>) => {
            if (match === null && React.isValidElement(element)) {
                const { path: pathProp, exact, strict, from } = element.props;
                const path = pathProp || from;

                child = element;
                match = path ? matchPath(location.pathname, { path, exact, strict }) : route.match;
            }
        });

        return (
            <TransitionReplace
                classNames={ classNames }
                timeout={ timeout }
                { ...props }
            >
                { !match ? null :
                    <Transition
                        key={match ? match.path : route.match.path}
                        timeout={timeout}
                        mountOnEnter={mountOnEnter}
                        unmountOnExit={unmountOnExit}
                        onExited={onExited}
                        onExit={onExit}
                        onExiting={onExiting}
                        onEntered={onEntered}
                        onEnter={onEnter}
                        onEntering={onEntering}
                        addEndListener={addEndListener}
                    >
                        <div>
                            { React.cloneElement(child, { location, computedMatch: match }) }
                        </div>
                    </Transition>
                }
            </TransitionReplace>
        );
    }

}
