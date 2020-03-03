<template>
    <div>
        <l-md-catalog :md-root-node="mdApi.nodesTreeRoot"
                    :md-nodes-map="mdApi.nodesTreeMap"
                    :threshhold="threshhold"/>
        <l-markdown :text="text"
                   :render-class="renderClass"
                   :transformTotree="true"
                   :wapper-class="layoutClass"
                   @md-dom-tree="exposeMDApi"/>
    </div>
</template>

<script>
import LMarkdown from '../../l-markdown/src/index.vue'
import LMdCatalog from './components/l-md-catalog'

export default {
    name: 'LMkArticle',

    props: {

        // 传入的用于解析markdown的文本
        text: {
            type: String,
            default: ''
        },

        // 设置阈值当屏幕上方到达元素什么位置时开始切换标题
        threshhold: {
            type: Number,
            default: 0
        },

        // 用于定义渲染出的markdown的class
        renderClass: {
            type: Object
        },

        // 右边目录的Class，左边内容区域可以通过renderClass来控制
        layoutClass: {
            type: [Array, String, Object],
            default: ''
        }
    },

    components: {
        LMarkdown,
        LMdCatalog
    },

    data () {
        return {
            mdApi: {
                nodesTreeRoot: {
                    text: '无标题',
                    children: [],
                    selected: true
                },

                nodesTreeMap: []
            }
        };
    },

    methods: {
        exposeMDApi (mdApi) {
            this.mdApi = mdApi;
        }
    }
}
</script>