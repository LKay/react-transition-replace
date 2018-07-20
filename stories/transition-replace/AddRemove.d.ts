import { Component, ReactNode } from "react";
export interface StoryState {
    child: ReactNode;
}
export default class Story extends Component<{}, StoryState> {
    state: any;
    private handleClickRemove;
    private handleClickAdd;
    render(): JSX.Element;
}
