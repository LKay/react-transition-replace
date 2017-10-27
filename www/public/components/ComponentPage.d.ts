/// <reference types="react" />
import { Component } from "react";
declare class ComponentPage extends Component<any> {
    render(): JSX.Element;
    renderProp: (prop: any, componentName: any) => JSX.Element;
    renderType(prop: any): any;
    renderEnum(enumType: any): JSX.Element;
}
export default ComponentPage;
export declare const descFragment: any;
export declare const propsFragment: any;
export declare const query: any;
