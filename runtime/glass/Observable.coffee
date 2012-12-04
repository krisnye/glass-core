properties:
    is: (type) -> @constructor.implements[type.path ? type] is true
    watchers:
        serializable: false
    watch: (property, watcher) ->
        if isFunction property
            watcher = property
            property = ''
        id = getId watcher
        @patch 'watchers', property, id, watcher
        # returns a function which will remove the watch
        => @patch 'watchers', property, getId(watcher), undefined
    patch: (change) ->
        if arguments.length > 1
            change = JSONMergePatch.create.apply null, arguments
        try
            JSONMergePatch.apply this, change
        catch e
            console.log e
        finally
            @notify change
        return
    notify: (change) ->
        if @watchers?
            if arguments.length > 1
                change = JSONMergePatch.create.apply null, arguments
            for property, watchers of @watchers
                if property.length is 0 or change.hasOwnProperty property
                    changeArg = if property.length is 0 then change else change[property]
                    for id, watcher of watchers
                        watcher this, changeArg
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
    toJSON: ->
        # I need this test later
        # on a class that actually has serializable properties
        a = new Observable
        a.x = 12
        a.y = ->
        a.z = true
        assertEquals a, {class:'glass.Observable', x:12,z:true}
    watchAll: ->
        # we should actually be able to watch ourselves get added to watchers
        # this is very meta.
        a = new Observable
        watchArgs = []
        watcher = (source, patch) ->
            watchArgs.push source, patch
        unwatch = a.watch watcher
        # now make sure we were called with our own watcher
        assert watchArgs[0] is a
        assert watchArgs[1]?.watchers?[""]?
        # reset watchArgs, and watch something else
        watchArgs.length = 0
        a.patch "a", "b", 3
        assertEquals a.a, {b:3}
        assert watchArgs[0] is a
        assertEquals watchArgs[1], {a:{b:3}}
        # now unwatch
        unwatch()
        # make sure universal watcher is now empty
        assertEquals a.watchers[""], {}
        # now reset and do a new event, make sure we don't see it.
        watchArgs.length = 0
        a.patch "a", "b", 3
        assert watchArgs.length is 0
    watchProperty: ->
        # watch a property
        a = new Observable
        watchArgs = []
        watcher = (source, patch) ->
            watchArgs.push source, patch
        unwatch = a.watch "foo", watcher
        # now make sure we were not called
        assert watchArgs.length is 0
        # reset watchArgs, and watch something else
        a.patch "foo", "b", 3
        assertEquals a.foo, {b:3}
        assert watchArgs[0] is a
        assertEquals watchArgs[1], {b:3}
        # now reset and do a different property, make sure we don't see it.
        watchArgs.length = 0
        a.patch "a", "b", 3
        assert watchArgs.length is 0
        # now unwatch
        unwatch()
        # make sure we no longer see foo
        watchArgs.length = 0
        a.patch "foo", "b", 4
        assert watchArgs.length is 0

