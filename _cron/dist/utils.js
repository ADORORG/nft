"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApiRequest = void 0;
var axios_1 = require("axios");
var qs = require("qs");
function makeApiRequest(_a) {
    var url = _a.url, _b = _a.method, method = _b === void 0 ? 'post' : _b, _c = _a.body, body = _c === void 0 ? {} : _c, _d = _a.headers, headers = _d === void 0 ? {} : _d;
    return new Promise(function (resolve, reject) {
        var fetchOption = {
            headers: __assign({ 'Content-Type': 'application/json' }, headers),
            method: method,
            url: url
        };
        var isFormEncoded = fetchOption.headers['Content-Type'] === 'application/x-www-form-urlencoded';
        var isPost = method.toLowerCase() === 'post';
        var isGet = method.toLowerCase() === 'get';
        if (isGet) {
            fetchOption.params = body;
        }
        if (isPost && isFormEncoded) {
            fetchOption.data = qs.stringify(body);
        }
        else if (isPost) {
            fetchOption.data = __assign({}, body);
        }
        (0, axios_1.default)(fetchOption)
            .then(function (res) {
            resolve(res.data);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.makeApiRequest = makeApiRequest;
