/// <reference types="react" />
import { Component } from "react";
import * as PropTypes from "prop-types";
export interface IndexProps {
    data: any;
}
declare class Index extends Component<IndexProps> {
    static propTypes: {
        data: PropTypes.Validator<any>;
    };
    componentDidMount(): void;
    render(): JSX.Element;
}
export default Index;
export declare const pageQuery: any;
