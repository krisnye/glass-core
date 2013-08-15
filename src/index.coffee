require './global'

isPrimitive = (object) ->
    not object? or Object.isNumber(object) or Object.isBoolean(object) or Object.isString(object)

normalizeProperty = (name, property, defaults) ->
    if Object.isFunction(property)
        property =
            writable: false
            value: property
    else if not property? or isPrimitive(property) or Object.isArray(property)
        property =
            value: property

    if not property.get? and not property.set? and not property.hasOwnProperty('value')
        property.value = undefined

    if property.hasOwnProperty 'value'
        # default property values to writable
        property.writable ?= true

    # set the id of functions to their property name
    if Object.isFunction property.value
        property.value.id ?= name

    if defaults?
        Object.merge property, defaults, true, false

    if property.definingClass?
        if Object.isFunction property.value
            property.value.definingClass ?= property.definingClass

    property

normalizeProperties = (properties = {}, defaults) ->
    if Object.isFunction defaults
        defaults = definingClass: defaults

    for name, property of properties
        properties[name] = normalizeProperty name, property, defaults
    properties

defineProperties = (object, properties, defaults) ->
    properties = normalizeProperties properties, defaults
    Object.defineProperties object, properties
    return object

defineProperties exports,
    isPrimitive: isPrimitive
    normalizeProperty: normalizeProperty
    normalizeProperties: normalizeProperties
    defineProperties: defineProperties
    nextTick: (fn) -> setTimeout fn, 0
    first: (a) ->
        if not a?
            return null
        else if Array.isArray a
            return a[0]
        else
            for key, value of a
                return value
    cache: (name, fn) ->
        (object = @) ->
            if not object.hasOwnProperty name
                object[name] = fn object
            object[name]
    freeze: freeze = (object, deep = true) ->
        Object.freeze object
        if deep
            for own key, value of object when Object.isObject value
                freeze value, deep
        object
    match: (regex, map, string) ->
        result = regex.exec string
        return null unless result?
        object = {}
        for key, value of map
            if result[value]?
                object[key] = result[value]
        object
    parse: parse = (string) -> JSON.parse string
    stringify: stringify = (value) -> JSON.stringify value
    serialize: serialize = do ->
        value = (object) -> stringify object
        value.typeKey = '$type'
        value
    deserialize: deserialize = do ->
        fromJSON = (value) ->
            if Object.isString typeId = value?[serialize.typeKey]
                try
                    type = deserialize.require typeId
                catch e
                    throw new Error "#{typeId} specified in JSON value #{JSON.stringify value} was not found: #{e}"
                delete value[serialize.typeKey]
            if type?
                if Object.isFunction type.fromJSON
                    value = type.fromJSON value, fromJSON
                else
                    value = new type value
            value
        result = (string, defaults) ->
            if Object.isObject string
                json = Object.clone string
            else
                json = parse string
            if defaults? and Object.isObject json
                Object.merge json, defaults, false, false
            fromJSON json
        # store the type loader statically on the result
        result.require = require
        return result

exports.test = do ->
    assert = require('chai').assert
    cache: ->
        count = 0
        cacheCount = exports.cache "_foo", -> ++count
        x = {}
        r1 = cacheCount x
        r2 = cacheCount x
        assert.deepEqual x, {_foo: 1}
        assert.equal r1, 1
        assert.equal r1, r2
    defineProperties: 
        "should allow primitive values": ->
            object = {}
            result = defineProperties object,
                f: -> "function"
                i: 2
                b: true
                a: []
                s: "hello"
            assert.equal object, result
            assert Object.isFunction object.f
            assert.equal object.f(), "function"
            assert.equal object.i, 2
            assert.equal object.b, true
            assert Object.equal object.a, []
            assert.equal object.s, "hello"
