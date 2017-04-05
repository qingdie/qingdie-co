var co = require('./index');

var getUser = function (name, cb) {
    setTimeout(function () {
        cb('qingdie ' + name);
    }, 1000);
};
var getUser1 = function (name) {
    return new Promise(function (res) {
        setTimeout(function () {
            res('qingdie ' + name);
        }, 1000);
    });
};


co(function* (cb) {
    var user = yield getUser('你好！', cb);
    console.log(user);
    var user1 = yield getUser1('棒棒哒！');
    console.log(user1);

    var ret = yield co(function (cba) {
        getUser('棒棒哒！', cba('user'));
        getUser('你好！', cba('user1'));
    })(2);
    console.log(ret);
});
