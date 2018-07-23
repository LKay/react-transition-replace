import * as React from "react";
import { graphql, Link } from "gatsby";
import { Container, Nav, NavItem, NavLink, Navbar } from "reactstrap";
import "../css/bootstrap.scss";
import "../css/prism-theme.scss";

export interface SiteData {
    siteMetadata: {
        componentPages: Array<{
            codeSandboxId: string;
            displayName: string;
            path: string;
        }>;
        title: string;
        version: string;
    }
}

export const layoutSiteFragment = graphql`
    fragment Layout_Site on Site {
        siteMetadata {
            componentPages {
                codeSandboxId
                displayName
                path
            }
            title
            version
        }
    }
`;

export interface LayoutData {
    site: SiteData;
}

export interface LayoutProps {
    data: LayoutData;
    location: any;
}

export interface LayoutState {
    isOpen: boolean;
}

export default class extends React.Component<LayoutProps, LayoutState> {
    state = {
        isOpen: false
    };

    render() {
        const {
            data : { site : { siteMetadata : { title } } },
            children
        } = this.props;

        return (
            <div>
                <Navbar
                    fixed="top"
                    dark
                    color="dark"
                >
                    <Container>
                        <Link
                            to="/"
                            className="navbar-brand mr-auto"
                        >
                            { title }
                        </Link>
                        <Nav navbar>
                            <NavItem>
                                <NavLink href="https://github.com/LKay/react-transition-replace">
                                    <i className="fab fa-fw fa-github fa-lg" />
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Container>
                </Navbar>
                <Container style={ { marginTop: "75px" } }>
                    { children }
                </Container>
            </div>
        );
    }
}
