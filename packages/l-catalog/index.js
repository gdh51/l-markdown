import LCatalog from './src/index.vue'

LCatalog.install = function (Vue) {
    Vue.component(LCatalog.name, LCatalog);
};

export default LCatalog;