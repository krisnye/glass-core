require './global'
jsonSchema = require 'json-schema'

generateId = (parent, type) ->
    name = type.name
    throw new Error "type did not have a name: #{type}" unless name?
    counts = parent._Component_generateId_counts ?= {}
    count = counts[name] ?= 0
    count++
    counts[name] = count
    return "#{name}_#{count}"

module.exports = exports = Component = class glass_Component
    constructor: (properties) ->
        @initialize properties
        @

isPrimitive = (object) ->
    Object.isNumber(object) or Object.isBoolean(object) or Object.isString(object)

Component.normalizeProperties = (properties={}, definingClass) ->
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

        if definingClass?
            property.definingClass ?= definingClass
            if Object.isFunction property.value
                property.value.definingClass ?= definingClass
        properties[name] = property
    properties

Component.defineProperties = (object, properties, definingClass) ->
    properties = Component.normalizeProperties properties, definingClass
    Object.defineProperties object, properties
    properties

Component.disposeProperties = (object) ->
    for key, value of object
        if value? and value.parent is object and Object.isFunction value.dispose
            value.dispose()
    return

Component.id = "glass.Component"
Component.toString = -> @id
Component.valueOf = -> @value ? @id

state =
    constructed: 0
    initializing: 1
    initialized: 2
    disposing: 3
    disposed: 4
properties =
    # composition
    id:
        get: -> @_id
        set: (value) ->
            if @_state > state.constructed
                throw new Error "id can only be specified in constructor"
            @_id = value
        unique: true
    parent:
        get: -> @_parent
        set: (value) ->
            if @_state > state.constructed
                throw new Error "parent can only be specified in constructor"
            @_parent = value
        persist: false
    inner:
        description: "Calls the subclass defined function if present."
        value: (fn, args...)->
            # get and cache the name of the underride function
            innerName = fn.innerName ?= getUnderrideName fn.definingClass, fn.id
            @[innerName]?.apply @, args
    # lifecycle
    _state:
        value: state.constructed
        persist: false
    initialize: initialize = (properties) ->
        if properties?
            # first set ourselves onto parent if we have one
            parent = properties.parent
            if parent?
                id = properties.id ?= generateId parent, @constructor
                parent[id] = @
            # second we set all properties in case setters access parent
            for key, value of properties
                @[key] = value
        # finally we call subclass initializer
        @_state = state.initializing
        @inner initialize
        @_state = state.initialized
    dispose: dispose = ->
        if @_state < state.disposing
            @_state = state.disposing
            Component.disposeProperties @
            if @_parent?
                delete @_parent[@id]
            @inner dispose
            @_state = state.disposed
        return
    disposed:
        get: -> @_state >= state.disposed
        persist: false
    # serialization
    toJSON: ->
        values = {}
        for name, property of @constructor.properties
            if property.persist isnt false and (property.get? or @hasOwnProperty name)
                value = @[name]
                if value?.toJSON?
                    value = value.toJSON()
                values[name] = value
        values
    # discovery
    get: (id, parsed) ->
        throw new Error "id is required" unless id?
        value = @[id]
        if value?
            if value.disposed is true
                value = null
            else
                return value
        # we only throw error from the original method call.
        throwError = not parsed?
        # now we have to look for it
        # parse the id if it matches our format
        if not parsed?
            colon = id.indexOf ':'
            if colon > 0
                parsed =
                    type: id.substring 0, colon
                    properties: JSON.parse id.substring colon + 1
            else
                parsed = false
        # if we recognize the parse object then
        # check for a local factory of its type
        if parsed
            type = parsed.type
            properties = parsed.properties
            # look for a factory method with that type
            factory = this[type]
            if Object.isFunction factory
                # set this as the parent on the properties
                properties.parent = @
                isClass = factory.properties?
                if isClass
                    value = new factory properties
                else
                    value = factory properties
        # if we don't have a value, try to get from parent
        value ?= @_parent?.get?(id, parsed)
        if value?
            # cache the result locally for next time it's requested
            this[id] = value
        else if throwError
            throw new Error "Component not found: #{id}"
        return value
    # validation
    constrain: ->
        # remove obsolete properties
        # enforce minimum, maximum values
        # truncate to maxLength on strings
    validate: ->
        result = jsonSchema.validate @, @constructor
        if result.valid
            return null
        else
            return result.errors

Component.properties = Component.defineProperties Component.prototype, properties, Component

getUnderrideName = (baseDefiningClass, name) ->
    "#{baseDefiningClass.name}_subclass_#{name}"

getBaseDefiningClass = (classDefinition, properties, name) ->
    baseProperty = properties[name]
    # now traverse the underride chain.
    while true
        baseFunction = baseProperty.value
        baseDefiningClass = baseProperty.definingClass
        # search the text for a call to the underride function
        underrideName = getUnderrideName baseDefiningClass, name
        callsUnderride =
            baseFunction.toString().has(underrideName) or
            baseFunction.toString().has(/\binner\b/)
        if not callsUnderride
            throw new Error "#{classDefinition.name}.#{name} cannot be defined because #{baseDefiningClass.name}.#{name} does not call #{underrideName}."
        # now check to see if it has already been underridden
        underrideProperty = properties[underrideName]
        if underrideProperty?
            baseProperty = underrideProperty
        else
            return baseDefiningClass
    return

