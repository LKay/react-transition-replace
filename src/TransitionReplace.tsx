import * as React from "react";
import {
    cloneElement,
    Component,
    HTMLAttributes,
    ReactElement,
    ReactType,
    CSSProperties,
    ReactNode,
    ReactInstance
} from "react";
import * as PropTypes from "prop-types";
import * as invariant from "invariant";
import { TransitionActions, TransitionProps, EnterHandler, ExitHandler } from "react-transition-group/Transition";
import * as classNames from "classnames";
import { findDOMNode } from "react-dom";
import raf = require("dom-helpers/util/requestAnimationFrame");
import pick = require("lodash.pick");

export interface TransitionReplaceClassNames {
    height?: string;
    heightActive?: string;
}

export type ChildFactory = (child: ReactElement<any>) => ReactElement<any>;

export interface TransitionReplaceBaseProps extends HTMLAttributes<any> {
    changeWidth?: boolean;
    childFactory?: ChildFactory;
    classNames?: string | TransitionReplaceClassNames;
    overflowHidden?: boolean;
    timeout?: number;
}

export interface IntrinsicTransitionReplaceProps<T extends keyof JSX.IntrinsicElements = "div">
    extends TransitionActions, TransitionReplaceBaseProps {
    component?: T;
}

export interface ComponentTransitionReplaceProps<T extends ReactType> extends TransitionActions, TransitionReplaceBaseProps {
    component: T;
}

export type TransitionReplaceProps<T extends keyof JSX.IntrinsicElements = "div", V extends ReactType = any> =
    (IntrinsicTransitionReplaceProps<T> & JSX.IntrinsicElements[T]) | (ComponentTransitionReplaceProps<V>) & {
    children?: ReactElement<TransitionProps>;
};

export interface TransitionReplaceState {
    currentChild: ReactElement<TransitionProps>;
    currentKey: string;
    height: number;
    nextChild: ReactElement<TransitionProps>;
    nextKey: string;
    width: number;
}

