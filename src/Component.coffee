glass = require './'
jsonSchema = require 'json-schema'

generateId = (parent, type) ->
    name = type.name
    throw new Error "type did not have a name: #{type}" unless name?
    counts = parent._Component_generateId_counts ?= {}
    count = counts[name] ?= 0
    count++
    counts[name] = count
    return "#{name}_#{count}"

module.exports = exports = Component = class Component
    constructor: (properties) ->
        @initialize properties
        @

serializeProperty = (object, name, property) ->
    property ?= object.constructor.properties?[name]
    if property?.serialize?
        return property.serialize
    if property?.get?
        return false
    if name[0] is '_'
        return false
    return object.hasOwnProperty name

glass.defineProperties Component, (
    isComponentType: (type) -> type? and type.id? and type.properties? and type.extend?
    id: module.id
    toString: -> @id
    valueOf: -> @value ? @id
    disposeProperties: (object) ->
        for key, value of object
            if value? and value.parent is object and Object.isFunction value.dispose
                value.dispose()
        return
    fromJSON: (values, fromFunction) ->
        getComponentType = (value) ->
            typeId = value?[glass.serialize.typeKey.toString()]
            if typeId? and Component.isComponentType type = require typeId
                return type
            return null

        # remove sub-components from properties
        children = null
        for key, value of values
            if getComponentType(value)?
                children ?= {}
                children[key] = value
                delete values[key]
            else
                values[key] = fromFunction value
        # construct the value
        parent = new @ values
        # create the children
        if children?
            for key, value of children
                value.id = key
                value.parent = parent
                fromFunction value
        parent
    extend: (subClassDefinition) ->
        extend @, subClassDefinition
    ), {enumerable: true}

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
            if @_state is state.constructed
                @_id = value
            value
        serialize: true
        unique: true
    parent:
        get: -> @_parent
        set: (value) ->
            if @_state is state.constructed
                @_parent = value
            value
        serialize: false
    inner:
        description: "Calls the subclass defined function if present."
        value: (fn, args...) ->
            # get and cache the name of the underride function
            innerName = fn.innerName ?= getUnderrideName fn.definingClass, fn.id
            @[innerName]?.apply @, args
    # lifecycle
    _state:
        value: state.constructed
        serialize: false
    serialize:
        value: true
        serialize: false
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
        # if the parent is initializing then this component
        # shouldn't be serializeed since the parent will just
        # add it again when deserialized and reinitialized.
        if @parent?._state is state.initializing
            @serialize = false
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
        serialize: false
    # serialization
    toJSON: ->
        values = {}
        # write the type
        values[glass.serialize.typeKey.toString()] = @constructor.id
        # declared properties
        for name, property of @constructor.properties
            if serializeProperty @, name, property
                value = @[name]
                if value?.serialize isnt false
                    if value?.toJSON?
                        value = value.toJSON()
                    values[name] = value
        # dynamic properties
        for name, value of @ when not values.hasOwnProperty name
            if serializeProperty @, name
                if value?.serialize isnt false
                    if value?.toJSON?
                        value = value.toJSON()
                    values[name] = value
        values
    # discovery
    get: get = (id, parsed) ->
        throw new Error "id is required" unless id?

        value = @inner get, id, parsed
        if value isnt undefined
            return value

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

Component.properties = glass.defineProperties Component.prototype, properties, Component

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
    subClassDefinition.name ?= subClassDefinition.id?.match(/([a-z_0-9\$]+)(\.js)?$/i)?[1]
    throw new Error "missing name property" unless Object.isString subClassDefinition.name

    subClass = eval """
        (function #{subClassDefinition.name}(properties) {
            this.initialize(properties);
        })
    """

    subProperties = subClassDefinition.properties = glass.normalizeProperties subClassDefinition.properties, subClass
    prototype = subClass.prototype
    properties = Object.clone baseClass.properties

    for name, property of subProperties
        baseProperty = properties[name]
        if Object.isFunction(baseProperty?.value) and baseProperty.override isnt true
            if not Object.isFunction property.value
                throw new Error "Functions can only be overridden with other functions: #{property.value}"
            # if method defined in A, but not overrode in B, then C
            # must override the correct name from A
            underride subClassDefinition, properties, baseProperty.definingClass, name, property.value
        else
            properties[name] = property

    subClassDefinition.properties = properties

    # add an extend method to the subclass
    for name in ["extend", "fromJSON", "toString", "valueOf"]
        subClass[name] = Component[name]

    Object.merge subClass, subClassDefinition, false, false

    glass.defineProperties prototype, properties, subClass

    subClass

assert = require('chai').assert
exports.test =
    "should have an id": ->
        assert Object.isString Component.id
    "its toString should return it's id": ->
        assert.equal Component.toString(), Component.id
    "should have a name": ->
        assert.equal Component.name, "Component"
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
    '#Constructor': 
        'should set itself as property on parent': ->
            parent = {}
            a = new Component parent:parent
            assert Object.isString a.id
            assert.equal parent[a.id], a
            a.dispose()
        'should not let late parent assignment': ->
            a = new Component
            a.parent = {}
            assert not a.parent?
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
            SubComponent = Component.extend
                id: 'SubComponent'
            a = new Component
            b = new Component parent: a
            # register a factory on the parent a
            a[SubComponent] = SubComponent
            c = b.get 'SubComponent:{"x":2,"y":3}'
            assert.equal c.x, 2
            assert.equal c.y, 3
            assert.equal c.parent, a
            a.dispose()
    'serialize': ->
        SubComponent = Component.extend
            id: module.id # have to deserialize as component since we aren't our own module
            properties:
                initialize: ->
                    new Component
                        id: 'a'
                        parent: @
        s = new SubComponent()
        p = new Component
            parent: s
            foo: 2
        assert.equal s.serialize, true
        assert s.a?, 'child component a exists.'
        assert.equal s.a.serialize, false
        serialized = glass.serialize s
        # assert.equal serialized, '{"$type":"SubComponent","Component_1":{"$type":"glass-core/Component","foo":2}}'
        result = glass.deserialize serialized
        assert.equal result.Component_1?.parent, result
        assert.equal result.Component_1?.foo, 2
        # this is not a perfect test because we changed the type of the reconstituted value
        assert.equal serialized, glass.serialize result
    'extend':
        'should inherit instance properties': ->
            SubComponent = Component.extend
                name: 'SubComponent'
            assert SubComponent.properties.id?
        'should define static properties': ->
            SubComponent = Component.extend
                name: 'SubComponent'
                staticValue: 2
            assert.equal SubComponent.staticValue, 2
        'should allow underriding constructors and functions': ->
            SubComponent = Component.extend
                name: 'SubComponent'
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
                name: 'AComponent'
                properties:
                    dispose: -> # does not call AComponent_subclass_dispose
            BComponent = AComponent.extend
                name: 'BComponent'
                properties:
                    foo: ->
            return
        'should not allow final functions to be underridden': ->
            AComponent = Component.extend
                name: 'AComponent'
                properties:
                    dispose: -> # does not call AComponent_subclass_dispose
            assert.throws ->
                BComponent = AComponent.extend
                    name: 'BComponent'
                    properties:
                        dispose: -> # cannot underride this method
    'validation': 
        'should work': ->
            Person = Component.extend
                name: 'SubComponent'
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

