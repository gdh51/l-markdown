import { isTextSymbol, completeHInnerText } from '../../../core/ast/index'
import { handleEleAttr } from './vnode-attr'
import { bindElement } from './tree-node';

export function generateRenderFn (root, opts) {
    const stack = {
        opts,
        c: opts.createElement,
        hRefs: {
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0
        },

        // 上一个处理的h标签的等级
        prevHlevel: null,
        nodesTreeMap: [],
        prevNode: null,
        transformTotree: opts.transformTotree
    };

    // 为标题标签获取其文本标题信息
    completeHInnerText(root);

    if (!stack.c) throw Error(`If you use vue's renderFunction, you must provide the createElement Function`);

    return {
        rootVNode: genElement(root, stack),
        nodesTreeMap: stack.nodesTreeMap,
        bindElement
    };
}

// 这里根据后面的需求可能会将renderClass该为options
function genElement(ast, stack) {
    let children = ast.children,

        // 元素标签已在生成抽象语法树时决定了
        tag = ast.tag;

    return stack.c(tag, handleEleAttr(tag, ast, stack),
    children.map(child => isTextSymbol(child) ? child.text : genElement(child, stack)));
}