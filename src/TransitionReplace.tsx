import * as React from "react";
import {
    createElement,
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

export interface TransitionReplaceClassNames {
    height?: string;
    heightActive?: string;
}

export type ChildFactory = (child: ReactElement<any>) => ReactElement<any>;
export type ChildWrapper<P = any> = (child: ReactElement<any>, props?: P) => ReactElement<any>;

export interface TransitionReplaceBaseProps extends HTMLAttributes<any> {
    changeWidth?: boolean;
    childFactory?: ChildFactory;
    childWrapper?: ChildWrapper;
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
    activeTransition: boolean;
    currentChild: ReactElement<TransitionProps>;
    height: number;
    nextChild: ReactElement<TransitionProps>;
    width: number;
}

function getNodeSize(node: Element): { height: number, width: number } {
    const { height, width } = node ? node.getBoundingClientRect() : { height: 0, width: 0 };
    return { height, width };
}

function validateChildren(children: ReactNode): void {
    invariant(
        React.Children.count(children) <= 1,
        "A <TransitionReplace> may have only one child element"
    );
}

function childWrapper<P = TransitionProps>(child: ReactElement<P>, props?: P): ReactElement<any> {
    return createElement("div", props, child);
}

function childFactory(child: ReactElement<any>): ReactElement<any> {
    return child;
}

const TICK: number = 17;

export class TransitionReplace extends Component<TransitionReplaceProps, TransitionReplaceState> {

    static propTypes = {
        appear         : PropTypes.bool,
        changeWidth    : PropTypes.bool,
        children       : PropTypes.node,
        childFactory   : PropTypes.func,
        childWrapper   : PropTypes.func,
        classNames     : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        component      : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        enter          : PropTypes.bool,
        exit           : PropTypes.bool,
        overflowHidden : PropTypes.bool,
        timeout        : PropTypes.number
    };

    static defaultProps = {
        childFactory,
        childWrapper,
        component : "div",
        timeout   : 0
    };

    static childContextTypes = {
        transitionGroup : PropTypes.object.isRequired
    };

    state = {
        activeTransition : false,
        currentChild     : undefined,
        height           : null,
        nextChild        : undefined,
        width            : null
    } as TransitionReplaceState;

    private appeared: boolean = false;
    private entering: boolean = false;
    private exiting: boolean = false;

    private refCurrent: ReactInstance = null;
    private refNext: ReactInstance = null;

    private timeout: number = null;

    getChildContext() {
        return {
            transitionGroup : { isMounting: !this.appeared }
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
        window.clearTimeout(this.timeout as number);
    }

    componentDidMount() {
        this.appeared = true;
    }

    componentWillReceiveProps(nextProps: TransitionReplaceProps) {
        validateChildren(nextProps.children);

        let currentChild: ReactElement<TransitionProps> = this.state.currentChild;
        let nextChild: ReactElement<TransitionProps> = nextProps.children
            ? React.Children.only(nextProps.children)
            : undefined;

        // item hasn't changed transition states
        // copy over the last transition props
        if (nextChild && currentChild && currentChild.key === nextChild.key && !this.state.nextChild) {
            return this.setState({
                currentChild : cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                    in    : currentChild.props.in,
                    enter : this.getProp(nextChild, "enter", nextProps),
                    exit  : this.getProp(nextChild, "exit", nextProps)
                })
            });
        }
        // The container was empty before and the entering element is being removed again while
        // transitioning in. Since a CSS transition can't be reversed cleanly midway the height
        // is just forced back to zero immediately and the child removed.
        else if (!currentChild && !nextChild && this.state.nextChild) {
            return this.cancelTransition();
        }
        // new item came so replace
        else if (nextChild && currentChild && currentChild.key !== nextChild.key) {
            currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                in    : false
            });
            nextChild = cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                in    : true,
                enter : this.getProp(nextChild, "enter", nextProps),
                exit  : this.getProp(nextChild, "exit", nextProps)
            });
        }
        // no new item so remove current (exiting)
        else if (!nextChild && !!currentChild && currentChild.props.in) {
            currentChild = cloneElement<TransitionProps, Partial<TransitionProps>>(currentChild, {
                in : false
            });
            nextChild = undefined;
        }
        // item is new (entering)
        else if (nextChild && !currentChild) {
            nextChild = cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                in    : true,
                enter : this.getProp(nextChild, "enter", nextProps),
                exit  : this.getProp(nextChild, "exit", nextProps)
            });
        }

        const { changeWidth } = this.props;
        const { state } = this;
        const ref: ReactInstance = this.refCurrent || this.refNext;
        const { height, width } = getNodeSize(findDOMNode(ref));

        this.setState({
            activeTransition : false,
            currentChild,
            height : state.currentChild ? height : 0,
            nextChild,
            width : state.currentChild && changeWidth ? width : null
        });

        this.enqueueHeightTransition(nextChild);
    }

    private enqueueHeightTransition(nextChild: ReactElement<TransitionProps>, count: number = 0): void {
        this.timeout = window.setTimeout(() => {
            const { changeWidth } = this.props;

            if (!nextChild) {
                return this.setState({
                    activeTransition : true,
                    height           : 0,
                    width            : changeWidth ? 0 : null
                });
            }

            const nextNode = findDOMNode(this.refNext);

            if (nextNode) {
                const { height, width } = getNodeSize(nextNode);
                this.setState({
                    activeTransition : true,
                    height,
                    width : changeWidth ? width : null
                });
            }
            else {
                if (count < 10) {
                    this.enqueueHeightTransition(nextChild, count + 1);
                }
            }
        }, TICK);
    }

    private cancelTransition() {
        this.entering = false;
        this.exiting = false;
        clearTimeout(this.timeout);
        this.setState({
            nextChild        : undefined,
            activeTransition : false,
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

            if (this.entering) {
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
                });
            }

            if (!this.entering) {
                if (typeof handler === "function") {
                    handler(node);
                }
            }
        };
    }

    private handleEnterNext(handler: EnterHandler): EnterHandler {
        return (node: HTMLElement, isAppearing: boolean) => {
            this.entering = true;
            if (typeof handler === "function") {
                handler(node, isAppearing);
            }
        };
    }

    private handleEnteredNext(handler: EnterHandler): EnterHandler {
        return (node: HTMLElement, isAppearing: boolean) => {
            this.entering = false;

            if (!this.exiting) {
                if (!isAppearing) {
                    this.setState({
                        activeTransition: false,
                        currentChild: this.state.nextChild,
                        height: null,
                        nextChild: undefined,
                        width: null
                    });
                }

                if (typeof handler === "function") {
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
            childWrapper,
            classNames : classes,
            component : Component,
            enter,
            exit,
            overflowHidden,
            timeout,
            ...props
        } = this.props;
        const {
            activeTransition,
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
                    ref      : (current: ReactInstance) => this.refCurrent = current
                })
            );
        }

        if (nextChild) {
            children.push(
                cloneElement<TransitionProps, Partial<TransitionProps>>(nextChild, {
                    onEnter   : this.handleEnterNext(nextChild.props.onEnter),
                    onEntered : this.handleEnteredNext(nextChild.props.onEntered),
                    ref       : (next: ReactInstance) => this.refNext = next
                }, childWrapper(nextChild.props.children, {
                    style : {
                        position : "absolute",
                        top      : 0,
                        left     : 0,
                        width    : "100%"
                    }
                }))
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
                    nextChild && activeTransition ? activeHeightClassName : null
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
