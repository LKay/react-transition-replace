import * as React from "react";

export interface HtmlProps {
    headComponents: any;
    body: any;
    postBodyComponents: any;
}

const Html: React.StatelessComponent<HtmlProps> = ({ headComponents, body, postBodyComponents }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <link
                    rel="stylesheet"
                    href="https://use.fontawesome.com/releases/v5.1.1/css/all.css"
                    integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ"
                    crossOrigin="anonymous"
                />
                { headComponents }
                <title>React Transition Replace</title>
            </head>
            <body>
                <div id="___gatsby" dangerouslySetInnerHTML={ { __html: body } } />
                { postBodyComponents }
            </body>
        </html>
    );
};

export default Html;
