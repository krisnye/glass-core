
glass = require '../'

ops =
    '=':
        test: (a, b) -> a is b
    '>':
        test: (a, b) -> a > b
    '<':
        test: (a, b) -> a < b
    '>=':
        test: (a, b) -> a >= b
    '<=':
        test: (a, b) -> a <= b
    'contains':
        test: (a, b) -> a.indexOf(b) >= 0
    '!=':
        test: (a, b) -> a isnt b

testOp = (op, value, testValue) ->
    if Object.isArray testValue
        for testItem in testValue
            if testOp op, value, testItem
                return true
        return false
    operation = ops[op]
    throw new Error "Unsupported operation: #{op}" unless operation?
    result = operation.test testValue, value
    # console.log testValue, op, value, result
    return result

glass.defineProperties module.exports,
    matches: matches = (query, object) ->
        for name, value of query
            if Object.isArray(value)
                throw new Error "Array values not supported yet."
            if value?.constructor is Object
                objectValue = object[name]
                for op, opValue of value
                    if not testOp op, opValue, objectValue
                        return false
            else
                if not testOp "=", value, object[name]
                    return false
        return true
    test: ->
        assert = require('../assert')
        assert matches({}, {})
        assert not matches({a:1}, {})
        assert matches({a:1}, {a:1,b:2})
        assert matches({a:1}, {a:1,b:2})
        assert matches({a:{"!=":1}}, {a:2,b:2})
        assert not matches({a:{"!=":1}}, {a:1})
        assert matches({a:{">=":1}}, {a:1,b:2})
        assert not matches({a:{">=":1}}, {a:0})
        assert matches({a:{"<=":1}}, {a:1,b:2})
        assert not matches({a:{"<=":1}}, {a:2})
        assert matches({a:{"<":1}}, {a:0,b:2})
        assert not matches({a:{"<":1}}, {a:1,b:2})
        assert matches({a:{">":1}}, {a:2,b:2})
        assert not matches({a:{">":1}}, {a:1,b:2})
        assert matches({a:{"contains":"foo"}}, {a:"foo"})
        assert matches({a:{"contains":"foo"}}, {a:"afoo"})
        assert matches({a:{"contains":"foo"}}, {a:"foos"})
        assert not matches({a:{"contains":"foo"}}, {a:"fo"})
