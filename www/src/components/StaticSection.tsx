import * as React from "react";

export interface StaticSectionMetadata {
    frontmatter: {
        link: string;
        title: string;
    }
    html: string;
}

export interface StaticProps {
    metadata: StaticSectionMetadata;
}

const StaticSection: React.StatelessComponent<StaticProps> = ({
    metadata : {
        frontmatter : { title, link },
        html
    }
}) => {
    return (
        <section>
            <h2 id={ link }>
                <a href={ `#${link}` }>{ title }</a>
            </h2>
            <div dangerouslySetInnerHTML={ { __html : html } } />
        </section>
    );
};

export default StaticSection;
