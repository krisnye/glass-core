properties:
    is: (type) -> @constructor.implements[type.path ? type] is true
    observers:
        observable: false
        serializable: false
    observe: (key, observer) ->
        if not observer?
            observer = key
            key = null
        @observers ?= new Map
        keyObservers = @observers.get key
        if not keyObservers?
            @observers.set key, keyObservers = new Set
        keyObservers.add observer
        return
    unobserve: (key, observer) ->
        if not observer?
            observer = key
            key = null
        keyObservers = @observers?.get(key)
        if not keyObservers?.delete(observer)
            throw new Error "observer not found"
        # remove the set of keyObservers if it is empty
        if keyObservers.size is 0
            @observers.delete key
        return
    notifyObservers: (key, oldValue, newValue) ->
        if @observers?
            allObservers = @observers.get(null)
            keyObservers = @observers.get key
            if allObservers? or keyObservers?
                callback = (observer) ->
                    observer.call @, key, oldValue, newValue
                allObservers?.forEach callback, @
                keyObservers?.forEach callback, @
        return
    toJSON: ->
        values =
            class: @constructor.path
        # serialize statically defined properties
        for name, property of @constructor.properties
            value = @[name]
            if property.serializable isnt false and not isFunction(value)
                values[name] = value
        # serialize custom properties if allowed by schema
        if @constructor.additionalProperties isnt false
            for own name, value of @ when not isPrivate name
                values[name] = value
        values
    toString: -> @toJSON()

test:
    notifyObservers: ->
        a = new Observable
        lastArgs = null
        a.observe observer = (args...) -> lastArgs = args
        a.foo = 1
        a.notifyObservers 'foo', undefined, 1
        assertEquals lastArgs, ['foo', undefined, 1]
        a.unobserve observer
        lastArgs = null
        # make sure we don't see changes now
        a.notifyObservers 'foo', undefined, 1
        assertEquals lastArgs, null

    toJSON: ->
        # I need this test later
        # on a class that actually has serializable properties
        a = new Observable
        a.x = 12
        a.y = ->
        a.z = true
        assertEquals a, {class:'glass.Observable', x:12,z:true}
