glassSchema = require '../schema'

module.exports = ValidationLayer = (require './DataLayer').extend
    id: module.id
    properties:
        # updates a component with new values
        patch: (key, values) ->
            schema = key.type
            errors = glassSchema.validate values, schema
            if errors?
                throw new Error "422 " + JSON.stringify errors
            @parent?.patch key, values
        # watches a component for changes
        watch: (key, handler) ->
            @parent?.watch key, handler
