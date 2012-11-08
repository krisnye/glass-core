(function() {
    var global = (function() {
        return this;
    })();
    var _getStackLocationInfo; //  assigned during _init_
    var _throwAssertionFailure; //  assigned during _init_
    var _dumpFile; //  assigned during _init_
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
            return typeof object === 'object' && !Array.isArray(object);
        },
        isPlainObject: function(object) {
            return (object != null ? object.constructor: void 0) === Object;
        },
        isPrototype: function(object) {
            return (object != null) && object === object.constructor.prototype;
        },
        isPrimitive: function(object) {
            return ! (object != null) || typeof object !== 'object';
        },
        isPrivate: function(property) {
            return (property != null ? property[0] : void 0) === '_';
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
                    return (_ref = a._id) != null ? _ref: a._id = '__' + (counter++) + '__';
                }
                return a.toString();
            };
        })(),
        path: "glass"
    };
    glass._init_ = function() {
        _getStackLocationInfo = global.glass._getStackLocationInfo;
        _throwAssertionFailure = global.glass._throwAssertionFailure;
        _dumpFile = global.glass._dumpFile;
        delete glass._init_;
    }
}).call()