"use strict";
function cssHyphenate(propertyName) {
    return propertyName.replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-')
        .toLowerCase();
}
exports.cssHyphenate = cssHyphenate;
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function isString(str) {
    return typeof str === 'string';
}
exports.isString = isString;
function isBlank(obj) {
    return obj === undefined || obj === null;
}
exports.isBlank = isBlank;
function regExFirstMatch(regExp, input) {
    regExp.lastIndex = 0;
    return regExp.exec(input);
}
exports.regExFirstMatch = regExFirstMatch;
function setValueOnPath(context, path, value) {
    var parts = path.split('.');
    var obj = context;
    while (parts.length > 1) {
        var name = parts.shift();
        if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
            obj = obj[name];
        }
        else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[parts.shift()] = value;
}
exports.setValueOnPath = setValueOnPath;
var ListWrapper = (function () {
    function ListWrapper() {
    }
    ListWrapper.contains = function (list, el) { return list.indexOf(el) !== -1; };
    ListWrapper.remove = function (list, el) {
        var index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        return false;
    };
    return ListWrapper;
}());
exports.ListWrapper = ListWrapper;
var StringMapWrapper = (function () {
    function StringMapWrapper() {
    }
    StringMapWrapper.create = function () {
        return {};
    };
    StringMapWrapper.contains = function (map, key) {
        return map.hasOwnProperty(key);
    };
    StringMapWrapper.get = function (map, key) {
        return map.hasOwnProperty(key) ? map[key] : undefined;
    };
    StringMapWrapper.set = function (map, key, value) { map[key] = value; };
    StringMapWrapper.keys = function (map) { return Object.keys(map); };
    StringMapWrapper.values = function (map) {
        return Object.keys(map).map(function (k) { return map[k]; });
    };
    StringMapWrapper.isEmpty = function (map) {
        for (var prop in map) {
            return false;
        }
        return true;
    };
    StringMapWrapper.delete = function (map, key) { delete map[key]; };
    StringMapWrapper.forEach = function (map, callback) {
        for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
            var k = _a[_i];
            callback(map[k], k);
        }
    };
    StringMapWrapper.merge = function (m1, m2) {
        var m = {};
        for (var _i = 0, _a = Object.keys(m1); _i < _a.length; _i++) {
            var k = _a[_i];
            m[k] = m1[k];
        }
        for (var _b = 0, _c = Object.keys(m2); _b < _c.length; _b++) {
            var k = _c[_b];
            m[k] = m2[k];
        }
        return m;
    };
    StringMapWrapper.equals = function (m1, m2) {
        var k1 = Object.keys(m1);
        var k2 = Object.keys(m2);
        if (k1.length !== k2.length) {
            return false;
        }
        var key;
        for (var i = 0; i < k1.length; i++) {
            key = k1[i];
            if (m1[key] !== m2[key]) {
                return false;
            }
        }
        return true;
    };
    return StringMapWrapper;
}());
exports.StringMapWrapper = StringMapWrapper;
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
function replaceAllMapped(s, from, cb) {
    return s.replace(from, function () {
        var matches = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            matches[_i - 0] = arguments[_i];
        }
        matches.splice(-2, 2);
        return cb(matches);
    });
}
function camelCaseToDashCase(input) {
    return replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return replaceAllMapped(input, DASH_CASE_REGEXP, function (m) { return m[1].toUpperCase(); });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }
    if (token.name) {
        return token.name;
    }
    var res = token.toString();
    var newLineIndex = res.indexOf('\n');
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
exports.listContains = function (list, el) { return list.indexOf(el) !== -1; };
function stringMapForEach(map, callback) {
    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            callback(map[prop], prop);
        }
    }
}
exports.stringMapForEach = stringMapForEach;
exports.isSuccess = (function (status) { return (status >= 200 && status < 300); });
function _randomChar() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 25));
}
exports._randomChar = _randomChar;
function _appIdRandomProviderFactory() {
    return "" + _randomChar() + _randomChar() + _randomChar();
}
exports._appIdRandomProviderFactory = _appIdRandomProviderFactory;
function arrayFlattenTree(children, arr) {
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        if (Array.isArray(child)) {
            arrayFlattenTree(child, arr);
        }
        else {
            arr.push(child);
        }
    }
    return arr;
}
exports.arrayFlattenTree = arrayFlattenTree;
var __empty = null;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = __empty;
