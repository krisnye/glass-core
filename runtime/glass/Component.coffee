extends: 'Observable'
constructor: (properties) ->
    @patch properties
    # now site ourselves on our parent
    if @parent
        id = getId @
        patch @parent, id, @
    @
properties:
    id:
        description: 'string which uniquely identifies this component within its parent'
        type: 'string'
    parent:
        description: 'the object that contains this component'
        serializable: false
        type: 'object'
    disposed: false
    dispose: -> @patch 'disposed', true
    notify: (change) ->
        Observable.prototype.notify.apply this, arguments
        if change?.disposed
            # dispose of any disposable children
            for id, child of @ when child?.parent is @
                child.dispose?()
            # remove self from parent
            if @id and @parent
                patch @parent, @id, undefined
        return
test:
    lifecycle: ->
        parent = new Component
        assert not parent.id?
        assert not parent.parent?
        child = new Component parent:parent
        # id should be automatically assigned
        assert isString child.id
        assert parent is child.parent
        assert parent[child.id] is child
        assert parent.hasOwnProperty child.id
        parent.dispose()
        assert child.disposed is true
        assert not parent.hasOwnProperty child.id
    nonEnumerability: ->
        visibleKeys = (key for key of new Component)
        assertEquals visibleKeys, []