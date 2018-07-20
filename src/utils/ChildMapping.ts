import invariant from "invariant";
import {Children, cloneElement, isValidElement, ReactElement, ReactInstance, ReactNode} from "react";
import { TransitionActions, TransitionProps } from "react-transition-group/Transition";
import { ChildKey, TransitionChildren, TransitionReplaceProps } from "../TransitionReplace";

export function validateChildren(children: ReactNode): void {
    const count = Children.count(children);

    invariant(
        count <= 1,
        "A <TransitionReplace> may have only one child element"
    );

    if (count === 1) {
        const child = Children.only(children);
        if (!!child.props.children) {
            invariant(
                !!child.key,
                "A child of <TransitionReplace> must have unique `key` property set"
            );
        }
    }
}

// use child config unless explicitly set by the TransitionReplace component
function getProp(child: ReactElement<TransitionProps>, prop: keyof TransitionActions, props: TransitionReplaceProps) {
    return props[prop] !== null ? props[prop] : child.props[prop];
}

export type RefHandler = (key: ChildKey, instance: ReactInstance) => void;
export type ExitedHandler = (child: ReactElement<TransitionProps>, node: HTMLElement) => void;

export function getChildMapping(
    key: ChildKey,
    children: ReactNode,
    mapFn?: any
): TransitionChildren {
    const mapper = (child) => (mapFn && isValidElement(child)) ? mapFn(child) : child;

    const result = Object.create(null);

    if (children) {
        const child = Children.only(children);
        result[key] = mapper(child);
    }

    return result;
}

export function getInitialChildMapping(
    props: TransitionReplaceProps,
    handleRef: RefHandler
): TransitionChildren {
    return getChildMapping(ChildKey.Next, props.children, (child) => {
        return cloneElement(child, {
            appear : getProp(child, "appear", props),
            enter  : getProp(child, "enter", props),
            exit   : getProp(child, "exit", props),
            in     : true,
            ref    : handleRef.bind(null, ChildKey.Next)
        });
    });
}

export function getNextChildMapping(
    nextProps: TransitionReplaceProps,
    handleRef: RefHandler,
    prevChildMapping: TransitionChildren,
    onExited: ExitedHandler
): TransitionChildren {
    const nextChildMapping = getChildMapping(ChildKey.Next, nextProps.children, (child) => {
        return cloneElement(child, {
            appear : getProp(child, "appear", nextProps),
            enter  : getProp(child, "enter", nextProps),
            exit   : getProp(child, "exit", nextProps),
            in     : true,
            ref    : handleRef.bind(null, ChildKey.Next)
        });
    });

    const prevChild = prevChildMapping[ChildKey.Next];
    const nextChild = nextChildMapping[ChildKey.Next];

    const previousChildMapping = !isValidElement(prevChild)
        ? null
        : (
            isValidElement(nextChild) && prevChild.key === nextChild.key
                ? null
                : {
                    [ChildKey.Prev] : cloneElement<TransitionProps, Partial<TransitionProps>>(prevChild, {
                        onExited : onExited.bind(null, prevChild),
                        enter    : getProp(prevChild, "enter", nextProps),
                        exit     : getProp(prevChild, "exit", nextProps),
                        in       : false,
                        ref      : handleRef.bind(null, ChildKey.Prev)
                    })
                }
        );

    return {
        ...previousChildMapping,
        ...nextChildMapping
    };
}
