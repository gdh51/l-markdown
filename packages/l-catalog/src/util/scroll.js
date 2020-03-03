// 处理浏览器跳转也面兼容性问题
function initScrollTo() {
    return function (y) {
        if (window.scrollTo) {
            return window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }

        window.scrollTop = y;
    };
}

let scrollToY = initScrollTo();


// 点击标题跳转到对应的元素
export function initScroll (orderToNodeMap) {

    return {
        scrollToOrder (node) {
            scrollToY(scrollCachedFn(node));
        },
        scrollCachedFn
    }

    function scrollCachedFn (node) {
        let hit = node.y;

        // 命中缓存，直接返回
        return hit || (node.y = gainEleScrollTop(node.el));
    }
}

// 封装Rect Api
function gainEleScrollTop (el) {
    return el.getBoundingClientRect().top + window.scrollY;
}

export function initSelectedNode (NodesMap) {

    // 获取当前屏幕高度
    const ScrollY = window.scrollY;
    let currentNodeScrollY = 0,
        index = 0,
        currentNode;

    // // 如果初始化时在屏幕顶部，则要单独获取
    // if (ScrollY <= 0) currentNode.y = gainEleScrollTop(currentNode.el);

    // 找到第一个出现屏幕上的元素，那么上一个元素则为当前目录处于的位置
    while (currentNodeScrollY < ScrollY) {
        currentNode = NodesMap[index++];

        // 存储当前节点的高度，用于下一次计算
        currentNodeScrollY = currentNode.y = gainEleScrollTop(currentNode.el);
    }

    // 当为顶级标题时，返回顶级标题
    index = (index-= 2) >= 0 ? index : 0;

    return {
        selectedNode: NodesMap[index],
        index
    };
}