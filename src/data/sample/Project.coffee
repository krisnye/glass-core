

module.exports = Project = (require '../../Component').extend
    id: module.id
    persistent: true
    properties:
        name:
            type: 'string'
            required: true
            minLength: 2
            maxLength: 128
        milestones:
            foreignCopy:
                type: 'Task'
                #property: 'projectId'
                predicate: (x) -> x.milestone
                filter: (x) ->
                    id: x.id
                    name: x.name
                    complete: x.complete

