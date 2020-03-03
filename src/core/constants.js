export const

    // 匹配一元标签，以换行符结束的
    titleLevelRE = /^(\#{1,6})\s/,
    quoteRE = /^(>)/,
    ulistRE = /^([-+])\s/,
    olistRE = /^(\d+\.)\s/,

    // 匹配1~2个的闭合符号
    shortCodeRE = /^(`{1,2})/,
    asteriskRE = /^(\*{1,2})/,
    delRE = /^(~{1,2})/,

    // 匹配图片
    imgRE = /^(\!\[)([^[]*)(\]\()([^)]*)(\))/,

    // 链接
    linkRE = /^(\[)([^[]*)(\]\()([^)]*)(\))/,

    // 匹配文本
    text = /^(.+?)(?![^`*~[!\n])/,

    // 匹配转义文本
    escapeRE = /^\\([^\s])/,

    codeRE = /^(`+)([a-zA-Z]*)\n[\s\S]([^`]|[^`][\s\S]*?[^`])\1(?!`)\n/,


    // 文段结束
    newline = /^(\n+)/,
    specialRE = /img|link/;

export const symbol2Tag = {
    '#': 'h1',
    '##': 'h2',
    '###': 'h3',
    '####': 'h4',
    '#####': 'h5',
    '######': 'h6',
    '+': 'li',
    '-': 'li',
    'num': 'li',
    'ul': 'ul',
    'ol': 'ol',
    '>': 'blockquote',
    '`': 'code',
    '``': 'code',
    '```': 'pre',
    'p': 'p',
    'img': 'img',
    'link': 'a',
    '*': 'i',
    '**': 'b',
    '~': 'del',
    '~~': 'del',
    'root': 'article'
};

export const SingleSideSymbol = {
    '#': true,
    '##': true,
    '###': true,
    '####': true,
    '#####': true,
    '######': true,
    '>': true,
    '-': true,
    '+': true,
    'num': true
};

export const unarySymbol = {
    'img': true
};