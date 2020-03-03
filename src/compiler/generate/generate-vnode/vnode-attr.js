import {
    createTreeNode,
    isSameType,
    setParent
} from './tree-node';
import { assignRenderClass } from '../../../core/handle-class'

const titleRE = /^(\#{1,5})$/;

export function handleEleAttr(tag, ast, stack) {
    let opts = stack.opts;

    // 处理class
    const attr = assignRenderClass(opts.renderClass, ast);

    // 处理顶级标签，Vue中自动获取h标签对应的元素，除非用户主动关闭
    if (opts.transformTotree && titleRE.test(ast.symbol)) {
        attr.ref = genHRef(stack, tag, ast);
    }

    // 处理一元标签的属性
    if (ast.special) {
        attr.attrs = ast.special;
    }

    return attr;
}

function genHRef(stack, tag, ast) {

    // 存储h1根节点
    if (tag === 'h1') {
        let rootNode = createTreeNode(tag, ast._innerText, '0');
        stack.nodesTreeRoot = rootNode
        stack.nodesTreeMap.push(rootNode);
        stack.prevNode = rootNode;
        return '0';
    }

    // 当前标签的等级，即h几
    let target = Number(tag.substr(1)),
        node = null,
        ref;

    // 创建节点
    node = createTreeNode(tag, ast._innerText);


    if (stack.prevHlevel > target) {

        // 因为此时不能定位其父节点，所以要重新查找
        setParent(node, redirectParentNode(node, stack));

        // 当设置下级标签时，例如之前为h2现在设置h3
    } else if (stack.prevHlevel < target) {
        setParent(node, stack.prevNode);

        // 当设置平级标签时，即之前设置h2现在仍然设置h2
    } else {
        setParent(node, stack.prevNode.parentNode);
    }

    // 要待节点生成后来处理ref，因为用户书写等级标签可能不会按1-5顺序书写，
    // 可能会存在跳跃，上面已经处理外节点的属性结构，此时我们只需要知道深度即可
    // 假如为h5，则生成1-1-1-1-
    ref = sniffRealRef(node, stack, target);

    // 处理完当前节点后更新上一个节点，并将其加入map中
    stack.nodesTreeMap.push(node);
    stack.prevNode = node;
    stack.prevHlevel = target;

    // 去掉末尾的-返回
    return ref;
}


// 重置指定 h + level标签以下的下级标签计数
function resetHRefStack(refStack, level) {
    let fullH = 5;
    if (!level) level = 2;

    // 只清空到当前h的等级
    while (level !== fullH) {
        refStack['h' + fullH] = 0;
        fullH--;
    }
}


function redirectParentNode(node, stack) {
    let nodesTreeMap = stack.nodesTreeMap,
        start = nodesTreeMap.length - 1;
    // 因为每创建一个节点会将节点加入nodesTreeMap中，
    // 所以此处我们想找到当前node的上一个同级节点即可
    // 它们一定有共同的父节点
    while (start) {
        if (isSameType(node, nodesTreeMap[start])) {
            return nodesTreeMap[start].parentNode;
        }
        start--;
    }

    // 当无法找到同级节点时返回h1节点
    return nodesTreeMap[0];
}

function sniffRealRef(node, stack, target) {
    let start = 2,
        end = 1,
        refStack = stack.hRefs,
        originNode = node,
        ref = '';

    // 真正的要处理的标签应该为差集，比如h1 - h2 - h4，
    // 那么当前起始等级为2, 目标等级应该为3
    while (node.tag !== 'h1') {
        end++;
        node = node.parentNode;
    }

    // 每次进入时，增加嗅探出来的计数增加1
    refStack['h' + end] += 1;

    while (end >= start) {
        ref += `${refStack['h' + start]}-`;
        start++;
    }

    ref = ref.slice(0, -1);
    originNode.order = ref;

    if (stack.prevHlevel > target) {

        // 当回溯h标签等级时，清空下级的所有标签
        resetHRefStack(refStack, target);
    }

    return ref;
}