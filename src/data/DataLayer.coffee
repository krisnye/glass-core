
# a DataLayer must implement 2 methods:
#   patch(key, values)
#   watch(key, handler)

module.exports = DataLayer = (require '../Component').extend
    id: module.id
    properties:
        # updates a component with new values
        patch: patch = (key, values) ->
            console.log "begin patch (#{key})", @constructor
            @inner patch, key, values
        # watches a component for changes
        watch: watch = (key, handler) ->
            console.log "begin watch (#{key})", @constructor
            @inner watch, key, handler

