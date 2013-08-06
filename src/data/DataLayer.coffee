
# a DataLayer must implement 2 methods:
#   patch(key, values)
#   watch(key, handler)

module.exports = DataLayer = (require '../Component').extend
    id: module.id
    properties:
        # updates a component with new values
        patch: patch = (key, values) ->
            # console.log "<#{@constructor.name} patch> (#{key}) (#{values})"
            result = @inner patch, key, values
            # console.log "</#{@constructor.name} patch> (#{key}) (#{result})"
            return result
        # watches a component for changes
        watch: watch = (key, handler) ->
            # console.log "<#{@constructor.name} watch> (#{key})"
            result = @inner watch, key, handler
            # console.log "</#{@constructor.name} watch> (#{key})"
            return result

