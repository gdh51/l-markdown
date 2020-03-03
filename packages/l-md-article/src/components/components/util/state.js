import Vue from 'vue'
import {
    initSelectedNode,
    initScroll
} from './scroll'
import { initObserveScroll } from './ob-scroll'
import { extend } from './uitl'

// 存储observable接口
const observable = Vue.observable;

function initNodeState (NodesMap) {

    // 获取被选中的节点更新其状态为选中
    let {
        selectedNode,
        index
    } = initSelectedNode(NodesMap);

    selectedNode.selected = true;

    // 存储上一个被点击的标题，好用于在下一个节点被点击时清空当前节点的状态
    const listState = {
        prevSelectedNode: selectedNode,

        // 一个数组，节点按DOM顺序排列
        nodesMap: NodesMap,

        // 当前用户屏幕位置处于的目录对应的节点下标
        currentWatchIndex: index,

        // 一个对象，可以直接通过等级查找对应节点，比如1-1找到h3节点
        orderToNodeMap: initOrderMap(NodesMap)
    };

    observable(listState);

    return {

        // 将被选中的节点设为被选中状态
        updatePrevNode (node) {

            // 解除之前节点的选中状态
            listState.prevSelectedNode.selected = false;
            listState.prevSelectedNode = node;

            // 不忘更新被选中的状态，但要在最后更新，防止是同一节点
            node.selected = true;
        },

        getOrderMap () {
            return listState.orderToNodeMap;
        },

        getCurrentWatchIndex () {
            return listState.currentWatchIndex;
        },

        getNodesMap () {
            return listState.nodesMap;
        }
    };
}

function initOrderMap (NodesMap) {
    let node = null,
        orderMap = {};
    for (node of NodesMap) {
        orderMap[node.order] = node;
    }

    return orderMap;
}

// 初始目录组件接口，只需要传入MD文章的节点Map
export function initCatalogCom (NodesMap, opts = {}) {

    // 返回undefined，好让其他组件使用默认值
    if (NodesMap.length === 0) return void 0;

    const NodeState = initNodeState(NodesMap);

    // 合并接口
    extend(NodeState, initScroll(NodeState.getOrderMap()));
    extend(NodeState, initObserveScroll(NodeState, opts.threshhold));

    return {

        // 用于点击跳转至指定的node
        jumpToHeading (node) {
            let {
                scrollToOrder,
                updatePrevNode
            } = NodeState;
            scrollToOrder(node);

            // 清空上一个节点被点击的状态，并选中当前节点
            updatePrevNode(node);
        }
    };
}

