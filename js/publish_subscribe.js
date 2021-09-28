let sub = (function () {
    let pond = {};

    // 向事件池中追加指定自定义事件类型的方法
    const on = function on(type, func) {
        // 每一次增加的时候，验证当前类型在事件池中是否已经存在
        !Array.isArray(pond[type]) ? pond[type] = [] : null;
        let arr = pond[type];
        if (arr.includes(func)) return;
        arr.push(func);
    };

    // 从事件池中移除指定自定义事件类型的方法
    const off = function off(type, func) {
        let arr = pond[type];
        if (!Array.isArray(arr)) throw new TypeError(`${type} 自定义事件在事件池中并不存在!`);
        return arr.filter((item)=>{
            return item!==func;
        })
    };

    // 通知事件池中指定自定义事件类型的方法执行
    const emit = function emit(type, ...params) {
        let arr = pond[type],
            i = 0,
            item = null;
        if (!Array.isArray(arr)) throw new TypeError(`${type} 自定义事件在事件池中并不存在!`);
        for (; i < arr.length; i++) {
            item = arr[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            //不是函数的值都移除掉即可
            arr.splice(i, 1);
            i--;
        }
    };

    return {
        on,
        off,
        emit
    };
})();