constructor: (values) ->
    @_keys = {}
    @_values = {}
    if values?
        for key, value of values
            @set key, value
    @
extends: 'Observable'
properties:
    get: (key) -> @_values[getId key]
    set: (key, value) ->
        id = getId key
        if @_values.hasOwnProperty id
            oldValue = @_values[id]
        else
            oldValue = undefined
        @_keys[id] = key
        @_values[id] = value
        if value isnt oldValue
            @notifyObservers key, oldValue, value
        return
    delete: (key) ->
        id = getId key
        result = @_keys.hasOwnProperty id
        if result
            oldValue = @_values[id]
            delete @_keys[id]
            delete @_values[id]
            @notifyObservers key, oldValue, undefined
        result
    has: (key) -> @_keys.hasOwnProperty getId key
    keys: -> value for key, value of @_keys
    values: -> value for key, value of @_values
    size: ->
        count = 0
        for id of @_keys
            count++
        count
    forEach: (callback, scope) ->
        for id, key of @_keys
            value = @_values[id]
            callback.call scope, key, value
        return
    forEachKey: (callback, scope) ->
        for id, key of @_keys
            value = @_values[id]
            callback.call scope, key
        return
    forEachValue: (callback, scope) ->
        for id, key of @_keys
            value = @_values[id]
            callback.call scope, value
        return
test:
    observable: ->
        map = new Map
        lastArgs = null
        map.observe (args...) -> lastArgs = args

        map.set 4, 8
        assertEquals lastArgs, [4, undefined, 8]

        map.set 4, 16
        assertEquals lastArgs, [4, 8, 16]

        map.delete 4
        assertEquals lastArgs, [4, 16, undefined]

