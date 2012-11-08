name: 'UrnHandler'
extends: 'UriHandler'
constructor: ->
    UriHandler.call this, arguments
    @observed = new Map
    @
properties:
    pattern: /^urn:([$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*):(\{[^\(\)=]*?\})$/i
    observe: (uri, observer) ->
        observed = @observed.get uri
        if not observed?
            observed = null # create
    unobserve: (uri, observer) ->
test: ->
    handler = new UrnHandler
    assert not handler.handles 'urn:foo.bar'
    assert handler.handles 'urn:foo.bar:{}'
    assert handler.handles 'urn:foo.bar:{id:2}'

# todo:
# dynamically create object in response to observation
# dispose of objects automatically when no one is observing them any longer
