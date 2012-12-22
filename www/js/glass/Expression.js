(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var operations; //  assigned during _init_
    var parse; //  assigned during _init_
    var evaluate; //  assigned during _init_
    var isIdentifier; //  assigned during _init_
    var isExpression; //  assigned during _init_
    var toBoolean; //  assigned during _init_
    var isString; //  assigned during _init_
    var isNumber; //  assigned during _init_
    var contains; //  assigned during _init_
    var assert; //  assigned during _init_
    var Expression = this.Expression = function Expression(op, args) {
        var _ref;
        this.op = op;
        if (args != null) {
            this.args = args;
        }
        this.operation = operations[op];
        if (!this.operation) {
            throw new Error("Operation not found: " + op);
        }
        if ((_ref = this.operation.initialize) != null) {
            _ref.call(this);
        }
        return this;
    };
    Expression.properties = {
        op: {
            type: "string",
            name: "op",
            writable: true
        },
        args: {
            type: "array",
            name: "args",
            writable: true
        },
        next: {
            type: "object",
            name: "next",
            writable: true
        },
        operation: {
            serializable: false,
            name: "operation",
            writable: true
        },
        toJSON: {
            value: function() {
                var json;
                json = {
                    op: this.op,
                    args: this.args
                };
                if (this.next) {
                    json.next = this.next;
                }
                return json;
            },
            name: "toJSON"
        },
        toString: {
            value: function() {
                var arg, args, format, value;
                format = this.operation.format;
                args = (function() {
                    var _i, _len, _ref, _results;
                    if (this.args) {
                        _ref = this.args;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            arg = _ref[_i];
                            _results.push(Expression.toString(arg));
                        }
                        return _results;
                    } else {
                        return null;
                    }
                }).call(this);
                value = format != null ? format.apply(this, args) : args != null ? "(" + args[0] + " " + this.op + " " + args[1] + ")": "Need format for op: " + this.op;
                if (this.next != null) {
                    value += Expression.toString(this.next);
                }
                return value;
            },
            name: "toString"
        }
    };
    Expression.operations = {
        "+": {
            evaluate: function(a, b) {
                return a + b;
            }
        },
        "-": {
            evaluate: function(a, b) {
                return a - b;
            }
        },
        "*": {
            evaluate: function(a, b) {
                return a * b;
            }
        },
        "/": {
            evaluate: function(a, b) {
                return a / b;
            }
        },
        "%": {
            evaluate: function(a, b) {
                return a % b;
            }
        },
        "!": {
            format: function(a) {
                return "!" + a;
            },
            evaluate: function(a) {
                return ! a;
            }
        },
        neg: {
            format: function(a) {
                return "-" + a;
            },
            evaluate: function(a) {
                return - a;
            }
        },
        "&&": {
            evaluateArgs: false,
            evaluate: function(a, b) {
                a = Expression.evaluate(this, a);
                if (!a) {
                    return a;
                }
                b = Expression.evaluate(this, b);
                return b;
            }
        },
        "||": {
            evaluateArgs: false,
            evaluate: function(a, b) {
                a = Expression.evaluate(this, a);
                if (a) {
                    return a;
                }
                b = Expression.evaluate(this, b);
                return b;
            }
        },
        "<": {
            vector: false,
            evaluate: function(a, b) {
                return a < b;
            }
        },
        ">": {
            vector: false,
            evaluate: function(a, b) {
                return a > b;
            }
        },
        "<=": {
            vector: false,
            evaluate: function(a, b) {
                return a <= b;
            }
        },
        ">=": {
            vector: false,
            evaluate: function(a, b) {
                return a >= b;
            }
        },
        "==": {
            vector: false,
            expandArgs: false,
            evaluate: function(a, b) {
                if (Array.isArray(a)) {
                    return contains(a, b);
                }
                if (Array.isArray(b)) {
                    return contains(b, a);
                }
                return a === b;
            }
        },
        "!=": {
            vector: false,
            expandArgs: false,
            evaluate: function(a, b) {
                if (Array.isArray(a)) {
                    return ! contains(a, b);
                }
                if (Array.isArray(b)) {
                    return ! contains(b, a);
                }
                return a !== b;
            }
        },
        "?:": {
            format: function(a, b, c) {
                return "(" + a + " ? " + b + " : " + c + ")";
            },
            evaluate: function(a) {}
        },
        values: {
            format: function() {
                return "*";
            },
            evaluate: function() {
                var value;
                value = getContext();
                if ((value != null) && typeof value === 'object' && !Array.isArray(value)) {
                    return glass.values(value);
                } else {
                    return value;
                }
            },
            evaluateNext: function(value) {
                var item, result, results, _i, _len;
                results = [];
                for (_i = 0, _len = value.length; _i < _len; _i++) {
                    item = value[_i];
                    result = e(this.next, item);
                    if (result !== void 0) {
                        results.push(result);
                    }
                }
                return results;
            }
        },
        array: {
            format: function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return "[" + (args.join(',')) + "]";
            },
            evaluate: function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return args;
            }
        },
        object: {
            format: function() {
                var args, buffer, i, key, value, _i, _ref;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                buffer = [];
                buffer.push("{");
                for (i = _i = 0, _ref = args.length - 1; _i <= _ref; i = _i += 2) {
                    key = args[i];
                    value = args[i + 1];
                    if (i > 0) {
                        buffer.push(",");
                    }
                    buffer.push(key, ":", value);
                }
                buffer.push("}");
                return buffer.join('');
            },
            evaluate: function() {
                var args, i, key, object, value, _i, _ref;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                object = {};
                for (i = _i = 0, _ref = args.length - 1; _i <= _ref; i = _i += 2) {
                    key = args[i];
                    value = args[i + 1];
                    object[key] = value;
                }
                return object;
            }
        },
        global: {
            format: function() {
                return '$';
            },
            evaluate: function() {
                return global;
            }
        },
        ancestor: {
            format: function(a) {
                var dots, i, _i;
                dots = [];
                for (i = _i = 0; 0 <= a ? _i <= a: _i >= a; i = 0 <= a ? ++_i: --_i) {
                    dots.push('.');
                }
                return dots.join('');
            },
            evaluateArgs: false,
            evaluate: function(offset) {
                return stack[Math.max(0, stack.length - 1 - offset)];
            },
            evaluateNext: function(value) {
                var hold, item, offset, _i, _len;
                offset = this.args[0];
                if (offset === 0) {
                    return e(this.next);
                } else {
                    hold = stack.slice( - offset);
                    stack.length -= hold.length;
                    value = e(this.next);
                    for (_i = 0, _len = hold.length; _i < _len; _i++) {
                        item = hold[_i];
                        stack.push(item);
                    }
                    return value;
                }
            }
        },
        root: {
            format: function() {
                return '@';
            },
            evaluate: function() {
                return stack[0];
            }
        },
        property: {
            format: function(a) {
                return "[" + a + "]";
            },
            evaluate: function(a) {
                var context;
                context = getContext();
                if (isNumber(a) && a < 0 && isNumber(context.length)) {
                    a += context.length;
                }
                return context[a];
            }
        },
        path: {
            format: function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return args.join('');
            },
            evaluateArgs: false,
            evaluate: function() {
                var steps;
                steps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            }
        },
        call: {
            format: function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return "(" + (args.join(',')) + ")";
            },
            evaluateNext: function(value) {
                return e(this.next);
            },
            evaluateArgs: false,
            evaluate: function() {
                var arg, args, fn, hold, item, scope, _i, _len;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                if (args.length > 0) {
                    hold = stack.slice(1);
                    stack.length -= hold.length;
                    args = (function() {
                        var _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = args.length; _i < _len; _i++) {
                            arg = args[_i];
                            _results.push(e(arg));
                        }
                        return _results;
                    })();
                    for (_i = 0, _len = hold.length; _i < _len; _i++) {
                        item = hold[_i];
                        stack.push(item);
                    }
                }
                fn = stack[stack.length - 1];
                if ((fn != null ? fn.apply: void 0) != null) {
                    scope = stack[stack.length - 2];
                    return fn.apply(scope, args);
                } else {
                    return void 0;
                }
            }
        },
        filter: {
            push: function() {
                return false;
            },
            format: function(a) {
                return "?(" + a + ")";
            },
            evaluate: function(a) {
                if (toBoolean(a)) {
                    return getContext();
                } else {
                    return void 0;
                }
            },
            evaluateNext: function(value) {
                return e(this.next);
            }
        },
        eval: {
            format: function(a) {
                return "{" + a + "}";
            },
            evaluate: function(a) {
                return a;
            }
        }
    };
    Expression.parse = function(text) {
        try {
            return Expression._parser.parse(text);
        } catch(e) {
            e.text = text;
            throw e;
        }
    };
    Expression.evaluate = function(expression, context) {
        if (context == null) {
            context = global;
        }
        stack.length = 0;
        return e(expression, context);
    };
    Expression.isIdentifier = function(a) {
        return isString(a) && /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(a);
    };
    Expression.isExpression = function(expression) {
        return (expression != null ? expression.constructor: void 0) === Expression;
    };
    Expression.toBoolean = function(value) {
        var item, _i, _len;
        if (Array.isArray(value)) {
            for (_i = 0, _len = value.length; _i < _len; _i++) {
                item = value[_i];
                if (toBoolean(item)) {
                    return true;
                }
            }
            return false;
        }
        return Boolean(value);
    };
    Expression.toString = function(expression) {
        if (isExpression(expression)) {
            return expression.toString();
        } else {
            return JSON.stringify(expression);
        }
    };
    Expression.test = {
        isIdentifier: function() {
            assert(isIdentifier("alpha95"));
            assert(isIdentifier("_alpha95"));
            assert(!isIdentifier("95alpha95"));
            return assert(!isIdentifier("alpha 95"));
        },
        evaluation: function() {
            var check, data, evaluate;
            data = {
                clothes: [{
                    name: 'Shirt',
                    sizes: ['S', 'M', 'L'],
                    price: 14.50,
                    quantity: 8
                },
                {
                    name: 'Pants',
                    sizes: [29, 30, 31, 32],
                    price: 20.19,
                    quantity: 6
                },
                {
                    name: 'Shoes',
                    sizes: [8, 9, 10],
                    price: 25.85,
                    quantity: 15
                },
                {
                    name: 'Ties',
                    sizes: [2],
                    price: 3.99,
                    quantity: 3
                }],
                codes: {
                    alpha: {
                        discount: 10,
                        items: 4
                    },
                    beta: {
                        discount: 20,
                        items: 2
                    },
                    charlie: {
                        discount: 30,
                        items: 1
                    }
                },
                favoriteChild: 'pat',
                children: {
                    pat: {
                        name: 'pat',
                        age: 28,
                        children: {
                            jay: {
                                name: 'jay',
                                age: 4
                            },
                            bob: {
                                name: 'bob',
                                age: 8
                            }
                        }
                    },
                    skip: {
                        name: 'skip',
                        age: 30,
                        children: {
                            joe: {
                                name: 'joe',
                                age: 7
                            }
                        }
                    }
                }
            };
            evaluate = function(path) {
                var expression;
                expression = Expression.parse(path);
                return Expression.evaluate(expression, data);
            };
            check = function(path, expected) {
                var message, value;
                value = evaluate(path);
                if (expected !== value && JSON.stringify(expected) !== JSON.stringify(value)) {
                    console.error(message = path + " did not result in expected value: " + JSON.stringify(expected));
                    return console.error("\nit resulted in: " + JSON.stringify(value));
                }
            };
            check("@", data);
            check("codes", data.codes);
            check("codes.alpha", data.codes.alpha);
            check("codes.alpha.discount", 10);
            check("$Math.min", Math.min);
            check("$Math.min(codes.alpha.discount,codes.beta.discount)", 10);
            check("clothes[-1]", data.clothes[data.clothes.length - 1]);
            check("?(clothes != null)", data);
            check("?(clothes == null)", void 0);
            check("{a:1+1,\"b\":true}", {
                a: 2,
                b: true
            });
            check("[10/2,8]", [5, 8]);
            check("clothes.length", 4);
            check("$", global);
            check("codes.*", [data.codes.alpha, data.codes.beta, data.codes.charlie]);
            check("codes.*.discount", [10, 20, 30]);
            check("codes.*?(discount > 10)", [data.codes.beta, data.codes.charlie]);
            check("$glass.sum(@clothes.*{price * quantity})", 636.86);
            check('{alpha:codes.alpha.discount,"beta":2,charlie:[3,2,codes.beta.discount]}', {
                alpha: data.codes.alpha.discount,
                beta: 2,
                charlie: [3, 2, data.codes.beta.discount]
            });
            check('children.*?(name == ...favoriteChild)', [data.children.pat]);
            check('children.*?(name == @favoriteChild)', [data.children.pat]);
            check('children[@favoriteChild]', data.children.pat);
            check('children[..favoriteChild]', data.children.pat);
        },
        isExpression: function() {
            assert(!isExpression(parse("45.8")));
            return assert(isExpression(parse("x")));
        },
        parser: function() {
            var expected, result, stringResult, tests, text;
            tests = {
                "a.b.c": ".[\"a\"][\"b\"][\"c\"]",
                "..foo": "..[\"foo\"]",
                "+++++++12": "12",
                "a[1]": ".[\"a\"][1]",
                "true": "true",
                "false": "false",
                "45.8": "45.8",
                "(45.8)": "45.8",
                "((45.8))": "45.8",
                "alpha": ".[\"alpha\"]",
                "35 + true * 2": "(35 + (true * 2))",
                " 5 * ( 2 + 2 ) ": "(5 * (2 + 2))",
                " ! ! true": "!!true",
                "5 + -x": "(5 + -.[\"x\"])",
                "true == 5 >= 2": "(true == (5 >= 2))",
                "1 or 2 and 3": "(1 || (2 && 3))",
                "1 ? 2 : 3": "(1 ? 2 : 3)",
                "1 ? 2 : 3 ? 4 : 5": "(1 ? 2 : (3 ? 4 : 5))",
                "Math.max(1,2)": ".[\"Math\"][\"max\"](1,2)",
                "@": "@",
                "@foo": "@[\"foo\"]",
                "\"hello\"": "\"hello\"",
                "\"\\t\\r\\n\\b\\\\foo/\"": "\"\\t\\r\\n\\b\\\\foo/\"",
                "[]": "[]",
                ".[1][2]": ".[1][2]",
                "[1,2]": "[1,2]",
                "[1+2]": "[(1 + 2)]",
                "{}": "{}",
                "{\"a\":2}": "{\"a\":2}",
                "{\"a\":2,\"b\":1+2}": "{\"a\":2,\"b\":(1 + 2)}",
                "@[\"alpha\"]": "@[\"alpha\"]",
                "$": "$",
                "$glass": "$[\"glass\"]",
                "$.glass": "$[\"glass\"]",
                "*": ".*",
                "*.*": ".**",
                "foo.*": ".[\"foo\"]*",
                "*{1+2}": ".*{(1 + 2)}",
                "foo?(@x > 2)": ".[\"foo\"]?((@[\"x\"] > 2))"
            };
            for (text in tests) {
                expected = tests[text];
                result = parse(text);
                stringResult = Expression.toString(result);
                if (stringResult !== expected) {
                    console.log(text, stringResult, JSON.stringify(result));
                }
            }
        }
    };
    Expression.path = "glass.Expression";
    Expression.implements = {
        "glass.Expression": true
    };
    Expression.uri = "global:/glass/Expression";
    var evalPath = function(path, context) {
        var step, _i, _len;
        if (context == null) {
            context = global;
        }
        for (_i = 0, _len = path.length; _i < _len; _i++) {
            step = path[_i];
            if (context != null) {
                context = context[step];
            }
        }
        return context;
    };
    var stack = [];
    var getContext = function() {
        return stack[stack.length - 1];
    };
    var e = function(expr, push) {
        var arg, args, op, value;
        if (!isExpression(expr)) {
            return expr;
        }
        if (push != null) {
            stack.push(push);
        }
        op = expr.operation;
        args = expr.args;
        if ((expr.args != null) && op.evaluateArgs !== false) {
            args = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = args.length; _i < _len; _i++) {
                    arg = args[_i];
                    _results.push(e(arg));
                }
                return _results;
            })();
        }
        value = op.evaluate.apply(expr, args);
        if ((value != null) && (expr.next != null)) {
            if (op.evaluateNext != null) {
                value = op.evaluateNext.call(expr, value);
            } else {
                value = e(expr.next, value);
            }
        }
        if (push != null) {
            stack.pop();
        }
        return value;
    };
    Object.defineProperties(Expression.prototype, Expression.properties);
    Expression._init_ = function() {
        operations = global.glass.Expression.operations;
        parse = global.glass.Expression.parse;
        evaluate = global.glass.Expression.evaluate;
        isIdentifier = global.glass.Expression.isIdentifier;
        isExpression = global.glass.Expression.isExpression;
        toBoolean = global.glass.Expression.toBoolean;
        isString = global.glass.isString;
        isNumber = global.glass.isNumber;
        contains = global.glass.contains;
        assert = global.glass.assert;
        delete Expression._init_;
    }
}).call(glass)