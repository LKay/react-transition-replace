import * as PropTypes from "prop-types";

export const classNamesShape = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
        height : PropTypes.string,
        width  : PropTypes.string
    }),
    PropTypes.shape({
        height       : PropTypes.string,
        heightActive : PropTypes.string,
        width        : PropTypes.string,
        widthActive  : PropTypes.string
    })
]);
