(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var apply; //  assigned during _init_
    var create; //  assigned during _init_
    var isPlainObject; //  assigned during _init_
    var isPrimitive; //  assigned during _init_
    var patch; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var JSONMergePatch = this.JSONMergePatch = {
        apply: function(target, patch) {
            var key, value;
            if ((target != null) && target !== patch && isPlainObject(patch) && !isPrimitive(target)) {
                for (key in patch) {
                    value = patch[key];
                    if (value === void 0) {
                        delete target[key];
                    } else {
                        target[key] = apply(target[key], patch[key]);
                    }
                }
                return target;
            } else {
                return patch;
            }
        },
        create: function() {
            var arg, current, i, last, result, _i, _len;
            if (arguments.length === 1) {
                return arguments[0];
            }
            result = {};
            current = result;
            for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
                arg = arguments[i];
                if (! (i + 1 < arguments.length)) {
                    continue;
                }
                last = i + 2 === arguments.length;
                current = current[arg] = last ? arguments[arguments.length - 1] : {};
            }
            return result;
        },
        test: function() {
            assertEquals({
                a: {
                    b: 12
                }
            },
            create('a', 'b', 12));
            return assertEquals({
                a: 3
            },
            apply({
                a: 1,
                b: 2
            },
            {
                a: 3,
                b: void 0
            }));
        },
        path: "glass.JSONMergePatch",
        uri: "global:/glass/JSONMergePatch"
    };
    JSONMergePatch._init_ = function() {
        apply = global.glass.JSONMergePatch.apply;
        create = global.glass.JSONMergePatch.create;
        isPlainObject = global.glass.isPlainObject;
        isPrimitive = global.glass.isPrimitive;
        patch = global.glass.patch;
        assertEquals = global.glass.assertEquals;
        delete JSONMergePatch._init_;
    }
}).call(glass)