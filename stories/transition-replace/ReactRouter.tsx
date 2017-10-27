import * as React from "react";
import { action } from "@storybook/addon-actions";
import { Component, ReactNode, MouseEvent } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { FadeTransition } from "../transitions/FadeTransition";
import * as classNames from "../transitions/fade.scss";
import TransitionReplace from "../../src/index";
import SwitchTransition from "../../src/react-router/SwitchTransition";
import { random } from "../common/utils";
import * as styles from "../common/style.scss";
import Slide from "../common/Slide";
import { SlideProps } from "../common/Slide";
import Button from "../common/Button";
import ButtonToolbar from "../common/ButtonToolbar";
import { imageFile } from "../common/image-file";
import loremIpsum = require("lorem-ipsum");

const TRANSITION_TIMEOUT = 300;

export interface StoryState {
    child: ReactNode;
}

const desc1 = loremIpsum({ sentenceLowerBound : 4, sentenceUpperBound : 10 });

const Route1 = (
    <Slide
        image={ imageFile(1) }
        title="Route 1"
        description={ desc1 }
    />
);

const Route2 = (
    <Slide
        image={ imageFile(2) }
        title="Route 2"
        description={ loremIpsum({ paragraphLowerBound : 4, sentenceUpperBound : 10 }) }
    />
);

const Route3 = (
    <Slide
        image={ imageFile(3) }
        title="Route 3"
        description={ loremIpsum({ paragraphLowerBound : 10, sentenceUpperBound : 10 }) }
    />
);

export default class Story extends Component<{}, StoryState> {

    state = {
        child : undefined
    } as any;

    private handleClickRemove = (e: MouseEvent<any>) => {
        action("=== Remove Button Clicked ===")(e)
        this.setState({ child : undefined });
    };

    private handleClickAdd = (e: MouseEvent<any>) => {
        action("=== Add Button Clicked ===")(e)
        this.setState({
            child : (<FadeTransition key={ random() }><Slide /></FadeTransition>)
        });
    };

    render() {
        const { child } = this.state;

        return (
            <div>
                <h3 className={ styles.title }>Intergration wth React Router</h3>
                <ButtonToolbar>
                    <Link className={ styles.button } to="/">Route 1</Link>
                    <Link className={ styles.button } to="/2">Route 2</Link>
                    <Link className={ styles.button } to="/3">Route 3</Link>
                    <Link className={ styles.button } to="/3/1">Route 3/1</Link>
                    <Link className={ styles.button } to="/3/2">Route 3/2</Link>
                    <Link className={ styles.button } to="/3/2">Route 3/3</Link>
                </ButtonToolbar>

                <hr />

                <div className={ styles.slideContainer }>
                    <SwitchTransition
                        transition={ FadeTransition }
                        overflowHidden
                    >
                        <Route path="/2" render={ () => Route2 } />
                        <Route path="/3" render={
                            ({ match : { path } }) => (
                                <div>
                                    { Route3 }

                                    <Switch>
                                        <Route path={ `${path}/1` } render={ () => (<h3 className={ styles.title }>Route 3/1</h3>) } />
                                        <Route path={ `${path}/2` } render={ () => (<h3 className={ styles.title }>Route 3/2</h3>) } />
                                        <Route path={ `${path}/3` } render={ () => (<h3 className={ styles.title }>Route 3/3</h3>) } />
                                    </Switch>
                                </div>
                            )
                        } />
                        <Route render={ () => Route1 } />
                    </SwitchTransition>
                </div>
            </div>
        );
    }
}
