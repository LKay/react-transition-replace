import * as React from "react";
import { StatelessComponent, HTMLAttributes } from "react";
import * as styles from "./style.scss";

export type ButtonToolbarProps = HTMLAttributes<HTMLDivElement>;

const ButtonToolbar: StatelessComponent<ButtonToolbarProps> = (props) => (
    <div
        { ...props }
        className={ styles.buttonToolbar }
    />
);

export default ButtonToolbar;
