<style lang="stylus" scoped>

</style>

<script>
/**
 * Markdown 组件，接收一个文本信息，将其格式化为DOM元素返回，
 * 可以接收两个可选参数，第一个即markdown文本
 * 第二个是对应DOM元素时添加的Class
 */
import { Markdown } from '../../../src/index'
import { defaultClass } from './constants'
import './default-style.stylus'

export default {
    name: 'LMarkdown',

    props: {
        text: {
            type: String,
            default: ''
        },

        // 定义渲染出来的DOM元素上添加的class
        renderClass: {
            type: Object,
            default () {
                return defaultClass;
            }
        },

        transformTotree: {
            type: Boolean,
            dafault: false
        }
    },

    render (c) {
        if (this.$slots.default && Object.keys(this.$scopedSlots).length > 0) {
            throw Error('不能设置插槽');
            return null;
        }

        // 初始化一次Markdown实例
        if (!this.md) {
            this.md = new Markdown({
                mode: 'vnode',
                createElement: c,
                renderClass: this.renderClass,
                transformTotree: this.transformTotree
            });
        }

        this.mdRenderHelper = this.md.compile(this.text);
        return this.mdRenderHelper.rootVNode;
    },

    data () {
        return {

            // 一个函数，用于将生成的ast树和元素绑定
            mdRenderHelper: null,

            // markdown实例
            md: null
        };
    },

    mounted () {
        this.initNodesOfDOM();
    },

    updated () {
        this.initNodesOfDOM();
    },

    methods: {
        initNodesOfDOM () {
            let mdRenderHelper = this.mdRenderHelper,
                root = mdRenderHelper.nodesTreeMap && mdRenderHelper.nodesTreeMap[0];

            // 必须保证开启的情况下且，map中节点为TreeNode节点
            if (this.transformTotree && root && typeof root.order === 'string') {

                // 将属性目录对应节点与DOM文章的DOM元素绑定
                mdRenderHelper.bindElement(mdRenderHelper.nodesTreeMap ,this.$refs);

                // 挂载完毕后将文章的标题元素暴露接口给外部
                this.$emit('md-dom-tree', mdRenderHelper.nodesTreeMap);
            }
        }
    }
}
</script>