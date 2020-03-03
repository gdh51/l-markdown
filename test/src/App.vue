<template>
    <div id="app">
        <l-gradient-color>sdsd</l-gradient-color>
        <LCatalog :nodesTreeMap="a"
            :nodesTreeRoot="b"></LCatalog>
        <LMarkdown :text="`# sdsds\n
## sdasdsdsd
s
s
s
s
s
## sdsd s
## sadasds
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s
s

`"
                    :transformTotree="true"
                    @md-dom-tree="re"></LMarkdown>
    </div>
</template>

<style lang="stylus" scoped>
    #app
        width 100%
        height 100%

        .app_container
            width 80%
            height 500px
            padding-top 220px
            margin 0 auto
            background-size cover
</style>

<script>

export default {
    name: 'App',

    data () {
        return {
            text: '',
            a: void 0,
            b: void 0
        };
    },

    methods: {
        re(e) {
            this.a = e.nodesTreeMap
            this.b= e.nodesTreeRoot
        }
    }
}
</script>