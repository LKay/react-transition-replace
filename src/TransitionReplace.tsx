import * as React from "react";
import {
    isValidElement,
    Component,
    CSSProperties,
    HTMLProps,
    ReactElement,
    ReactInstance
} from "react";
import * as PropTypes from "prop-types";
import { TransitionProps } from "react-transition-group/Transition";
import { TransitionGroupProps } from "react-transition-group/TransitionGroup";
import { findDOMNode } from "react-dom";
import { classNamesShape } from "./utils/PropTypes";
import {
    ExitedHandler,
    getInitialChildMapping,
    getNextChildMapping,
    RefHandler,
    validateChildren
} from "./utils/ChildMapping";
import { getNodeSize } from "./utils/DOMUtils";
import { isNil, values } from "./utils/MiscUtils";
import Timer = NodeJS.Timer;

export interface TransitionReplaceClassNames {
    height?: string;
    heightActive?: string;
    width?: string;
    widthActive?: string;
}

export const enum ChildKey {
    Prev = "prev",
    Next = "next"
}

export type TransitionChildren = {
    [K in ChildKey]: ReactElement<TransitionProps>;
};

export type ChildFactory = (child: ReactElement<any>) => ReactElement<any>;

export type TransitionReplaceProps = TransitionGroupProps & HTMLProps<any> & {
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

function defaultChildFactory(child: ReactElement<any>): ReactElement<any> {
    return child;
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
    static propTypes = {
        /**
         * A prop that enables or disables width animations for the container.
         */
        changeWidth       : PropTypes.bool,

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
        classNames        : classNamesShape,

        /**
         * Defines transition timing function that will be applied to inline CSS styles.
         */
        easing            : PropTypes.string,

        /**
         * A prop that enables or disables applying inline CSS styles and transitions to elements.
         */
        inlineTransitions : PropTypes.bool,

        /**
         * A prop that if set to `true` will add `overfolow: hidden` CSS style to the container.
         */
        overflowHidden    : PropTypes.bool,

        /**
         * The duration of the transition, in milliseconds.
         * Required to properly apply transition CSS classes and inline styles.
         */
        timeout           : PropTypes.number
    };

    static defaultProps = {
        changeWidth       : false,
        easing            : "ease",
        inlineTransitions : true,
        overflowHidden    : false,
        timeout           : 0
    };

    static childContextTypes = {
        transitionGroup : PropTypes.object.isRequired
    };

    private mounted: boolean = false;

    private refNextChild: ReactInstance;
    private refPreviousChild: ReactInstance;

    private animationId: number;
    private timeout: Timer;

    constructor(props, context) {
        super(props, context);

        this.state = {
            active        : false,
            children      : null,
            firstRender   : true,
            handleExited  : this.handleExited.bind(this),
            handleRef     : this.handleRef.bind(this),
            height        : null,
            width         : null
        };
    }

    getChildContext() {
        return {
            transitionGroup : { isMounting : !this.mounted }
        };
    }

    private getTransitionDuration(): number {
        const {
            children : {
                [ChildKey.Prev] : prevChild,
                [ChildKey.Next] : nextChild
            }
        } = this.state;

        return Math.max(
            // Timeout for exit transition
            isNil(prevChild)
                ? 0
                : (
                    typeof prevChild.props.timeout === "number"
                        ? prevChild.props.timeout
                        : (
                            !isNil(prevChild.props.timeout) ? (prevChild.props.timeout.exit || 0) : 0
                        )
                ),
            // Timeout for enter transition
            isNil(nextChild)
                ? 0
                : (
                    typeof nextChild.props.timeout === "number"
                        ? nextChild.props.timeout
                        : (
                            !isNil(nextChild.props.timeout) ? (nextChild.props.timeout.enter || 0) : 0
                        )
                ),
            // Timeout specified on TransactionReplace
            this.props.timeout
        );
    }

    handleExited(child: ReactElement<TransitionProps>, node: HTMLElement): void {
        if (typeof child.props.onExited === "function") {
            child.props.onExited(node);
        }

        this.setState((state) => {
            const children = { ...state.children };
            delete children[ChildKey.Prev];
            return { children };
        });
    }

    handleRef(key: ChildKey, instance: ReactInstance): void {
        switch (key) {
            case ChildKey.Prev :
                this.refPreviousChild = instance;
                break;

            case ChildKey.Next :
                this.refNextChild = instance;
                break;
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        validateChildren(nextProps.children);

        const {
            children : prevChildMapping,
            firstRender,
            handleExited,
            handleRef
        } = state;

        return {
            children : firstRender
                ? getInitialChildMapping(nextProps, handleRef)
                : getNextChildMapping(nextProps, handleRef, prevChildMapping, handleExited),
            firstRender : false
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        cancelAnimationFrame(this.animationId);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate(prevProps: TransitionReplaceProps, prevState: TransitionReplaceState) {
        const prevNextChild = prevState.children[ChildKey.Next];
        const nextChild = this.state.children[ChildKey.Next];

        if (isValidElement(prevNextChild) && isValidElement(nextChild) && prevNextChild.key === nextChild.key) {
            return;
        }

        const {
            changeWidth
        } = this.props;

        const prevNodeSize = getNodeSize(findDOMNode<HTMLElement>(this.refPreviousChild));
        const nextNodeSize = getNodeSize(findDOMNode<HTMLElement>(this.refNextChild));

        this.setState(() => ({
            active : true,
            height : prevNodeSize.height,
            width  : changeWidth ? prevNodeSize.width : null
        }));

        cancelAnimationFrame(this.animationId);
        this.animationId = requestAnimationFrame(() => {
            this.setState(() => ({
                height : nextNodeSize.height,
                width  : changeWidth ? nextNodeSize.width : null
            }));

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.setState({
                    active        : false
                });
            }, this.getTransitionDuration());
        });
    }

    private getClassName(): string {
        const {
            changeWidth,
            className,
            classNames : classes
        } = this.props;

        const {
            active
        } = this.state;

        if (!classes) {
            return className;
        }

        const heightClassName = (typeof classes === "object" && classes !== null)
            ? classes.height || ""
            : `${classes}-height`;

        const activeHeightClassName = (typeof classes === "object" && classes !== null)
            ? classes.heightActive || ""
            : `${heightClassName}-active`;

        const widthClassName = (typeof classes === "object" && classes !== null)
            ? classes.width || ""
            : `${classes}-width`;

        const activeWidthClassName = (typeof classes === "object" && classes !== null)
            ? classes.widthActive || ""
            : `${widthClassName}-active`;

        return [
            className,
            heightClassName,
            active ? activeHeightClassName : null,
            changeWidth ? widthClassName : null,
            changeWidth && active ? activeWidthClassName : null
        ]
            .filter((v: string) => !!v)
            .join(" ");
    }

    render() {
        const {
            changeWidth,
            childFactory = defaultChildFactory,
            component: Component = "div",
            easing,
            inlineTransitions,
            overflowHidden,
            ...props
        } = this.props;

        const {
            active,
            children,
            height,
            width
        } = this.state;

        const wrapperStyles: CSSProperties = {
            height,
            overflow                 : overflowHidden ? "hidden" : "visible",
            position                 : "relative",
            transitionProperty       : `height ${changeWidth ? ", width " : null}`,
            transitionTimingFunction : easing,
            transitionDuration       : `${this.getTransitionDuration()}ms`,
            width                    : changeWidth ? width : null
        };

        delete props.appear;
        delete props.classNames;
        delete props.enter;
        delete props.exit;
        delete props.timeout;

        return (
            <Component
                { ...props }
                className={ this.getClassName() }
                style={ active && inlineTransitions ? wrapperStyles : null }
            >
                { values(children).map(childFactory) }
            </Component>
        );
    }

}
