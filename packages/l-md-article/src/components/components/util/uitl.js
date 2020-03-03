export function extend(to, _from) {
    for (var key in _from) {
        to[key] = _from[key];
    }
    return to
}

export function throttle (fn, ctx, time) {
    let timer;

    return function (...arg) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = void 0;
            return fn.apply(ctx, arg)
        }, time);
    }
}