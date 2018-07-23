import { Component, HTMLProps, ReactElement, ReactInstance } from "react";
import * as PropTypes from "prop-types";
import { TransitionProps } from "react-transition-group/Transition";
import { TransitionGroupProps } from "react-transition-group/TransitionGroup";
import { ExitedHandler, RefHandler } from "./utils/ChildMapping";
export interface TransitionReplaceClassNames {
    height?: string;
    heightActive?: string;
    width?: string;
    widthActive?: string;
}
export declare const enum ChildKey {
    Prev = "prev",
    Next = "next"
}
export declare type TransitionChildren = {
    [K in ChildKey]: ReactElement<TransitionProps>;
};
export declare type ChildFactory = (child: ReactElement<any>) => ReactElement<any>;
export declare type TransitionReplaceProps = TransitionGroupProps & HTMLProps<any> & {
    changeWidth?: boolean;
    childFactory?: ChildFactory;
    classNames?: string | TransitionReplaceClassNames;
    easing?: string;
    inlineTransitions?: boolean;
    overflowHidden?: boolean;
    timeout?: number;
};
export interface TransitionReplaceState {
    active: boolean;
    children: TransitionChildren;
    firstRender: boolean;
    handleExited: ExitedHandler;
    handleRef: RefHandler;
    height: string | number;
    width: string | number;
}
/**
 * The `<TransitionReplace>` component manages a set of `<Transition>` components
 * in a list. Like with the `<Transition>` component, `<TransitionReplace>`, is a
 * state machine for managing the mounting and unmounting of components over
 * time.
 *
 * Consider the example below using the `Fade` CSS transition.
 * As child item changes in the `BasicExample` the `in` prop is toggled
 * automatically by the `<TransitionReplace>`. You can use _any_ `<Transition>`
 * component in a `<TransitionReplace>`, not just css.
 *
 * Note that `<TransitionReplace>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual `<Transition>`
 * components. This means you can mix and match animations across different
 * list items.
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
 * function random() {
 *     return Math.random().toString(36).substring(7);
 * }
 *
 * class BasicExample extends React.Component {
 *
 *     state = {
 *         key : random()
 *     }
 *
 *     handleClick() {
 *         this.setState({ key : random() })
 *     }
 *
 *     render() {
 *         return (
 *             <div>
 *                 <button onClick={ this.handleClick.bind(this) }>Change</button>
 *
 *                 <TransitionReplace
 *                     transition={ Fade }
 *                     classNames="fade"
 *                 >
 *                     <Fade key={ this.state.key }>
 *                         <h2>Foo</h2>
 *                     </Fade>
 *                 </TransitionReplace>
 *             </div>
 *         );
 *     }
 * }
 * ```
 *
 * In case of `CSSTransition` you probably have some styles defined that for above example looks such as:
 *
 * ```css
 * .fade-exit {
 *     opacity: 1;
 *  }
 *
 * .fade-exit.fade-exit-active {
 *     opacity: 0;
 *     transition: opacity .3s ease-in;
 * }
 *
 * .fade-enter {
 *     opacity: 0;
 * }
 *
 * .fade-enter.fade-enter-active {
 *     opacity: 1;
 *     transition: opacity .3s ease-in;
 * }
 * ```
 *
 * And based on your `classNames` prop the container will also have CSS classes applied so you need
 * to add them to yous stylesheet:
 *
 * ```css
 * .fade-height {
 *     height: auto;
 * }
 *
 * .fade-height-active {
 *     transition: height .3s ease-in-out;
 * }
 *
 * .fade-width {
 *     width: auto;
 * }
 *
 * .fade-width-active {
 *     transition: width .3s ease-in-out;
 * }
 * ```
 *
 * The `<TransitionReplace>` takes the same props as
 * [`<TransitionGroup>`](https://reactcommunity.org/react-transition-group/#TransitionGroup)
 * and additionally accepts the following:
 */
export default class TransitionReplace extends Component<TransitionReplaceProps, TransitionReplaceState> {
    static propTypes: {
        /**
         * A prop that enables or disables width animations for the container.
         */
        changeWidth: PropTypes.Requireable<any>;
        /**
         * The animation classNames applied to the component as it enters or exits.
         * A single name can be provided and it will be suffixed for each stage: e.g.
         *
         * `classNames="fade"` applies `fade-height`, `fade-height-active`,
         * `fade-width`, `fade-width-active`.
         * Each individual classNames can also be specified independently like:
         *
         * ```js
         * classNames={{
         *  height: 'my-height',
         *  heightActive: 'my-active-height',
         *  width: 'my-width',
         *  widthActive: 'my-active-width'
         * }}
         * ```
         *
         * @type {string | {
         *  height?: string,
         *  heightActive?: string,
         *  width?: string,
         *  widthActive?: string
         * }}
         */
        classNames: PropTypes.Requireable<any>;
        /**
         * Defines transition timing function that will be applied to inline CSS styles.
         */
        easing: PropTypes.Requireable<any>;
        /**
         * A prop that enables or disables applying inline CSS styles and transitions to elements.
         */
        inlineTransitions: PropTypes.Requireable<any>;
        /**
         * A prop that if set to `true` will add `overfolow: hidden` CSS style to the container.
         */
        overflowHidden: PropTypes.Requireable<any>;
        /**
         * The duration of the transition, in milliseconds.
         * Required to properly apply transition CSS classes and inline styles.
         */
        timeout: PropTypes.Requireable<any>;
    };
    static defaultProps: {
        changeWidth: boolean;
        easing: string;
        inlineTransitions: boolean;
        overflowHidden: boolean;
        timeout: number;
    };
    static childContextTypes: {
        transitionGroup: PropTypes.Validator<any>;
    };
    private mounted;
    private refNextChild;
    private refPreviousChild;
    private animationId;
    private timeout;
    constructor(props: any, context: any);
    getChildContext(): {
        transitionGroup: {
            isMounting: boolean;
        };
    };
    private getTransitionDuration;
    handleExited(child: ReactElement<TransitionProps>, node: HTMLElement): void;
    handleRef(key: ChildKey, instance: ReactInstance): void;
    static getDerivedStateFromProps(nextProps: any, state: any): {
        children: TransitionChildren;
        firstRender: boolean;
    };
    componentWillUnmount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: TransitionReplaceProps, prevState: TransitionReplaceState): void;
    private getClassName;
    render(): JSX.Element;
}
