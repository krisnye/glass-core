require './global'

isPrimitive = (object) ->
    Object.isNumber(object) or Object.isBoolean(object) or Object.isString(object)

normalizeProperties = (properties={}, defaults) ->
    if Object.isFunction defaults
        defaults = definingClass: defaults

    for name, property of properties
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
        properties[name] = property
    properties

defineProperties = (object, properties, defaults) ->
    properties = normalizeProperties properties, defaults
    Object.defineProperties object, properties
    properties

defineProperties exports,
    isPrimitive: isPrimitive
    normalizeProperties: normalizeProperties
    defineProperties: defineProperties
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
    serialize: serialize = do ->
        value = (object) -> JSON.stringify object
        value.typeKey = '$type'
        value
    deserialize: deserialize = do ->
        fromJSON = (value) ->
            if Object.isString typeId = value?[serialize.typeKey]
                delete value[serialize.typeKey]
                try
                    type = require typeId
                catch e
                    throw new Error "#{typeId} specified in JSON value #{JSON.stringify value} was not found: #{e}"
            if type?
                if Object.isFunction type.fromJSON
                    value = type.fromJSON value, fromJSON
                else
                    value = new type value
            value
        (string, defaults) ->
            if Object.isObject string
                json = Object.clone string
            else
                json = JSON.parse string
            if defaults? and Object.isObject json
                Object.merge json, defaults, false, false
            fromJSON json

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
            defineProperties object,
                f: -> "function"
                i: 2
                b: true
                a: []
                s: "hello"
            assert Object.isFunction object.f
            assert.equal object.f(), "function"
            assert.equal object.i, 2
            assert.equal object.b, true
            assert Object.equal object.a, []
            assert.equal object.s, "hello"
