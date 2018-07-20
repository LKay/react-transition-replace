export function getNodeSize(node: HTMLElement) {
    return {
        height : node ? node.offsetHeight : 0,
        width  : node ? node.offsetWidth : 0
    };
}
