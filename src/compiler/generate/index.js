
import { generateRenderFn } from './generate-vnode/index'
import { generateDocFragment } from './gen-doc-fragment'
import { genSRContent } from './gen-sr-content'

export function generate(root, options) {
    let result = null;

    switch (options.mode) {
        case 'dom':
            result = generateDocFragment(root, options);
            break;

        case 'vnode':

            // 在VNode模式下返回的是一个节点，其中包含规划好的DOM结构，
            // 在DOM生成完毕后调用配套该接口的方法即可自动注入对应DOM元素
            result = generateRenderFn(root, options);
            break;

        // 默认为dom模式，解析为dom片段
        default:
            result = genSRContent(root, options);
            break;
    }

    return result;
}