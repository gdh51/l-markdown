import {
    createEleSymbol
}
from "../../../core/ast/index";

import {
    parseLinkCtx
} from './link-helper'
import {
    parseListCtx
} from './list-helper'

export {
    parseLinkCtx,
    parseListCtx
};

// target加入parent的children数组中
export function setParent(targets, parent, start = false) {

    // 统一为数组处理
    if (!Array.isArray(targets)) {
        targets = [targets];
    }

    // 如果未传入加入的起始位置
    if (start === false) {
        parent.children.push(...targets);
    } else {
        parent.children.splice(start, 0, ...targets);
    }

    // 为其设置父元素
    targets.forEach(target => {
        target.parent = parent;
    });
}

// 处理换行符生成的锻炼
export function generateParagraph(root, startIndex) {
    let textArray = root.children.splice(startIndex),
        pAst = createEleSymbol('p', '', true);

    // 为这些文本设置父节点为段落节点
    setParent(textArray, pAst);

    // 将锻炼节点添加到根节点数组中
    setParent(pAst, root);
}
