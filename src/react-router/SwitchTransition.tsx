import * as React from "react";
import { cloneElement, ComponentType, ReactElement, Component } from "react";
import { RouteProps, match } from "react-router-dom";
import { SwitchProps, matchPath } from "react-router";
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

/**
 * The `<SwitchTransition>` component allows easy integration with `react-router`.
 *
 * Consider the example below using the `Fade` CSS transition from before.
 * As user navigates between routes `SwitchTransition` will detect the first
 * matching route the same way as original `Switch` component does and perform
 * transition between previous and currently matched route using provided transition
 * component. You can use _any_ `<Transition>` component in a `<TransitionReplace>`,
 * not just css.
 *
 * ```jsx
 * import React from 'react';
 * import { Route } from 'react-router';
 * import CSSTransition from 'react-transition-group';
 * import { SwitchTransition } from 'react-transaction-replace';
 *
 * const Fade = ({ children, ...props }) => (
 *     <CSSTransition
 *         { ...props }
 *         timeout={ 300 }
 *         className="fade"
 *     >
 *         { children }
 *     </CSSTransition>
 * );
 *
 * Fade.defaultProps = {
 *     in      : false,
 *     timeout : 300
 * }
 *
 * class RouterExample extends React.Component {
 *     render() {
 *         return (
 *             <SwitchTransition
 *                 transition={ Fade }
 *             >
 *                 <Route path="/foo" component={ Foo } />
 *                 <Route path="/bar" component={ Bar } />
 *             </SwitchTransition>
 *         );
 *     }
 * }
 *
 * ```
 *
 * The `<SwitchTransition>` takes the same props as
 * [`<Switch>`](https://reacttraining.com/react-router/core/api/Switch)
 * or [`<CSSTransition>`](https://reactcommunity.org/react-transition-group/#CSSTransition)
 * or [`<TransitionReplace>`](#TransitionReplace)
 * and additionally accepts the following:
 */
export default class SwitchTransition extends Component<SwitchTransitionProps> {

    static contextTypes = {
        router : PropTypes.shape({
            route : PropTypes.object.isRequired
        }).isRequired
    };

    static propTypes = {
        /**
         * The transition component used to perform animation.
         * This can be _any_ `<Transition>` component or component that extends it.
         *
         * @type elementType
         */
        transition : PropTypes.func.isRequired
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
                            { cloneElement(child, { location, computedMatch: match }) }
                        </div>
                    </Transition>
                }
            </TransitionReplace>
        );
    }

}
