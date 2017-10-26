import * as React from "react";
import {Component, StatelessComponent} from "react";
import loremIpsum = require("lorem-ipsum");
import { imageFile } from "./image-file";
import * as styles from "./style.scss";

export interface SlideProps {
    index?: number;
}

export interface SlideState {
    description: string;
    image: string;
    title: string;
}

export default class Slide extends Component<SlideProps, SlideState> {
    componentWillMount() {
        const { index } = this.props;

        this.setState({
            image       : imageFile(index),
            title       : loremIpsum({ sentenceUpperBound : 7 }),
            description : loremIpsum({ units : "paragraphs" })
        });
    }

    render() {
        const {
            description,
            image,
            title
        } = this.state;

        return (
            <div className={ styles.slide }>
                <div className={ styles.image }>
                    <img
                        src={ image }
                        alt="slide"
                        width={ 640 }
                        height={ 427 }
                    />
                </div>
                <div className={ styles.caption }>
                    <h3>{ title }</h3>
                    <p>{ description }</p>
                </div>
            </div>
        );
    }
};