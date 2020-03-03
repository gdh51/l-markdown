# l-markdown

该库为一个`markdown`编译器，它将文本编译为具体的`dom`结构，目前支持以下常用语法：

- 小代码块：\`\`sample\`\`或\`sample\`
- 斜体：`*sample*`
- 粗体：`**sample**`
- 有序/无序列表：`1. sample`/`+/- sample`
- 大代码块：
\`\`\`js
sample
\`\`\`

- 引文：`>sample`
- 图片：`![]()`
- 链接：`[]()`
- 删除线：`~sample~`或`~~sample~~`
- 标题`h1~h6`：`# sample`等等
- 内联元素嵌套：`>sample1 *sample*...`

## 配置说明

那么其构造函数可以接受一个配置(可选)，配置对象的具体字段为：

```js
new Markdown({
    mode, // 编译模式，对应上述
    c, // vnode模式下必选，必须为其传入创建vnode的函数
    renderClass, // 一个对象，由元素与class的键值对组成
    transformTotree, // vnode模式下的可选项，是否将文本形成一颗树状结构
});
```

初始化`Markdown`实例后，我们即可调用其`compile(text)`函数来对其传入的文本来进行输入：

```js
md.compile('# some text'); // <h1>some text</h1>
```

那么下面对配置对象进行具体的解释

### 输出模式——mode

一共支持三种模式的编译，它们分别为：

- `dom`：直接生成`DOM`片段
- `vnode`：直接生成`VNode`节点树
- `text`：直接生成文本结构的`DOM`片段(默认)

对于当前环境不支持的模式，会**自动嗅探**，降级为`text`模式。

### 元素Class设置——renderClass

该参数用于设置生成元素对应的`class`，支持传入一个对象，分别用键名表示对应元素，键值表示要添加的`class`。`class`支持数组、字符串形式。

示例：

```js
let renderClass = {
    'p': 'paragraph',
    'h1': ['title', 'topic'],
    'ul.li': 'ul-list-item sss'
};
```

对于列表子元素这种的设置，需要为其指定父元素与此类似的还有`ol.li`与`code.pre`

### 其余参数——c、transformTotree

该两个参数只能适用于`vnode`模式之下。当使用`vnode`模式时，必须传入其渲染`VNode`的函数作为`c`，否则无法进行创建。

而参数`transformTotree`则是作为一个**可选**的附加功能，它会帮你自动追踪生成的`DOM`元素与对应的`h1~h6`元素，并且会将其整理为一个树形结构返回，比如下面的文本：

```js
`# h1
## h2
## h3`
```

那么它会生成一颗这样的树：

```js
`    h1
    /  \
   h2  h3
`
```

这主要的目的是用来帮助生成目录。

最后要**注意**使用该参数时，会返回一个接口，如下：

```js
const renderHelper = {

    // 生成的VNode的根节点
    rootVNode,

    // 生成的目录树形图的根节点
    nodesTreeRoot,

    // 生成的目录在DOM中顺序的数组
    nodesTreeMap,

    // 用于绑定对应目录与对应元素
    bindElement
}
```

我们还需要手动调用`bindElement()`函数来将元素绑定到对应的目录所代表的树形`AST`对象

## 附带的Vue组件

除了基本的编译器外呢，它还携带了两个开箱即用的`Markdown`组件。

## TODO

接下来该库的计划为：

1. 完成大代码块代码上色
2. 优化代码结构
3. 完成列表的嵌套生成
4. 允许传入自定义函数操控对应元素`AST`对象上的属性
5. 添加错误定位与报错提示
