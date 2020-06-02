<template>
    <div id="app">
        <l-gradient-color>sdsd</l-gradient-color>
        <LCatalog :nodesTreeMap="a"></LCatalog>
        <LMarkdown :text="`# sdsds
    - sds
- sds1
    - sdsd2
        - sdsd3
        - sdsd3
        - cccc
sidjsijd
            - sdsdsd4
        - sdsd5
    - sdsd6
    1. sdsd1
    3. sds 2
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
            this.a = e
        }
    }
}
</script>