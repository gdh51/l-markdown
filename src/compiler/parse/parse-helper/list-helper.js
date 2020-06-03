import {
    createEleSymbol,
    isUlistSymbol
} from '../../../core/ast/index'
import { setParent } from './index';
import { isUndefined } from '../../../core/util/index'

const olSymbolRE = /\d+\./;

/**
 * 列表语法解析函数，当解析到li标签时，
 * 则之后的模版解析不直接通过原始解析器进行解析， 改为在此内部解析
 * @param {String} template 当前剩余的要解析的模版
 * @param {Function} parseLexer 原全语法解析函数
 */
export function parseListCtx(template, parseLexer) {
    let liRE = new RegExp(`^(\\x20*)(\\-|\\+|\\d+\\.)\\x20([^\\n]*)\\n`),
        continueRE = /^(\x20*)([^\n]*)\n/,

        // 存放li元素，li元素会携带本元素的空格缩进数量
        stack = [];

    parseList();

    return {

        // 返回生成的列表根节点
        listRoot: stack[0].parent,

        // 返回剩余的模版
        template
    };

    function parseList() {

        // 生成li的匹配表达式
        let advance = 0,

            // 本次匹配的整体文本
            fullMatch,

            // 本次匹配的内容部分
            content,

            // 用于存放不会被使用的变量
            noop;


        while (true) {

            // 匹配到新的li标签
            if (liRE.test(template)) {
                let match = template.match(liRE),

                    // 缩进长度
                    depth,

                    // 列表符号
                    symbol,
                    targetDepth = 0;

                // 获取当前匹配的li标签的缩进长度、符号和具体内容
                [fullMatch, depth, symbol, content] = match;
                depth = depth.length;
                advance = fullMatch.length;

                // 确定当前li标签的应该存在stack中的位置
                targetDepth = computeListPos(depth, stack);

                // 先创建列表项节点
                let li = createEleSymbol(symbol, symbol, true),

                    // 当前列表元素是否和之前的列表元素是否不同
                    isSameList = void 0,
                    isOlist = olSymbolRE.test(symbol);

                // 处理有序列表元素不能直接通过map匹配标签的问题
                if (isOlist) {
                    li.tag = 'li';
                }

                // 解析li标签中的子内容
                parseLexer(content, false, false, li);

                /**
                 * 判断是否有和当前li标签同级的标签：
                 * 是， 则先判断是否为同类型列表标签，
                 * 如果是同类型， 直接创建后替换stack中同等级元素，
                 * 如果不是， 则创建新列表加入当前li元素的子节点数组中
                 * 不是， 则创建新列表加入stack中
                 */
                if (stack[targetDepth] && (isSameList = !isDiffList(symbol, stack[targetDepth]))) {
                    setParent(li, stack[targetDepth].parent);
                } else {

                    // 当需要创建新的有序列表时，
                    let newList = createEleSymbol(isUlistSymbol(symbol) ? 'ul' : 'ol', void 0, true);
                    setParent(li, newList);

                    // 设置新表格与上一级li标签关系
                    // isSameList在这里只会是undefined或false两种情况
                    // 当为undefined时，说明为新增的深度的列表，此时有两种情况：初次创建或创建嵌套列表
                    // 当为false时，说明为同深度但不同类型的列表
                    if (stack.length) {
                        setParent(newList, isUndefined(isSameList) ? stack[targetDepth - 1] : stack[targetDepth].parent.parent);
                    }

                    if (isOlist && !startWith1(li)) {
                        (newList.attrs = newList.attrs || {}).start = li.symbol.slice(0, -1);
                    }
                }

                // 清空栈中之后深度的标签
                stack[targetDepth] = li;

                // 截断记录栈
                stack.length = targetDepth + 1;
                li.depth = depth;

            // 匹配li标签中的内容
            } else if (continueRE.test(template)) {

                [fullMatch, noop, content] = template.match(continueRE);
                advance = fullMatch.length;

                // 创建一个br换行元素
                setParent(createEleSymbol('', '', true, 'br') ,stack[stack.length - 1]);

                parseLexer(content, false, false, stack[stack.length - 1]);

                // 未匹配到任何情况时，闭合列表标签并退出
            } else {

                // 去除掉换行符
                template = template.slice(1);
                break;
            }

            // 截取剩余模版
            template = template.slice(advance);
        }
    }
}

// 计算当前li元素应该处于深度stack的位置
// 注意，当为新深度时，返回的下标会超出stack下标的取值范围
function computeListPos(depth, stack) {
    let times = stack.length;

    if (!times) return 0;

    // 当为有序递增的深度时，则直接添加到最后一个即可。
    if (depth > stack[times - 1].depth) {
        return times;
    }

    // 其余情况则为之前出现的深度中的一种
    while (times--) {

        // 当前深度为某个已存在的深度时
        if (depth === stack[times].depth) {
            return times;

        // 当当前的深度不为正常深度时（正常深度应该是等同的），
        // 而此时的深度处于上一个深度与当前深度的区间之中，将其视为上一个深度
        } else if (depth > stack[times].depth) {
            return times + 1;
        }
    }

    // 没有匹配到任何深度时，认为其为根列表的li元素
    return 0;
}

// 判断当前列表元素类型是否与上一个列表元素类型相同
function isDiffList(currentSymbol, lastAst) {

    // 两个都为有序列表时，则说明为同一类型列表
    if (olSymbolRE.test(currentSymbol) && olSymbolRE.test(lastAst.symbol)) {
        return false;
    }

    return currentSymbol !== lastAst.symbol;
}

// 判断前后两个有序列表项是否连续
function isContinuous(current, last) {
    return current.symbol.slice(0, -1) - last.symbol.slice(0, -1) === 1;
}

// 判断有序列表是否以1为起始序号
function startWith1(current) {
    return current.symbol.slice(0, -1) === '1';
}
