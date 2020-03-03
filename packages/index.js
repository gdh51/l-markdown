import LMarkdown from './packages/l-markdown/src/index.vue'
import LMdArticle from './packages/l-md-article/src/index.vue'
import LGradientColor from './packages/l-gradient-color/src/index.vue'

const Components = [LMarkdown, LMdArticle, LGradientColor];

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
    LMdArticle,
    LGradientColor
};
