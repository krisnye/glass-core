extends: 'PartialManager'
properties:
    pattern: /^local:([$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*)\/(\{[^\(\)=]*?\})$/i
    _createObject: (uri) ->
        result = @pattern.exec uri
        type = getType result[1]
        config = JSON.parse result[3]
        return new type config
    watch: (uri, handler, connect=true) ->
        PartialManager.prototype.watch.apply this, arguments
        if connect
            # create the object if it doesn't exist yet
            object = (@objects ?= {})[uri]
            if not object?
                objects[uri] = object = @_createObject uri
            handler object
        else if not @isWatched uri
            # dispose of the no longer needed object
            object = @objects[uri]
            delete @objects[uri]
            object?.dispose?()
        return
    patch: (uri, patch) ->
        return
test: ->
    handler = new LocalManager
    assert not handler.handles 'local:foo.bar'
    assert handler.handles 'local:foo.bar/{}'
    assert handler.handles 'local:foo.bar/{"id":2}'

# todo:
# dynamically create object in response to observation
# dispose of objects automatically when no one is observing them any longer
