XMLHttpRequest = require './XMLHttpRequest'
AjaxLayer = require './AjaxLayer'
patch = require '../patch'
Key = require './Key'

module.exports = exports = CacheLayer = (require './DataLayer').extend
    id: module.id
    properties:
        initialize: initialize = ->
            @watched = {}
            @inner initialize
        _patchLocal: (key, object) ->
            meta = @watched[key]
            if meta? and patch.isChange meta.value, object
                # clone to prevent shared references on the way in.
                object = Object.clone object, true
                meta.value = patch.apply meta.value, object
                # check and make sure all modified values still match
                if not key.id? and key.query?
                    for id, item of meta.value
                        # make sure it still should stay
                        itemKey = new Key key.namespace, id
                        if not key.isMatch itemKey, item
                            # console.log 'REMOVE ' + itemKey
                            delete meta.value[id]
                            object[id] = null
                for watcher in meta.watchers
                    # clone to prevent shared references on the way out
                    object = Object.clone object, true
                    watcher object
            if key.id?
                for name, meta of @watched when not meta.key.id?
                    # does this query contain this entity?
                    if meta.value?[key]?
                        subPatch = {}
                        subPatch[key] = object
                        @_patchLocal meta.key, subPatch
                    else if meta.key.isMatch key, object
                        if object?.$type?
                            subPatch = {}
                            subPatch[key] = object
                            @_patchLocal meta.key, subPatch
                        else
                            # we need to load the full entity
                            @get(AjaxLayer).send key, undefined, (value) =>
                                # console.log 'Loaded full ' + key
                                @_patchLocal key, value
            return
        patch: (key, object) ->
            result = @parent.patch key, object
            @_patchLocal key, object
            return result
        watch: (key, handler) ->
            if not handler?
                # we always deep clone before sending to clients
                object = Object.clone @watched[key]?.value, true
                return object
            meta = @watched[key] ?=
                key: key
                value: undefined
                watchers: []
                unwatch: null
            meta.watchers.add handler
            meta.unwatch ?= @parent.watch key, (object) =>
                @_patchLocal key, object
            if meta.value isnt undefined
                handler meta.value
            return unwatch = =>
                meta.watchers.remove handler
                if meta.watchers.length is 0
                    delete @watched[key]
