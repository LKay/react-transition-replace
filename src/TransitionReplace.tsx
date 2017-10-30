import * as React from "react";
import {
    cloneElement,
    Component,
    CSSProperties,
    HTMLProps,
    ReactElement,
    ReactNode,
    ReactInstance
} from "react";
import * as PropTypes from "prop-types";
import * as invariant from "invariant";
import { TransitionActions, TransitionProps } from "react-transition-group/Transition";
import { TransitionGroupProps } from "react-transition-group/TransitionGroup";
import { findDOMNode } from "react-dom";

function isNil(obj: any) {
    return obj === undefined || obj === null;
}

const DEFAULT_TRANSITION_TIMEOUT: number = 0;

export interface TransitionReplaceClassNames {
    height?: string;
    heightActive?: string;
    width?: string;
    widthActive?: string;
}

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
    height: string | number;
    previousChild: ReactElement<TransitionProps>;
    width: string | number;
}

function validateChildren(children: ReactNode): void {
    const count = React.Children.count(children);

    invariant(
        count <= 1,
        "A <TransitionReplace> may have only one child element"
    );

    if (count === 1) {
        const child = React.Children.only(children);
        if (!!child.props.children) {
            invariant(
                !!child.key,
                "A child of <TransitionReplace> must have unique `key` property set"
            );
        }
    }
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
 * Consider the example below using the `Fade` CSS transition from before.
 * As items are removed or added to the TodoList the `in` prop is toggled
 * automatically by the `<TransitionReplace>`. You can use _any_ `<Transition>`
 * component in a `<TransitionReplace>`, not just css.
 *
 * Note that `<TransitionReplace>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual `<Transition>`
 * components. This means you can mix and match animations across different
 * list items.
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
        classNames        : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
        timeout           : DEFAULT_TRANSITION_TIMEOUT
    };

    static childContextTypes = {
        transitionGroup : PropTypes.object.isRequired
    };

    state = {
        active        : false,
        height        : "auto",
        width         : this.props.changeWidth ? "auto" : null,
        previousChild : null
    } as TransitionReplaceState;

    private mounted: boolean = false;

    private refWrapper: ReactInstance;
    private refChild: ReactInstance;
    private refPreviousChild: ReactInstance;

    private animationId: number;
    private timeout: number;

    getChildContext() {
        return {
            transitionGroup : { isMounting : !this.mounted }
        };
    }

    private getTransitionDuration(): number {
        const {
            children,
            timeout
        } = this.props;
        const {
            previousChild
        } = this.state;

        const child: ReactElement<TransitionProps> = children ? React.Children.only(children) : null;

        return Math.max(
            // Timeout for exit transition
            isNil(previousChild)
                ? 0
                : (
                    typeof previousChild.props.timeout === "number"
                        ? previousChild.props.timeout
                        : (
                            !isNil(previousChild.props.timeout) ? (previousChild.props.timeout.exit || 0) : 0
                        )
                ),
            // Timeout for enter transition
            isNil(child)
                ? 0
                : (
                    typeof child.props.timeout === "number"
                        ? child.props.timeout
                        : (
                            !isNil(child.props.timeout) ? (child.props.timeout.enter || 0) : 0
                        )
                ),
            // Timeout specified on TransactionReplace
            timeout
        );
    }

    componentWillMount() {
        validateChildren(this.props.children);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        cancelAnimationFrame(this.animationId);
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillReceiveProps(nextProps: TransitionReplaceProps) {
        validateChildren(nextProps.children);

        const {
            changeWidth,
            children,
            inlineTransitions
        } = this.props;

        const { previousChild } = this.state;

        const child: ReactElement<TransitionProps> = children ? React.Children.only(children) : null;

        if (children === nextProps.children || (child && previousChild && child.key === previousChild.key)) {
            return;
        }

        const nodeWrapper = findDOMNode<HTMLElement>(this.refWrapper);

        this.setState({
            height        : nodeWrapper.offsetHeight,
            previousChild : child,
            width         : changeWidth ? nodeWrapper.offsetWidth : null
        });

        cancelAnimationFrame(this.animationId);

        this.animationId = requestAnimationFrame(() => {
            const nodeChild = findDOMNode<HTMLElement>(this.refChild);
            const height = nodeChild ? nodeChild.offsetHeight : 0;
            const width = nodeChild ? nodeChild.offsetWidth : 0;

            this.setState({
                active : true,
                height,
                width  : changeWidth ? width : null
            }, () => {
                const nodePreviousChild = findDOMNode<HTMLElement>(this.refPreviousChild);

                if (nodePreviousChild && inlineTransitions) {
                    nodePreviousChild.style.position = "absolute";
                    nodePreviousChild.style.top = "0";
                    nodePreviousChild.style.left = "0";
                    nodePreviousChild.style.width = "100%";
                }
            });

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.setState({
                    active        : false,
                    height        : "auto",
                    previousChild : null,
                    width         : changeWidth ? "auto" : null
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

    // use child config unless explicitly set by the TransitionReplace component
    private getProp(child: ReactElement<TransitionProps>, prop: keyof TransitionActions) {
        return this.props[prop] !== null ? this.props[prop] : child.props[prop];
    }

    render() {
        const {
            changeWidth,
            children,
            childFactory = defaultChildFactory,
            component: Component = "div",
            easing,
            inlineTransitions,
            overflowHidden
        } = this.props;

        const {
            active,
            height,
            width
        } = this.state;

        const currentChild = children ? React.Children.only(children) : null;
        const child = children ? cloneElement(currentChild, {
            appear : this.getProp(currentChild, "appear"),
            enter  : this.getProp(currentChild, "enter"),
            exit   : this.getProp(currentChild, "exit"),
            in     : true,
            ref    : (child: ReactInstance) => this.refChild = child
        }) : null;

        const previousChild = this.state.previousChild && (!child || this.state.previousChild.key !== child.key)
            ? cloneElement<TransitionProps, Partial<TransitionProps>>(this.state.previousChild, {
                enter : this.getProp(this.state.previousChild, "enter"),
                exit  : this.getProp(this.state.previousChild, "exit"),
                in    : false,
                ref   : (child: ReactInstance) => this.refPreviousChild = child
            })
            : null;

        const wrapperStyles: CSSProperties = {
            height,
            overflow                 : overflowHidden ? "hidden" : "visible",
            position                 : "relative",
            transitionProperty       : active && inlineTransitions ? `height ${changeWidth ? ", width " : null}` : null,
            transitionTimingFunction : active && inlineTransitions ? easing : null,
            transitionDuration       : active && inlineTransitions ? `${this.getTransitionDuration()}ms` : null,
            width                    : changeWidth ? width : null
        };

        return (
            <Component
                className={ this.getClassName() }
                ref={ (wrapper: ReactInstance) => this.refWrapper = wrapper }
                style={ active ? wrapperStyles : null }
            >
                { childFactory(child) }
                { previousChild && childFactory(previousChild) }
            </Component>
        );
    }

}
