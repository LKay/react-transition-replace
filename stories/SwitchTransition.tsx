import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-router";
import ReactRouter from "./transition-replace/ReactRouter";

storiesOf("SwitchTransition", module)
    .addDecorator(StoryRouter())
    .add("Basic", () => (<ReactRouter />));
