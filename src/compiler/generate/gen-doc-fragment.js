import { isTextSymbol } from '../../core/ast/index'
import { symbol2Tag } from '../../core/constants'
import { addClass } from '../../core/handle-class'
import { setAttr } from '../../core/uitl/index'

export function generateDocFragment(root, options) {
    let frame = document.createDocumentFragment(),
        rootEle = document.createElement('article');

    frame.appendChild(rootEle);

    transform2Node(root, rootEle, options.renderClass);

    return frame;
}

function transform2Node(ast, parent, renderClass) {
    let children = ast.children,
        child = null;

    for (child of children) {
        let tag = '',
            node = null;

        // 处理文本节点
        if (isTextSymbol(child)) {
            node = document.createTextNode(child.text);

            // 普通元素节点
        } else {
            tag = symbol2Tag[child.symbol];
            node = document.createElement(tag);

            // 如果用户定义各元素的类，那么为元素添加类
            renderClass[tag] && addClass(node, renderClass[tag]);

            // 处理一元标签的属性
            if (ast.special) {
                setAttr(node, ast.special);
            }
        }

        parent.appendChild(node);

        transform2Node(child, node, renderClass);
    }
}

export function generateInnerHTML(root, opts) {
    let doc = generateDocFragment(root, opts);
    return doc.firstElementChild.outerHTML;
}