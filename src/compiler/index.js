
import { parseLexer } from './parse/index'
import { optimize } from './optimize/index'
import { generate } from './generate/index'

export function compile (text) {
    let options = this.$options,
        root = parseLexer(text || '', false, true);

    // 优化root树中的文本节点
    optimize(root);

    return generate(root, options);
}