glass = require './'

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

inherit = (fn) ->
    fn.inherit = true
    return {enumerable: true, value: fn}

glass.defineProperties Component,
    id: module.id
    toString: inherit -> @id
    valueOf: inherit -> @value ? @id
    disposeProperties: (object) ->
        for key, value of object
            if value? and value.parent is object and Object.isFunction value.dispose
                value.dispose()
        return
    extend: inherit (subClassDefinition) -> extend @, subClassDefinition

properties =
    id:
        type: 'string'
        index: true
        serialize: true
        unique: true
        value: null
    parent:
        type: 'object'
        value: null
        serialize: false
    add: (child) ->
        if child?
            child.id ?= generateId @, child.constructor
            child.parent = @
            @[child.id] = child
    remove: (child) ->
        if child?.id?
            delete @[child.id]
    inner:
        description: "Calls the subclass defined function if present."
        value: (fn, args...) ->
            # get and cache the name of the underride function
            innerName = fn.innerName ?= getUnderrideName fn.definingClass, fn.id
            @[innerName]?.apply @, args
    initialize: initialize = (properties) ->
        if properties?
            for key, value of properties
                @[key] = value
        @inner initialize
    dispose: dispose = ->
        if not @disposed
            @parent?.remove?(@)
            @disposed = true
            for own key, value of @ when value? and value.parent is @ and value.dispose typeof 'function'
                value.dispose()
            @inner dispose
        return
    disposed:
        value: false
        serialize: false

glass.defineProperties Component.prototype, properties, Component
Component.properties = properties

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
    name = subClassDefinition.id?.match(/([a-z_0-9\$]+)(\.js)?$/i)?[1]
    throw new Error "missing name property" unless Object.isString name

    subClass = eval """
        (function #{name}(properties) {
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

    # inherit static properties marked inherit
    for name, value of baseClass when value?.inherit
        subClass[name] = baseClass[name]

    # add baseClass property for use in checking instance
    baseClasses = Object.clone(baseClass.baseClasses) ? {}
    baseClasses[baseClass.id] = baseClass
    subClass.baseClasses = baseClasses

    Object.merge subClass, subClassDefinition, false, false

    glass.defineProperties prototype, properties, subClass

    subClass

exports.test = do ->
    assert = require './assert'
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
            a.add b = new Component
            a.dispose()
            assert b.disposed
        'should remove property from parent': ->
            parent = new Component
            parent.add a = new Component
            a.dispose()
            assert not parent[a.id]?
    '#Constructor': 
        'should set itself as property on parent': ->
            parent = new Component
            parent.add a = new Component
            assert Object.isString a.id
            assert.equal parent[a.id], a
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