underride = (classDefinition, properties, rootDefiningClass, name, fn) ->
    baseDefiningClass = getBaseDefiningClass classDefinition, properties, name
    properties[getUnderrideName baseDefiningClass, name] = fn
    return

extend = (baseClass, subClassDefinition) ->
    throw new Error "missing id property" unless Object.isString subClassDefinition?.id

    subClassDefinition.name = subClassDefinition.id.replace /[\.\/]/g, '_'

    subClass = eval """
        (function #{subClassDefinition.name}(properties) {
            this.initialize(properties);
        })
    """

    subProperties = subClassDefinition.properties = Component.normalizeProperties subClassDefinition.properties, subClass
    prototype = subClass.prototype
    properties = Object.clone baseClass.properties

    for name, property of subProperties
        baseProperty = properties[name]
        if Object.isFunction baseProperty?.value
            if not Object.isFunction property.value
                throw new Error "Functions can only be overridden with other functions: #{property.value}"
            # if method defined in A, but not overrode in B, then C
            # must override the correct name from A
            underride subClassDefinition, properties, baseProperty.definingClass, name, property.value
        else
            properties[name] = property

    subClassDefinition.properties = properties
    Object.merge subClass, subClassDefinition

    Component.defineProperties prototype, properties, subClass
    # add an extend method to the subclass
    subClass.extend = (subClassDefinition) -> extend subClass, subClassDefinition
    subClass

Component.extend = (subClassDefinition) ->
    extend Component, subClassDefinition

assert = require('chai').assert
exports.test =
    "should have an id": ->
        assert Object.isString Component.id
    "its toString should return it's id": ->
        assert.equal Component.toString(), "glass.Component"
    "should have a name": ->
        assert.equal Component.name, "glass_Component"
    '#dispose': 
        'should mark self disposed': ->
            a = new Component
            a.dispose()
            assert a.disposed
        'should dispose of children': ->
            a = new Component
            b = new Component parent:a
            a.dispose()
            assert b.disposed
        'should remove property from parent': ->
            parent = {}
            a = new Component parent:parent
            a.dispose()
            assert not parent[a.id]?
    '#defineProperties': 
        "should allow primitive values": ->
            object = {}
            Component.defineProperties object,
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
    '#Constructor': 
        'should set itself as property on parent': ->
            parent = {}
            a = new Component parent:parent
            assert Object.isString a.id
            assert.equal parent[a.id], a
            a.dispose()
        'should not let late parent assignment': ->
            assert.throws ->
                a = new Component
                a.parent = {}
        'should generate a missing id if it has a parent': ->
            parent = {}
            a = new Component parent:parent
            assert Object.isString a.id
            a.dispose()
    "#get": 
        'should throw exception if instance not found': ->
            a = new Component
            assert.throws -> a.get "foo"
            a.dispose()
        'should create instances with factory': ->
            a = new Component
            b = new Component parent: a
            # register a factory on the parent a
            a[Component] = Component
            c = b.get 'glass.Component:{"x":2,"y":3}'
            assert.equal c.x, 2
            assert.equal c.y, 3
            assert.equal c.parent, a
            a.dispose()
    'extend': 
        'should inherit instance properties': ->
            SubComponent = Component.extend
                id: 'SubComponent'
            assert SubComponent.properties.id?
        'should define static properties': ->
            SubComponent = Component.extend
                id: 'SubComponent'
                staticValue: 2
            assert.equal SubComponent.staticValue, 2
        'should allow underriding constructors and functions': ->
            SubComponent = Component.extend
                id: 'SubComponent'
                properties:
                    initialize: ->
                        @constructorCalled = true
                        @
                    dispose: ->
                        @disposeCalled = true
                        return
            sub = new SubComponent
            assert sub.constructorCalled
            sub.dispose()
            assert sub.disposed
            assert sub.disposeCalled
        'should allow recursive extension': ->
            AComponent = Component.extend
                id: 'AComponent'
                properties:
                    dispose: -> # does not call AComponent_subclass_dispose
            BComponent = AComponent.extend
                id: 'BComponent'
                properties:
                    foo: ->
            return
        'should not allow final functions to be underridden': ->
            AComponent = Component.extend
                id: 'AComponent'
                properties:
                    dispose: -> # does not call AComponent_subclass_dispose
            assert.throws ->
                BComponent = AComponent.extend
                    id: 'BComponent'
                    properties:
                        dispose: -> # cannot underride this method
    'validation': 
        'should work': ->
            Person = Component.extend
                id: 'SubComponent'
                properties:
                    name:
                        type: 'string'
                        required: true
                        minLength: 2
                        maxLength: 100
                    age:
                        type: 'integer'
                        minimum: 0
                        maximum: 130
                    key:
                        type: 'string'
            invalid = new Person
                name: "a"
                age: -2
            errors = invalid.validate()
            assert errors?.length is 2, JSON.stringify errors
            valid = new Person
                name: "good"
                age: 112
            errors = valid.validate()
            if errors?.length > 0
                console.log JSON.stringify errors
            assert not errors?

