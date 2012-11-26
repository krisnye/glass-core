extends: 'Component'
properties:
    pattern: null
    handles: (uri) -> @pattern?.test(uri) is true
    isWatched: (uri) -> @_watchers?[uri]?
    notify: (uri, value) ->
        @_watchers?[uri]?.forEach (handler) -> handler value
    watch: (uri, handler, connect=true) ->
        if connect
            watchers = @_watchers ?= {}
            set = watchers[uri] ?= new Set
            set.add handler
        else
            watchers = @_watchers?[uri]
            if not watchers?.delete handler
                throw new Error "#{uri} was not watched by #{handler}"
            if watchers.size is 0
                delete @_watchers[uri]
        return
    patch: (uri, patch) ->
test: ->
    handler = new PartialManager {pattern:/^ab*$/}
    assert handler.handles "a"
    assert handler.handles "abbbbb"
    assert not handler.handles "abc"
