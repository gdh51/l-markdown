import LMarkdown from './l-markdown/src/index.vue'
import LCatalog from './l-catalog/src/index.vue'
import LGradientColor from './l-gradient-color/src/index.vue'

const Components = [LMarkdown, LCatalog, LGradientColor];

function install (Vue, opts = {}) {
    Components.forEach(component => {
        Vue.component(component.name, component);
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    LMarkdown,
    LCatalog,
    LGradientColor
};
