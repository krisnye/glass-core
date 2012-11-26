extends: 'Component'
constructor: (values) ->
    @_values = {}
    @_size = 0
    if values?
        for value in values
            @add value
    @
properties:
    add: (value) ->
        if not @has value
            @_values[getId value] = value
            @_size++
    delete: (value) ->
        if not @has value
            false
        else
            delete @_values[getId value]
            @_size--
            true
    has: (value) -> @_values.hasOwnProperty getId value
    values: -> glass.values @_values
    size:
        get: -> @_size
    forEach: (callback, scope) ->
        for key, value of @_values
            callback.call scope, value
        return
test:
    addHasDelete: ->
        set = new Set
        set.add 1
        assert set.size is 1
        assert set.has 1
        assert set.delete(2) is false
        assert set.delete(1) is true
        assert set.size is 0