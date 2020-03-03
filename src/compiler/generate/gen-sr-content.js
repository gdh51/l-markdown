import { isTextSymbol, isUnarySymbol, isSpecialSymbol } from '../../core/ast/index'
import { assignTextClass } from '../../core/handle-class'

export function genSRContent (root, opts) {
    return run(root, opts, '');
}

function run (ast, opts, template) {
    let children = ast.children;

    children.forEach(child => {
        if (isTextSymbol(child)) {
            template = run(child, opts, template);
        } else {
            template += run(child, opts, '');
        }
    });

    if (isTextSymbol(ast)) {
        template = generateText(ast.text, template);
    } else {

        // 一元标签处理
        if (isUnarySymbol(ast)) {
            template = generateUnaryTag(ast, template, opts.renderClass);
        } else {
            template = generateTag(ast, template, opts.renderClass);
        }
    }

    return template;
}

function generateTag (ast, template, renderClass) {
    return `<${ast.tag}${assignTextClass(ast, renderClass)}${handleSpecial(ast)}>${template}</${ast.tag}>`
}

function generateText (text, template) {
    return template + text;
}

function generateUnaryTag (ast, template, renderClass) {
    return template + `<${ast.tag}${assignTextClass(ast, renderClass)}${handleSpecial(ast)}/>`;
}

function handleSpecial(ast) {
    if (isSpecialSymbol(ast)) {
        return `${generateSpecialAttr(ast.special)} `
    }

    return ''
}

function generateSpecialAttr (special) {
    return Object.keys(special).map(key => ` ${key}="${special[key]}"`).join('');
}