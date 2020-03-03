import LMarkdown from './src/index.vue'

LMarkdown.install = function (Vue) {
    Vue.component(LMarkdown.name, LMarkdown);
};

export default LMarkdown;