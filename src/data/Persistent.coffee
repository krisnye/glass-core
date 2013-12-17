Key = require './Key'

module.exports = Persistent = (require '../Component').extend
    id: module.id
    persistent: true
    properties:
        id:
            required: true
        key:
            get: ->
                if not @_key?
                    namespace = Key.getNamespaceFromModuleId @constructor.id
                    key = new Key namespace, @id
                    if key.type isnt @constructor
                        throw new Error "Key #{@id} should be type #{@constructor}."
                    if key.query?
                        throw new Error "Key #{@id} should not have a query."
                    if not key.id?
                        throw new Error "Key #{@id} should have an id."
                    @_key = key
                return @_key

