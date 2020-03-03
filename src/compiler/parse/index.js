import {
    reviseEndNewline,
    isUndefined,
    reviseTopic
} from '../../core/uitl'
import {
    createEleSymbol,
    createTextSymbol,
    isSingleSideSymbol
} from '../../core/ast/index'
import {
    escapeRE,
    titleLevelRE,
    quoteRE,
    shortCodeRE,
    asteriskRE,
    delRE,
    text,
    newline,
    imgRE,
    linkRE,
    olistRE,
    ulistRE,
    codeRE
} from '../../core/constants'
import {
    parselinkctx,
    setParent,
    generateParagraph
} from './parse-helper'

export function parseLexer(template, inline = false, init = false) {

    // 规范语法
    template = reviseEndNewline(template);

    let unhandleTemplate = template,
        index = 0,
        times = 0,

        // 从栈底开始数，第一个文本标签的前一个标签的下标，
        // 用于将后面的文本生成段落，记录的是在root对象子数组中的下标
        pStartIndex = 0,

        // 定义一个根节点，方便处理数据
        lastAst = createEleSymbol('root'),
        stack = [lastAst];

    if (init) {
        // 用户必须传入一级标题
        reviseTopic(lastAst, template);
    }

    while (!!unhandleTemplate) {

        times++
        if (times >= 100) return new Error('???');

        // 处理转义字符
        if (escapeRE.test(unhandleTemplate.match(escapeRE))) {
            let match = unhandleTemplate.match(escapeRE),
                ast = createTextSymbol(match[1]);

            // 标记当前AST对象为转义对象
            ast.escape = true;
            setParent(ast, lastAst);
            advance(index, match[0].length);
            continue;
        }

        // 在内联解析时，块级元素的解析进行参与
        if (!inline) {

            // 匹配#题目标签
            if (titleLevelRE.test(unhandleTemplate)) {
                singleMatch(titleLevelRE);
                continue;
            }

            // 匹配>引用内容
            if (quoteRE.test(unhandleTemplate)) {
                singleMatch(quoteRE, true);
                continue;
            }

            // 匹配无序列表
            if (ulistRE.test(unhandleTemplate)) {
                singleMatch(ulistRE).innerClass = true;
                continue;
            }

            // 匹配有序列表
            if (olistRE.test(unhandleTemplate)) {
                singleMatch(olistRE, null, 'num').innerClass = true;
                continue;
            }

            if (codeRE.test(unhandleTemplate)) {
                codeMatch(codeRE);
                continue;
            }
        }

        // 处理`xx`的短代码标签
        if (shortCodeRE.test(unhandleTemplate)) {
            pairsMatch(shortCodeRE);
            continue;
        }

        // 匹配*与**语法，每次匹配时会贪婪匹配，所以当匹配**时，不会匹配为*
        if (asteriskRE.test(unhandleTemplate)) {
            pairsMatch(asteriskRE);
            continue;
        }

        // 匹配~与~~语法
        if (delRE.test(unhandleTemplate)) {
            pairsMatch(delRE);
            continue;
        }

        // 处理[]()
        if (linkRE.test(unhandleTemplate)) {
            linkMatch(linkRE, 'link', ['title', 'href'])
            continue;
        }

        // 处理![]()
        if (imgRE.test(unhandleTemplate)) {
            linkMatch(imgRE, 'img', ['alt', 'src']);
            continue;
        }

        // 如何截取文本？首先经过上面的排除，我们第一个字符肯定不为特殊符号。
        // 那么我们只需要找到后面第一个特殊符号位置停止即可。
        if (text.test(unhandleTemplate)) {
            let textMatch = unhandleTemplate.match(text);

            // 对于文本，我们直接将其存入当前栈顶标签对象的子节点数组中
            setParent(createTextSymbol(textMatch[0]), lastAst);

            advance(index, textMatch[0].length);
            continue;
        }

        // 处理换行符号，换行符可以闭合栈中任何未闭合的标签，换行符之间为一个段落
        if (newline.test(unhandleTemplate)) {

            closeSymbol();
            advance(index, unhandleTemplate.match(newline)[1].length);
        }
    }

    return stack[0];


    // 更新模版，和当前在原始模版中的下标
    function advance(start, step) {

        // 更新当前模版在原模版中的下标b
        index = start + step;

        // 更新剩余要处理的模版
        unhandleTemplate = template.slice(index);
    }

    // 更新父级AST对象
    function updateLastAst(target) {

        // 未传入目标时，自动更新为当前栈的最后一个
        if (!target) return lastAst = stack[stack.length - 1];

        // 传入目标时，在栈中存放当前标签
        stack.push(target);

        // 将当前栈最顶层标签更新
        return lastAst = target;
    }



    // 查找stack是否有与其成对的标签，如果存在则说明应该闭合它
    // symbol2用于处理这种情况**、****，symbolList[0]一定存储的是原匹配字符串
    function shouldCloseSymbol(symbolList) {
        let times = stack.length,
            currentSymbol,
            length = symbolList.length;

        while (times--) {
            currentSymbol = stack[times].symbol;

            for (let i = 0; i < length; i++) {

                // 返回匹配的符号与规则。
                if (currentSymbol === symbolList[i]) {

                    return [times, currentSymbol];
                }
            }
        }

        // 如果未找到则返回原符号
        return [false, symbolList[0]];
    }


    // `sada*as**da**sd`
    // 闭合标签，处理其中的父子关系以及其他栈中未闭合的标签
    function closeSymbol(indexInStack) {
        let stackSize = stack.length;

        // 未传入参数时，自动侦查并闭合所有标签(root根节点除外)
        if (isUndefined(indexInStack)) {

            // 对于一元标签，如#标题标签，闭合到当前标签
            indexInStack = 1;

            // 首先确认我们要闭合的标签的类型，二元标签要作为文本
            let isSingleSide = isSingleSideSymbol(stack[1]);

            // 对于除#这种一元标题外，其他要闭合的对象要当作文本处理
            if (!isSingleSide) {
                indexInStack = 0;
            } else {

                // 更新第一个文本出现的位置，其实就为root数组的长度
                // 仅在闭合一元标签时(也就是通过换行符闭合时)，更新该值
                pStartIndex = stack[0].children.length + 1;
            }
        }

        while (stackSize > indexInStack) {

            // 优先运算减操作，因为我们要取该坐标下的标签对象
            stackSize--;

            // 如果当前闭合的标签对象不为对应标签，则说明当前闭合的标签应该为一个文本
            if (stackSize !== indexInStack) {

                let currentSymbol = stack[stackSize],

                    // 当前闭合节点的上一个节点
                    prevSymbol = stack[stackSize - 1],
                    newTextSymbol = createTextSymbol(currentSymbol.symbol);

                // 将当前标签转化为文本，并与其子节点一起存放至其父节点数组后
                // 重新为其设置父节点与子节点数组信息
                setParent([].concat(newTextSymbol, currentSymbol.children), prevSymbol);
                continue;
            }

            // 当处理到根节点时(仅根节点处理时，会处理到0)，直接退出
            if (!stackSize) {
                stack.length = 1;

                // 为文本生成段落，仅在非内联元素中生成
                if (!inline) {
                    generateParagraph(stack[0], pStartIndex);

                    pStartIndex += 1;
                }
            } else {

                // 对于正常配对闭合的标签，直接闭合即可，然后截断stack栈。
                stack[indexInStack].closed = true;

                // 设置父子节点信息
                setParent(stack[indexInStack], stack[indexInStack - 1]);

                stack.length = indexInStack;
            }

            updateLastAst();
        }
    }

    // 匹配成对的符号规则
    function pairsMatch(reg) {
        // 这里我们内部处理这种特殊情况*s***sss**，这里意为匹配为斜体s 粗体sss
        let match = unhandleTemplate.match(reg)[1],
            shouldCloseIndex;

        // 匹配两个符号宽度的成对符号，如**xx**
        if (match.length === 2) {
            match = [match, match[0]];
        } else {

            // 匹配*
            match = [match];
        }

        [shouldCloseIndex, match] = shouldCloseSymbol(match);

        // 遇到配对的标签时，就可以出栈了
        if (shouldCloseIndex !== false) {

            // 闭合标签
            closeSymbol(shouldCloseIndex);
        } else {
            updateLastAst(createEleSymbol(match, match));
        }

        advance(index, match.length);
    }

    /**
     * 单行匹配， 即占整行的， 以换行符结尾
     * @param {RegExp} reg 匹配的正则表达式
     * @param {Boolean} isSame 匹配的对象是否就是符号，比如# 就要多匹配个空格，所以它不是
     * @param {String} symbol 是否直接指定了生成标签ast对象的符号，如有有则直接使用
     */
    function singleMatch(reg, isSame, symbol) {
        // 匹配到的对象
        let match = unhandleTemplate.match(reg),
            ast = createEleSymbol(symbol || match[isSame ? 0 : 1], match[0], true);

        // Match[1] 存放#，Match[0]存放#及其空格
        updateLastAst(ast);

        // 截取剩余的模版
        advance(index, match[0].length);

        return ast;
    }

    function linkMatch(reg, symbol, attrs) {
        // 获取匹配及其内容的处理结果
        let inlineResult = parselinkctx(reg, unhandleTemplate, parseLexer),
            match = inlineResult.match;

        // 如果当前的[]()语法成立
        if (inlineResult.isEstablish) {
            let ast = createEleSymbol(symbol, match[0], true),
                special = {};

            attrs.forEach((attr, index) => {
                special[attr] = match[index === 0 ? 2 : 4];
            });

            ast.special = special;

            setParent(ast, lastAst);
            if (symbol === 'link') {
                setParent(inlineResult.title, ast);
            }

        // 如果当前语法不成立，则全部转化为文本
        } else {
            setParent([createTextSymbol(match[1]),
                ...inlineResult.title,
                createTextSymbol(match[3]),
                ...inlineResult.link,
                createTextSymbol(match[5])
            ], lastAst);
        }

        // 截取剩余的模版
        advance(index, match[0].length);
    }

    function codeMatch (reg) {
        let match = unhandleTemplate.match(reg),
            OuterAst = createEleSymbol(match[1], match[0], true),
            innerAst = createEleSymbol('`', null, true);;

        innerAst.innerClass = true;

        // 设置pre->code->文本这种结构
        setParent(innerAst, OuterAst);
        setParent(createTextSymbol(match[3]), innerAst);
        setParent(OuterAst, lastAst);

        advance(index, match[0].length);
    }
}