<template>
    <nav class="catalog-container">
        <l-gradient-color class="sub_item-subtitle catalog-title"
                           :selected="nodesTreeRoot.selected"
                           :title="nodesTreeRoot.text"
                           @click.native="focusHeading(nodesTreeRoot)">
            {{ nodesTreeRoot.text }}
        </l-gradient-color>

        <!-- 这里用递归组件生成子项目 -->
        <sub-list :subChildren="nodesTreeRoot.children"
                  :state-interface="stateInterface"/>
    </nav>
</template>

<style lang="stylus" scoped>
.catalog-container
    width 250px
    font-size 14px
    position fixed
    right 0

    .catalog-title
        padding 4px
        font-size 16px
        font-weight bold
        text-align left
</style>

<script>
import SubList from './components/sub-list'
import LGradientColor from '../../l-gradient-color/src/index.vue'
import { initCatalogCom } from './util/state'

export default {
    name: 'LCatalog',

    props: {
        // 设置阈值当屏幕上方到达元素什么位置时开始切换标题
        threshhold: {
            type: Number,
            default: 0
        },

        nodesTreeMap: {
            type: Array,
            default () {
                return [{
                    text: '无标题',
                    children: [],
                    selected: true
                }];
            }
        }
    },

    components: {
        SubList,
        LGradientColor
    },

    computed: {
        stateInterface () {
            return initCatalogCom(this.nodesTreeMap, {
                threshhold: this.threshhold
            });
        },

        nodesTreeRoot () {
            return (this.nodesTreeMap[0] || {});
        }
    },

    methods: {
        focusHeading (node) {
            this.stateInterface && this.stateInterface.jumpToHeading(node);
        }
    }
}
</script>