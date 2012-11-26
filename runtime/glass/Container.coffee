constructor: ->
    @_metaWatchers = {}
    @_components = {}
    @
properties:
    watch: (uri, watcher) ->
        info = @_getInfo uri, true
        id = getId watcher
        if info.watchers.hasOwnProperty id
            throw "#{uri} is already watched by #{watcher.toString()}"
        watchers[id] = watcher
        info.count++
        # call the watcher immediately if we have a value for the uri
        if info.value isnt undefined
            watcher info.value, info.value
        # if this is the first watcher then notify metaWatchers
        if info.count is 1
            @_notifyMetaWatchers uri, true
        return
    unwatch: (uri, watcher) ->
        info = @_getInfo uri, false
        id = getId watcher
        if not info?.watchers.hasOwnProperty id
            throw "#{uri} is not watched by #{watcher.toString()}"
        delete watchers[id]
        info.count--
        # call the watcher immediately if we have a value for the uri
        if info.value isnt undefined
            watcher undefined, undefined
        # if this is the first watcher then notify metaWatchers
        if info.count is 0
            delete @_components[uri]
            @_notifyMetaWatchers uri, true
        return
    patch: (uri, patch) ->
        info = @_getInfo uri
        newValue = info.value = JSONPatch.apply info.value, patch
        for id, watcher of info.watchers
            watcher newValue, patch
        return
    _getInfo: (uri, create) ->
        info = @_components[uri]
        if not info? and create
            info = @_components[uri] = { watchers: {}, count: 0, value: undefined }
        info
    # meta watchers are notified whenever a uri is initially watched, or is no longer watched
    # they are called with parameters (uri, isWatched)
    metaWatch: (watcher) ->
        id = getId watcher
        @_metaWatchers[id] = watcher
        # immediately call the metaWatcher with current watch values
        for uri, info of @_components when info.count > 0
            watcher uri, true
        return
    metaUnwatch: (watcher) ->
        id = getId watcher
        delete @_metaWatchers[id]
        return
    _notifyMetaWatchers: (uri, watched) ->
        for id, watcher of @_metaWatchers
            watcher uri, watched

test: ->
    console.log "TODO: Test Container watch/patch/metaWatch"

