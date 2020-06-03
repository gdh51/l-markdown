import {
    isTextSymbol
}
from "../../../core/ast/index";

const Escape = '\\';

// 当前AST对象是否代表转义符
function isEscape(ast) {

    if (!isTextSymbol(ast)) return false;

    // 首先保证它不是已转义过的文本
    // 其次保证普通文本的最后个字符不为\
    return !(ast.isEscape) && ast.text.substr(-1) === Escape;
}

// 解析[]()的内部内容
export function parseLinkCtx(reg, unhandleTemplate, parseLexer) {
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

        // 两个都不具有转义符号时，该symbol才能成立
        isEstablish,
        match,
        symbolMsg: [link, title]
    };
}