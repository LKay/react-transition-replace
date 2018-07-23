import * as React from "react";

const Example: React.StatelessComponent<any> = ({ codeSandbox }) => (
    <div>
        <div className="grid">
            <h2>Example</h2>
        </div>
        <div
            dangerouslySetInnerHTML={{
                __html: `
          <iframe
            title="${codeSandbox.title}"
            src="https://codesandbox.io/embed/${codeSandbox.id}?fontsize=14"
            style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
          />`,
            }}
        />
    </div>
);

export default Example;
