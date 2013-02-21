(function() {
    var global = (function() {
        return this;
    })();
    var JSONMergePatch; //  assigned during _init_
    var isFunction; //  assigned during _init_
    var isString; //  assigned during _init_
    var isArray; //  assigned during _init_
    var isBoolean; //  assigned during _init_
    var isNumber; //  assigned during _init_
    var isDate; //  assigned during _init_
    var values; //  assigned during _init_
    var sum; //  assigned during _init_
    var patch; //  assigned during _init_
    var _getStackLocationInfo; //  assigned during _init_
    var _throwAssertionFailure; //  assigned during _init_
    var _dumpFile; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var glass = this.glass = {
        isFunction: function(object) {
            return (object != null) && typeof object === 'function';
        },
        isString: function(object) {
            return (object != null ? object.constructor: void 0) === String;
        },
        isArray: function(object) {
            return Array.isArray(object);
        },
        isBoolean: function(object) {
            return (object != null) && typeof object === 'boolean';
        },
        isNumber: function(object) {
            return (object != null) && typeof object === 'number';
        },
        isObject: function(object) {
            return typeof object === 'object';
        },
        isPlainObject: function(object) {
            return (object != null ? object.constructor: void 0) === Object;
        },
        isPrototype: function(object) {
            return (object != null) && object === object.constructor.prototype;
        },
        isDate: function(object) {
            return (object != null ? object.constructor: void 0) === Date;
        },
        isPrimitive: function(object) {
            return isString(object) || isBoolean(object) || isNumber(object) || isDate(object);
        },
        isPrivate: function(property) {
            return (property != null ? property[0] : void 0) === '_';
        },
        values: function(object) {
            var key, value, _results;
            _results = [];
            for (key in object) {
                value = object[key];
                _results.push(value);
            }
            return _results;
        },
        sum: function() {
            var a, item, number, total, _i, _j, _len, _len1;
            total = 0;
            for (_i = 0, _len = arguments.length; _i < _len; _i++) {
                a = arguments[_i];
                if (a != null) {
                    if (Array.isArray(a)) {
                        for (_j = 0, _len1 = a.length; _j < _len1; _j++) {
                            item = a[_j];
                            total += sum(item);
                        }
                    } else {
                        number = Number(a);
                        if (!isNaN(number)) {
                            total += number;
                        }
                    }
                }
            }
            return total;
        },
        contains: function(array, item) {
            return (array != null ? typeof array.lastIndexOf === "function" ? array.lastIndexOf(item) : void 0 : void 0) >= 0;
        },
        patch: function() {
            var patch, pathAndPatch, target;
            target = arguments[0],
            pathAndPatch = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            patch = JSONMergePatch.create.apply(null, pathAndPatch);
            if (isFunction(target != null ? target.patch: void 0)) {
                return target.patch(patch);
            } else {
                return glass.JSONMergePatch.apply(target, patch);
            }
        },
        _getStackLocationInfo: function(e, depth) {
            var line, match, _ref;
            line = (_ref = e.stack) != null ? _ref.split('\n')[depth] : void 0;
            if (line == null) {
                return null;
            }
            match = /\(([\w\W]*?):(\d+):(\d+)\)/.exec(line);
            return {
                file: match[1],
                line: parseInt(match[2]),
                column: parseInt(match[3])
            };
        },
        _throwAssertionFailure: function(message) {
            var info;
            try {
                throw new Error("Assertion failed: " + message);
            } catch(e) {
                info = _getStackLocationInfo(e, 3);
                if (info != null) {
                    _dumpFile(info.file, info.line - 2, info.line + 2, info.line);
                }
                throw e;
            }
        },
        _dumpFile: function(file, from, to, highlight) {
            var content, fs, line, lineNumber, lines, num, number, _i, _len;
            if (from == null) {
                from = 1;
            }
            fs = require('fs');
            if (fs == null) {
                return;
            }
            try {
                content = fs.readFileSync(file).toString();
            } catch(e) {
                content = "Source not found: " + e;
            }
            console.log('------------------------------------------------');
            console.log(file);
            console.log('------------------------------------------------');
            number = 1;
            if (content != null) {
                lines = content.split(/\r|\n/);
                if (to == null) {
                    to = lines.length;
                }
                for (_i = 0, _len = lines.length; _i < _len; _i++) {
                    line = lines[_i];
                    lineNumber = number++;
                    if (lineNumber >= from && lineNumber <= to) {
                        num = String(lineNumber);
                        while (num.length < 3) {
                            num += ' ';
                        }
                        if (lineNumber === highlight) {
                            console.log("\033[91m" + num + ": " + line + "\033[0m");;
                        } else {
                            console.log(num + ": " + line);;
                        }
                    }
                }
            }
            return console.log('------------------------------------------------');
        },
        assert: function(a) {
            if (!a) {
                return _throwAssertionFailure(JSON.stringify(a));
            }
        },
        assertTrue: function(a) {
            if (a !== true) {
                return _throwAssertionFailure(JSON.stringify(a) + " != true");
            }
        },
        assertEquals: function(a, b) {
            if (JSON.stringify(a) !== JSON.stringify(b)) {
                return _throwAssertionFailure(JSON.stringify(a) + ' != ' + JSON.stringify(b));
            }
        },
        getId: (function() {
            var counter;
            counter = 0;
            return function(a) {
                var _ref;
                if (a === null) {
                    return '__null__';
                }
                if (a === void 0) {
                    return '__undefined__';
                }
                if (typeof a === 'object' || typeof a === 'function') {
                    return (_ref = a.id) != null ? _ref: a.id = '__' + (counter++) + '__';
                }
                return a.toString();
            };
        })(),
        getType: function(path) {
            var array, step, value, _i, _len;
            array = isArray(path) ? path: path.split('.');
            value = global;
            for (_i = 0, _len = path.length; _i < _len; _i++) {
                step = path[_i];
                if (value != null) {
                    value = value[step];
                }
            }
            if (!isFunction(value)) {
                throw new Error("Type not found: " + path);
            }
            return value;
        },
        test: {
            values: function() {
                return assertEquals(values({
                    a: 1,
                    b: 3,
                    c: 2
                }), [1, 3, 2]);
            },
            patch: function() {
                var x;
                x = {
                    a: {
                        foo: 1,
                        bar: 3
                    },
                    b: 2
                };
                patch(x, 'a', 'foo', 5);
                return assertEquals(x.a.foo, 5);
            }
        },
        path: "glass"
    };
    glass._init_ = function() {
        JSONMergePatch = global.glass.JSONMergePatch;
        isFunction = global.glass.isFunction;
        isString = global.glass.isString;
        isArray = global.glass.isArray;
        isBoolean = global.glass.isBoolean;
        isNumber = global.glass.isNumber;
        isDate = global.glass.isDate;
        values = global.glass.values;
        sum = global.glass.sum;
        patch = global.glass.patch;
        _getStackLocationInfo = global.glass._getStackLocationInfo;
        _throwAssertionFailure = global.glass._throwAssertionFailure;
        _dumpFile = global.glass._dumpFile;
        assertEquals = global.glass.assertEquals;
        delete glass._init_;
    }
}).call()