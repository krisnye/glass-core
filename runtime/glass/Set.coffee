constructor: (values) ->
    @_map = new Map
    @_size = 0
    if values?
        for value in values
            @add value
    @
extends: 'Observable'
properties:
    add: (value) ->
        if not @has value
            @_map.set value, true
            @_size++
            @notifyObservers value, undefined, value
    delete: (value) ->
        result = @_map.delete value
        if result
            @_size--
            @notifyObservers value, value, undefined
        return result
    has: (value) -> @_map.has value
    values: -> @_map.keys()
    size:
        get: -> @_size
    forEach: (scope, callback) -> @_map.forEachKey scope, callback
test:
    addHasDelete: ->
        set = new Set
        set.add 1
        assert set.size is 1
        assert set.has 1
        assert set.delete(2) is false
        assert set.delete(1) is true
        assert set.size is 0
    observable: ->
        set = new Set
        lastArgs = null
        set.observe (args...) -> lastArgs = args

        set.add 4
        assertEquals lastArgs, [4, undefined, 4]

        # make sure we don't call on attempt to add twice
        lastArgs = null
        set.add 4
        assertEquals lastArgs, null

        set.delete 4
        assertEquals lastArgs, [4, 4, undefined]
