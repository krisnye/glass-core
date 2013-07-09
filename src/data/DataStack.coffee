glass = require '../'

module.exports = DataStack = (require './DataLayer').extend
    id: module.id
    properties:
        initialize: ->
            unless @layers.length >= 1
                throw new Error "layers array property is required"
            for layer in @layers by -1
                @top = glass.deserialize layer, {parent:@top ? @}
        patch: patch = (key, values) ->
            @top.patch key, values
        watch: watch = (key, handler) ->
            @top.watch key, handler
