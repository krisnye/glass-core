Key = require './Key'

parseKey = (namespace, keystring) ->
    key = new Key namespace, keystring
    throw new Error "400 missing typeName #{path}" unless key.type?
    return key

module.exports = exports = KeyLayer = (require './DataLayer').extend
    id: module.id
    description: "Parses keystrings into keys using the namespace property."
    properties:
        namespace:
            type: 'string'
            required: true
        patch: (key, object) ->
            if Object.isString key
                key = parseKey @namespace, key
            @parent.patch key, object
        watch: (key, handler) ->
            if Object.isString key
                key = parseKey @namespace, key
            @parent?.watch key, handler
