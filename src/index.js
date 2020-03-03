import { initMarkdown } from './core/index'
import { compile } from './compiler/index'


/**
 * markdown编译器
 * @param {Object} options 初始化配置项，下面为具体配置
 * @param {String} mode md的编译模式，支持dom、vnode、text，默认为text
 * @param {Function} c md的vnode模式下，必要的创建Vnode的函数
 * @param {Object} renderClass 渲染各个元素可用的class对象
 * @param {Object} transformTotree vnode模式下，是否生成文章的ast对象树状结构，并且该模式下会返回相关的数据帮助绑定对应元素
 */
export class Markdown {
    constructor(options = {}) {
        if (!(this instanceof Markdown)) {
            throw TypeError('use Constructor');
        }
        this._init(options);
    }

    compile (text) {
        const cached = this.$options.cached;

        if (cached[text]) {
            return cached[text];
        }

        return cached[text] = compile.call(this, text);
    }
}

// 初始化Markdown构造函数
initMarkdown();
