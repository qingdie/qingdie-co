function co(genFunc, cb) {
    if (co.isGenerator(genFunc)) {
        genFunc = genFunc(next);
        next();
    } else if (co.isGeneratorObj(genFunc)) {
        next();
    }
    else if (co.isFunction(genFunc)) {
        return function (num) {
            return new Promise(function (res) {
                var data = {};
                var cbnum = 0;
                genFunc(function (key) {
                    return num == 1 ? res(key) : function (args) {
                        data[key] = args;
                        ++cbnum == num && res(data);
                    }
                });
            });
        }
    } else if (co.isAsyncFunction(genFunc)) {
        genFunc();
    }
    function next(args) {
        if (genFunc.next) {
            var t = genFunc.next(args);
            if (t.done) {
                cb && cb(t.value);
            } else {
                co.isPromise(t.value) ? t.value.then(next, next) : co.isFunction(t.value) ? t.value(next) : (co.isGenerator(t.value) || co.isGeneratorObj(t.value)) ? co(t.value, next) : t.value && next(t.value);
            }
        }
    };
}

co.isAsyncFunction = function (fn) {
    return fn && fn.constructor && fn.constructor.name == "AsyncFunction";
};
co.isFunction = function (fn) {

    return fn && fn.constructor && fn.constructor.name == 'Function';
};
co.isPromise = function (fn) {
    return fn && fn.constructor && fn.constructor.name == 'Promise';
};
co.isGenerator = function (fn) {
    return fn && fn.constructor && fn.constructor.name == 'GeneratorFunction';
};
co.isGeneratorObj = function (fn) {
    return fn && 'function' == typeof fn.next && 'function' == typeof fn.throw;
};
module.exports = co;