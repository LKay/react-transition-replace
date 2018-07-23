export function getNodeSize(node: Element) {
    return {
        height : node ? (node as HTMLElement).offsetHeight : 0,
        width  : node ? (node as HTMLElement).offsetWidth : 0
    };
}
