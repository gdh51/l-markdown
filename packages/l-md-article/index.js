import LMdArticle from './src/index.vue'

LMdArticle.install = function (Vue) {
    Vue.component(LMdArticle.name, LMdArticle);
};

export default LMdArticle;