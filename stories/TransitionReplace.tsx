import * as React from "react";
import { storiesOf } from "@storybook/react";
import AddRemove from "./transition-replace/AddRemove";

storiesOf("TransitionReplace", module)
    .add("Add & Remove", () => (<AddRemove />));
