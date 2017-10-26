import * as React from "react";
import { StatelessComponent, AnchorHTMLAttributes } from "react";
import * as styles from "./style.scss";

export type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const Button: StatelessComponent<ButtonProps> = (props) => (
    <a
        { ...props }
        className={ styles.button }
    />
);

export default Button;
