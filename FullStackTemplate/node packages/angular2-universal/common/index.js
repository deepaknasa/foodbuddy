"use strict";
exports.zoneProps = new WeakMap();
var ZoneStore = (function () {
    function ZoneStore(props) {
        if (props === void 0) { props = Object.create(null); }
        var store = new Map();
        try {
            Object.keys(props).forEach(function (prop) {
                store.set(prop, props[prop]);
            });
        }
        catch (e) {
            console.log('e', e);
        }
        exports.zoneProps.set(this, store);
        this.zone = Zone.current.fork({
            name: 'ZoneStore',
            properties: { 'ZoneStore': this }
        });
    }
    ZoneStore.prototype.clear = function () {
        exports.zoneProps.get(this).clear();
    };
    ZoneStore.prototype.setMap = function (obj) {
        var props = exports.zoneProps.get(this);
        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
            var prop = obj_1[_i];
            props.set(prop, obj);
        }
    };
    ZoneStore.prototype.get = function (key) {
        var props = exports.zoneProps.get(this);
        if (this.has(key)) {
            return props.get(key);
        }
    };
    ZoneStore.prototype.set = function (key, value) {
        var props = exports.zoneProps.get(this);
        if (this.has(key)) {
            props.set(key, value);
            return this;
        }
    };
    ZoneStore.prototype.has = function (key) {
        var props = exports.zoneProps.get(this);
        return props.has && props.has(key);
    };
    return ZoneStore;
}());
exports.ZoneStore = ZoneStore;
