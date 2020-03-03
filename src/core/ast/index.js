import { symbol2Tag, SingleSideSymbol, unarySymbol, specialRE } from '../constants'

export class MarkAst {
    constructor(symbol, raw, text, closed) {

        // 符号的字符串表达式
        this.symbol = symbol;

        // 匹配的整个原文本字段
        this.raw = raw;

        // 文本内容，仅纯文本具有该属性
        if (text) {
            this.text = text;
        } else {
            // 符号对应的标签，文本内容不具有标签
            this.tag = symbol2Tag[symbol];
        }
        this.closed = closed || false;
        this.parent = null;
        this.children = [];

        // 是否为一元标签
        this.special = false;
    }
}

export function createEleSymbol (symbol = '', raw = '', closed = false) {
    return new MarkAst(symbol, raw, void 0, closed);
}

export function isSingleSideSymbol(ast) {

    return !!(ast && ast.symbol && SingleSideSymbol[ast.symbol]);
}

export function isUnarySymbol (ast) {
    return !!(ast && ast.symbol && unarySymbol[ast.symbol]);
}

export function isTextSymbol(ast) {
    return ast && (typeof ast.text === 'string');
}

export function isQuoteSymbol (ast) {
    return ast && ast.symbol === '>';
}

export function isOlistSymbol (ast) {
    return ast && (ast.symbol === 'num');
}

export function isUlistSymbol (ast) {
    return ast && (ast.symbol === '+' || ast.symbol === '-');
}

export function isListItem(ast, parent) {
    return parent.raw.test(ast.symbol);
}

export function isSpecialSymbol (ast) {
    return specialRE.test(ast.symbol);
}

export function createTextSymbol(text) {
    return new MarkAst('text', text, text, true);
}

const H_RE = /^(#{1,5})$/;

// 收集h标签内部的文本消息
export function completeHInnerText (ast) {
    let children = ast.children;

    if (H_RE.test(ast.symbol)) {
        ast._innerText = collectInnerText(ast, '');
    }

    children.forEach(ast => {
        if (!isTextSymbol(ast)) {
            completeHInnerText(ast, '');
        }
    });

    function collectInnerText (ast, text) {
        let children = ast.children;

        text += children.map(ast => {
            if (isTextSymbol(ast)) {
                return ast.text;
            }
            return collectInnerText(ast, '');
        }).join('');

        return text;
    }
}
