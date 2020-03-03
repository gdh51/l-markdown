import { throttle } from './uitl'

export function initObserveScroll (nodeState, threshhold) {

    // 第一个节点的位置信息我们一定知道，所以将它存储在闭包中
    let nodesMap = nodeState.getNodesMap(),
        firstNodeY = nodesMap[0].y,
        lastNode = nodesMap[nodesMap.length - 1],
        invoker = throttle(scrollArticle, null, 500);

    window.addEventListener('scroll', invoker);

    return {
        unregisterOb () {
            window.removeEventListener('scroll', invoker);
        }
    };

    function scrollArticle() {
        const ScrollTop = window.scrollY;
        selecteWatchNode({
            scrollTop: ScrollTop,

            // 用于查询当前节点DOM元素位置的函数
            scrollCachedFn: nodeState.scrollCachedFn,
            firstNodeY,
            lastNode,
            nodesMap,
            prevNodeIndex: nodeState.getCurrentWatchIndex(),
            threshhold,
            updatePrevNode: nodeState.updatePrevNode
        });
    }
}

// 返回当前滚动的方向，1为向下，0为向上
function getScrollDirection (prev, cur) {
    return cur - prev >= 0 ? 1 : 0;
}

// 计算当前滚动位置处于的目录项
function selecteWatchNode ({
    prevNodeIndex,
    nodesMap,
    scrollTop,
    firstNodeY,
    lastNode,
    scrollCachedFn,
    updatePrevNode,

    // 阀口值，设置scrollTop相对于视窗的起始位置
    threshhold = 0
}) {
    let prevNodeY = nodesMap[prevNodeIndex].y,

        // 最后一个节点的位置情况
        lastNodeY = lastNode.y || 0,
        lastIndex = nodesMap.length - 1;

    updatePrevNode(nodesMap[computeClosestIndex()]);


    function computeClosestIndex() {

        // 获取滚动方向
        let dir = getScrollDirection(prevNodeY, scrollTop),
            index;

        // 向上滚动
        if (!dir) {

            // 如果当前滚动位置处于之前节点上方近点位置
            if ((prevNodeY - firstNodeY) / 2 < scrollTop) {
                index = prevNodeIndex;
                while (index >= 0) {

                    // 找到第一个在屏幕上方的元素(即未出现在屏幕上)
                    // 那么当前滚动位置肯定在这个板块中
                    if (scrollCachedFn(nodesMap[index]) + threshhold <= scrollTop) {
                        return index;
                    }
                    index--;
                }

                // 未找到时返回第一个节点
                return 0;
            }  else {

                // 这里就是当前滚动位置处于第一个节点近点
                // 此时遍历的节点一定是全部获得了位置信息的
                index = 0;

                while (index <= prevNodeIndex) {

                    // 当找到第一个出现在屏幕中的节点时，
                    // 那么它肯定出现在上一个节点的板块中
                    if (scrollCachedFn(nodesMap[index]) - threshhold > scrollTop) {
                        return --index >= 0 ? index : 0;
                    }
                    index++;
                }

                return prevNodeIndex;
            }
        }

        // 向下滚动，首先确认最后个节点的位置信息是否获得，
        // 没有获得时，我们只能从当前节点向下一个个获取
        // 如果已经获取了最后个节点的信息，那么我们检测当前滚动位置是否更靠近最后个节点
        if (lastNodeY && (lastNodeY - prevNodeY) / 2 + prevNodeY < scrollTop) {

            // 当前滚动位置处于末尾节点近点位置
            index = lastIndex;

            while (index >= prevNodeIndex) {
                if (scrollCachedFn(nodesMap[index]) + threshhold <= scrollTop) {
                    return index;
                }
                index--;
            }

            // 未找到则说明为当前节点
            return prevNodeIndex;
        } else {

            // 当前节点处于之前节点附近
            index = prevNodeIndex;

            while (index <= lastIndex) {

                // 那么找到第一个出现在屏幕中的节点，则它处于上一个节点的板块中
                if (scrollCachedFn(nodesMap[index]) - threshhold > scrollTop) {
                    return --index >= 0 ? index : 0;
                }
                index++;
            }

            // 未找到则返回最后一个节点
            return lastIndex;
        }
    }
}