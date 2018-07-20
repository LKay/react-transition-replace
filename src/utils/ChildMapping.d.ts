import { ReactElement, ReactInstance, ReactNode } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import { ChildKey, TransitionChildren, TransitionReplaceProps } from "../TransitionReplace";
export declare function validateChildren(children: ReactNode): void;
export declare type RefHandler = (key: ChildKey, instance: ReactInstance) => void;
export declare type ExitedHandler = (child: ReactElement<TransitionProps>, node: HTMLElement) => void;
export declare function getChildMapping(key: ChildKey, children: ReactNode, mapFn?: any): TransitionChildren;
export declare function getInitialChildMapping(props: TransitionReplaceProps, handleRef: RefHandler): TransitionChildren;
export declare function getNextChildMapping(nextProps: TransitionReplaceProps, handleRef: RefHandler, prevChildMapping: TransitionChildren, onExited: ExitedHandler): TransitionChildren;
