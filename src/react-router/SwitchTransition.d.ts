import { ComponentType, Component } from "react";
import { SwitchProps } from "react-router";
import { TransitionProps } from "react-transition-group/Transition";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import * as PropTypes from "prop-types";
import { TransitionReplaceProps } from "../TransitionReplace";
import { Omit } from "type-zoo";
export declare type SwitchTransitionProps = SwitchProps & TransitionReplaceProps & Omit<CSSTransitionProps, "in"> & {
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
    static contextTypes: {
        router: PropTypes.Validator<any>;
    };
    static propTypes: {
        /**
         * The transition component used to perform animation.
         * This can be _any_ `<Transition>` component or component that extends it.
         *
         * @type elementType
         */
        transition: PropTypes.Validator<any>;
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: SwitchTransitionProps): void;
    render(): JSX.Element;
}
