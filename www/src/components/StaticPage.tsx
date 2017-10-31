import * as React from "react";

interface StaticPageProps {
    metadata?: any;
}

export default function StaticPage({ metadata }) {

    return (
        <section>
            <h2 id={ metadata.frontmatter.link }><a href={`#${metadata.frontmatter.link}`}>
                {metadata.frontmatter.title}</a>
            </h2>

            <div dangerouslySetInnerHTML={{ __html: metadata.html }} />
        </section>
    )
}
