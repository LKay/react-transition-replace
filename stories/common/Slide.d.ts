import { Component } from "react";
export interface SlideProps {
    index?: number;
    description?: string;
    image?: string;
    title?: string;
}
export interface SlideState {
    description: string;
    image: string;
    title: string;
}
export default class Slide extends Component<SlideProps, SlideState> {
    constructor(props: any);
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
