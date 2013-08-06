Key = require './Key'

module.exports = Persistent = (require '../Component').extend
    id: module.id
    persistent: true
    properties:
        id:
            required: true
        initialize: initialize = ->
            # there MUST be an id and it must be a valid key with no query
            namespace = Key.getNamespaceFromModuleId @constructor.id
            key = new Key namespace, @id
            if key.type isnt @constructor
                throw new Error "Key #{@id} should be type #{@constructor}."
            if key.query?
                throw new Error "Key #{@id} should not have a query."
            if not key.id?
                throw new Error "Key #{@id} should have an id."
            @_key = key
            @inner initialize
        key:
            get: -> @_key

