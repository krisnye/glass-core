(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var _applyObjectPatch; //  assigned during _init_
    var _applyArrayPatch; //  assigned during _init_
    var create; //  assigned during _init_
    var isArray; //  assigned during _init_
    var isPlainObject; //  assigned during _init_
    var isPrimitive; //  assigned during _init_
    var patch; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var JSONPatch = this.JSONPatch = {
        _applyObjectPatch: function(target, patch) {
            var key, value;
            if (target !== patch && isPlainObject(patch) && !isPrimitive(target)) {
                for (key in patch) {
                    value = patch[key];
                    target[key] = _applyObjectPatch(target[key], patch[key]);
                }
                return target;
            } else {
                return patch;
            }
        },
        _applyArrayPatch: function(target, patch) {
            throw new Error("Not implemented");
        },
        apply: function(target, patch) {
            if (isArray(patch)) {
                return _applyArrayPatch(target, patch);
            } else {
                return _applyObjectPatch(target, patch);
            }
        },
        create: function(path, patch) {
            var arg, current, i, last, result, _i, _len;
            result = {};
            current = result;
            for (i = _i = 0, _len = path.length; _i < _len; i = ++_i) {
                arg = path[i];
                last = i + 1 === path.length;
                current = current[arg] = last ? patch: {};
            }
            return result;
        },
        test: function() {
            return assertEquals({
                a: {
                    b: 12
                }
            },
            create(['a', 'b'], 12));
        },
        path: "glass.JSONPatch",
        uri: "global:/glass/JSONPatch"
    };
    JSONPatch._init_ = function() {
        _applyObjectPatch = global.glass.JSONPatch._applyObjectPatch;
        _applyArrayPatch = global.glass.JSONPatch._applyArrayPatch;
        create = global.glass.JSONPatch.create;
        isArray = global.glass.isArray;
        isPlainObject = global.glass.isPlainObject;
        isPrimitive = global.glass.isPrimitive;
        patch = global.glass.patch;
        assertEquals = global.glass.assertEquals;
        delete JSONPatch._init_;
    }
}).call(glass)