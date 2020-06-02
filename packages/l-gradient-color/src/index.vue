<template>
    <a class="gradient-bg ellipsis"
      :class="[warpperClass, selected ? 'active' : '']"
       href="javascript:void 0;"
       ref="wrapperEl"
      :style="`background-size: ${backSize}`"
      :title="title">
        <slot></slot>
    </a>
</template>

<style lang="stylus" scoped>
gradientColor()
    border-radius 5px
    background-image linear-gradient(45deg, #feac5e, #c779d0, #4bc0c8, #feac5e, #c779d0, #4bc0c8)
    animation gradientColor 3s linear infinite

@keyframes gradientColor {
    0 {
        background-position 0 0
    }

    100% {
        background-position 80% 0
    }
}

.gradient-bg
    display block
    cursor pointer
    color inherit
    text-decoration none

    &:hover
        gradientColor()

.active
    color #fff
    gradientColor()

.ellipsis
    word-wrap break-word
    text-overflow ellipsis
</style>

<script>
export default {
    name: 'LGradientColor',

    props: {
        warpperClass: {
            type: [Array, Object, String],
            default: ''
        },

        selected: {
            type: Boolean,
            default: false
        },

        title: {
            type: String
        }
    },

    data () {
        return {
            backSize: '1000px'
        };
    },

    mounted () {

        // 这里需要根据容器大小来觉得动画的宽度
        let elWidth = this.$refs.wrapperEl.getBoundingClientRect().width;
        if (elWidth) {
            this.backSize = elWidth * 5 + 'px';
        }
    }
}
</script>