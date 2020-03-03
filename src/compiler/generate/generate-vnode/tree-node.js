class TreeNode {
    constructor (tag, text, order) {
        this.tag = tag;
        this.el = null;
        this.text = text || '';
        this.order = order;
        this.parentNode = null;
        this.children = [];
        this.selected = false;
    }
}

export function isSameType (node1, node2) {
    return node1 && node2 && (node1.tag === node2.tag);
}

export function createTreeNode (el, text, order) {
    return new TreeNode(el, text, order);
}

export function setParent (node, target) {
    node.parentNode = target;
    target.children.push(node);
}

// 用于将对应节点绑定对应的元素
export function bindElement (map, refs) {
    let node = null;
    for (node of map) {
        node.el = refs[node.order];
    }
}