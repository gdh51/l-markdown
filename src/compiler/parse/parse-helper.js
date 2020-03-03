import {
    createEleSymbol,
    isTextSymbol
}
from "../../core/ast/index";

const Escape = '\\';

// 当前AST对象是否代表转义符
function isEscape(ast) {

    if (!isTextSymbol(ast)) return false;

    // 首先保证它不是已转义过的文本
    // 其次保证普通文本的最后个字符不为\
    return !(ast.isEscape) && ast.text.substr(-1) === Escape;
}

// 解析[]()的内部内容
export function parselinkctx (reg, unhandleTemplate, parseLexer) {
    let match = unhandleTemplate.match(reg),
        title,
        link,

        // 该[]()或![]()语法是否成立
        isEstablish = true;

    // 分别解析其内容的内联元素模块
    title = parseLexer(match[2], true).children;
    link = parseLexer(match[4], true).children;

    // 查看文本的最后位字符是否为转义符
    if (isEscape(title[title.length - 1])) {
        isEstablish = false;
        title[title.length - 1].text = title[title.length - 1].text.slice(0, -1);
    } else if (isEscape(link[link.length - 1])) {
        isEstablish = false;
        link[link.length - 1].text = link[link.length - 1].text.slice(0, -1);
    }

    // 检查文本的最后是否为转义符号，如果是那么当前不能处理为一元标签
    return {
        title,
        link,

        // 两个都不具有转义符号时，该symbol才能成立
        isEstablish,
        match
    }
}

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

export function generateParagraph(root, startIndex) {
    let textArray = root.children.splice(startIndex),
        pAst = createEleSymbol('p', '', true);

    // 为这些文本设置父节点为段落节点
    setParent(textArray, pAst);

    // 将锻炼节点添加到根节点数组中
    setParent(pAst, root);
}

export function parseCodeCtx (reg) {

}