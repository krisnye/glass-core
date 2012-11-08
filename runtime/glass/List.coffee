constructor: (values) ->
    if @.constructor isnt List
        new List values
    else
        @_values = if values then values.slice 0 else []
        @
extends: 'Observable'
properties:
    add: (value) ->
        index = @_values.length
        @_values.push value
        @notifyObservers index, undefined, value
        return
    delete: (value) ->
        index = @lastIndexOf(value)
        if index >= 0
            @_values.splice index, 1
            @notifyObservers index, value, undefined
            # send notify
            true
        else
            false
    has: (value) -> @lastIndexOfIdentical(value) >= 0
    length:
        get: -> @_values.length
    values: -> @_values.slice 0
    indexOf: (value) -> indexOfIdentical @_values, value
    lastIndexOf: (value) -> lastIndexOfIdentical @_values, value
    forEach: (callback, scope) ->
        for value in @_values
            callback.call scope, value
        return
    toJSON: -> @_values

indexOfIdentical: (array, item) ->
    for value, index in array
        if value is item
            return index
    return -1

lastIndexOfIdentical: (array, item) ->
    for index in [array.length - 1 .. 0] by -1
        value = array[index]
        return index if value is item
    return -1

test:
    compatibility: ->
        list = new List [1,2,3,4,3,5]
        assertEquals list, [1,2,3,4,3,5]
        # this should remove the last value of 3 from the list
        list.delete 3
        assertEquals list, [1,2,3,4,5]
        list.delete 5
        assertEquals list, [1,2,3,4]
        list.delete 1
        assertEquals list, [2,3,4]
        assertEquals list.length, 3

        # test construction without new
        list2 = List [1,2,3]
        throw new Error "list2 isn't a List" unless list2.constructor is List
        assertEquals list2, [1,2,3]
        return
    observable: ->
        list = new List [1,2,3]
        lastArgs = null
        list.observe (args...) -> lastArgs = args

        list.add 4
        assertEquals lastArgs, [3, undefined, 4]

        list.delete 2
        assertEquals lastArgs, [1, 2, undefined]

