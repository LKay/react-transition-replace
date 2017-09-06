import * as React from "react";
import { ReactType } from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { App } from "./App";

require("bootstrap-sass/assets/stylesheets/_bootstrap.scss");

const renderApp = (Component: ReactType) => {
    render(
        (
            <AppContainer>
                <Component />
            </AppContainer>
        ),
        document.getElementById("root")
    );
};

renderApp(App);

if (module.hot) {
    module.hot.accept("./App", () => { renderApp(App); });
}
