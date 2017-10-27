import * as React from "react";
import { storiesOf } from "@storybook/react";
import AddRemove from "./transition-replace/AddRemove";
import ReactRouter from "./transition-replace/ReactRouter";

storiesOf("TransitionReplace", module)
    .add("Add & Remove", () => (<AddRemove />))
    .add("React Router", () => (<ReactRouter />));