function getNodeSize(node: Element): { height: number, width: number } {
    const { height, width } = node ? node.getBoundingClientRect() : { height: 0, width: 0 };
    return { height, width };
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

function childFactory(child: ReactElement<any>): ReactElement<any> {
    return child;
}

export class TransitionReplace extends Component<TransitionReplaceProps, TransitionReplaceState> {

    static propTypes = {
        appear         : PropTypes.bool,
        changeWidth    : PropTypes.bool,
        children       : PropTypes.node,
        childFactory   : PropTypes.func,
        classNames     : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        component      : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        enter          : PropTypes.bool,
        exit           : PropTypes.bool,
        overflowHidden : PropTypes.bool,
        timeout        : PropTypes.number
    };

    static defaultProps = {
        childFactory,
        component : "div",
        timeout   : 0
    };

    static childContextTypes = {
        transitionGroup : PropTypes.object.isRequired
    };

    state = {
        currentChild     : undefined,
        currentKey       : "1",
        height           : null,
        nextChild        : undefined,
        nextKey          : null,
        width            : null
    } as TransitionReplaceState;

    private mounted: boolean = false;
    private entering: boolean = false;
    private exiting: boolean = false;

    private refCurrent: ReactInstance = null;
    private refNext: ReactInstance = null;

    private timeout: number = null;

    private storedStyles: Pick<CSSStyleDeclaration, keyof CSSStyleDeclaration> = null;

    getChildContext() {
        return {
            transitionGroup : { isMounting: !this.mounted }
        };
    }

    componentWillMount() {
        const { children } = this.props;

        validateChildren(children);

        if (children) {
            let currentChild: ReactElement<TransitionProps> = React.Children.only(children);

            currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                in     : true,
                appear : this.getProp(currentChild, "appear"),
                enter  : this.getProp(currentChild, "enter"),
                exit   : this.getProp(currentChild, "exit")
            });

            // Initial child should be entering, dependent on appear
            this.setState({ currentChild });
        }
    }

    componentWillUnmount() {
        this.cancelTransition();
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate() {
        if (this.exiting || this.entering) {
            this.enqueueHeightTransition();
        }
    }

    componentWillReceiveProps(nextProps: TransitionReplaceProps) {
        validateChildren(nextProps.children);

        const { changeWidth } = this.props;
        const { currentChild } = this.state;

        const nextChild: ReactElement<TransitionProps> = nextProps.children
            ? React.Children.only(nextProps.children)
            : undefined;

        const state: Pick<TransitionReplaceState, keyof TransitionReplaceState> = {} as any;

        // The container was empty before and the entering element is being removed again
        if (!nextChild && !currentChild) {
            return;
        }

        if (currentChild) {
            const { height, width } = getNodeSize(findDOMNode(this.refCurrent));
            state.height = height;
            state.width = changeWidth ? width : null;
        }

        // item hasn't changed transition states
        // copy over the last transition props
        if (nextChild && currentChild && currentChild.key === nextChild.key) {
            state.currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                in    : currentChild.props.in,
                enter : this.getProp(nextChild, "enter", nextProps),
                exit  : this.getProp(nextChild, "exit", nextProps)
            });
        }
        // no new item so remove current (exiting)
        else if (!nextChild && currentChild && currentChild.props.in) {
            this.exiting = true;
            state.currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                in : false
            });
            state.nextChild = undefined;
        }
        //
        else if (nextChild) {
            this.entering = true;

            state.nextChild = cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                in    : true,
                enter : this.getProp(nextChild, "enter", nextProps),
                exit  : this.getProp(nextChild, "exit", nextProps)
            });

            if (currentChild) {
                this.exiting = true;
                state.currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                    in    : false
                });
            } else {
                state.height = 0;
            }
        }

        this.setState(state);
    }

    private addEnterStyles(node: HTMLElement): void {
        if (this.mounted) {
            this.storedStyles = pick(node.style, "position", "top", "left", "width");
            node.style.position = "absolute";
            node.style.top = "0";
            node.style.left = "0";
            node.style.width = "100%";
        }
    }

    private removeEnterStyles(node: HTMLElement): void {
        if (this.mounted) {
            Object.keys(this.storedStyles)
                .forEach((prop: keyof CSSStyleDeclaration) => node.style.setProperty(prop, this.storedStyles[prop]));
        }
    }

    private enqueueHeightTransition(): void {
        if (!this.timeout) {
            this.timeout = raf(this.performHeightTransition);
        }
    }

    private performHeightTransition = () => {
        if (this.mounted) {
            const { changeWidth } = this.props;
            const { nextChild } = this.state;
            const nextNode = nextChild ? findDOMNode(this.refNext) : null;
            const { height, width } = getNodeSize(nextNode);

            this.setState({
                height,
                width : changeWidth ? width : null
            });
        }
        window.clearTimeout(this.timeout);
        this.timeout = null;
    }

    private cancelTransition() {
        this.entering = false;
        this.exiting = false;
        window.clearTimeout(this.timeout);
        this.timeout = null;
        this.setState({
            nextChild        : undefined,
            height           : null,
            width            : null
        });
    }

    private handleExitCurrent(handler: ExitHandler): ExitHandler {
        return (node: HTMLElement) => {
            this.exiting = true;
            if (typeof handler === "function") {
                handler(node);
            }
        };
    }

    private handleExitedCurrent(handler: ExitHandler): ExitHandler {
        return (node: HTMLElement) => {
            this.exiting = false;

            if (!this.entering) {
                if (!this.state.nextChild) {
                    this.entering = false;
                    return this.setState({
                        currentChild : undefined,
                        height       : null,
                        width        : null
                    });
                }

                this.setState({
                    currentChild : undefined
                }, () => {
                    if (typeof handler === "function") {
                        handler(node);
                    }
                });
            }
        };
    }

    private handleEnterNext(handler: EnterHandler): EnterHandler {
        return (node: HTMLElement, isAppearing: boolean) => {
            this.entering = true;
            this.addEnterStyles(node);
            if (typeof handler === "function") {
                handler(node, isAppearing);
            }
        };
    }

    private handleEnteredNext(handler: EnterHandler): EnterHandler {
        return (node: HTMLElement, isAppearing: boolean) => {
            this.entering = false;
            this.removeEnterStyles(node);

            if (!this.exiting) {
                if (!isAppearing) {
                    this.setState({
                        currentChild: this.state.nextChild,
                        height: null,
                        nextChild: undefined,
                        width: null
                    }, () => {
                        if (typeof handler === "function") {
                            handler(node, isAppearing);
                        }
                    });
                } else if (typeof handler === "function") {
                    handler(node, isAppearing);
                }
            }
        };
    }

    // use child config unless explictly set by the TransitionReplace component
    private getProp(child: ReactElement<TransitionProps>,
                    prop: keyof TransitionActions,
                    props: TransitionReplaceProps = this.props) {
        return props[prop] !== null ? props[prop] : child.props[prop];
    }

    render() {
        const {
            appear,
            changeWidth,
            childFactory,
            classNames : classes,
            component : Component,
            enter,
            exit,
            overflowHidden,
            timeout,
            ...props
        } = this.props;
        const {
            currentChild,
            height,
            nextChild,
            width
        } = this.state;

        const children: Array<ReactElement<TransitionProps>> = [];
        let style: CSSProperties = props.style;
        let className: string = props.className;

        if (currentChild) {
            children.push(
                cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                    onExit   : this.handleExitCurrent(currentChild.props.onExit),
                    onExited : this.handleExitedCurrent(currentChild.props.onExited),
                    key      : currentChild.key || "current",
                    ref      : (current: ReactInstance) => this.refCurrent = current
                })
            );
        }

        if (nextChild) {
            children.push(
                cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                    onEnter   : this.handleEnterNext(nextChild.props.onEnter),
                    onEntered : this.handleEnteredNext(nextChild.props.onEntered),
                    key       : nextChild.key || "next",
                    ref       : (next: ReactInstance) => this.refNext = next
                })
            );
        }

        if (height !== null) {
            style = {
                ...style,
                display  : "block",
                height,
                position : "relative",
                width    : "100%"
            };

            if (!classes) {
                style = { ...style, transition : `height ${timeout}ms linear` };
            } else {
                const heightClassName = (typeof classes === "object" && classes !== null)
                    ? classes.height || ""
                    : `${classes}-height`;

                const activeHeightClassName = (typeof classes === "object" && classes !== null)
                    ? classes.heightActive || ""
                    : `${heightClassName}-active`;

                className = classNames(
                    className,
                    heightClassName,
                    nextChild && (this.entering || this.exiting) ? activeHeightClassName : null
                );
            }

            if (overflowHidden) {
                style = { ...style, overflow : "hidden" };
            }

            if (changeWidth) {
                style = { ...style, width };
            }
        }

        return (
            <Component
                { ...props }
                className={ className }
                style={ style }
            >
                { children.map(childFactory) }
            </Component>
        );
    }
}

export default TransitionReplace;
