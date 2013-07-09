jsonSchema = require 'json-schema'

module.exports = ValidationLayer = (require './DataLayer').extend
    id: module.id
    properties:
        # updates a component with new values
        patch: (key, values) ->
            schema = key.type
            result = jsonSchema.validate values, schema
            if not result.valid
                throw new Error "422 " + JSON.stringify result.errors
            @parent?.patch key, values
        # watches a component for changes
        watch: (key, handler) ->
            @parent?.watch key, handler
