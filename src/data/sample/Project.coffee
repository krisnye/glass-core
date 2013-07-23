
module.exports = Project = (require '../Persistent').extend
    id: module.id
    persistent: true
    security:
        query: (key, get) ->
            # projects are only contained/owned by Users.
            user = get "User/me"
            if key.isAncestor user.id
                {user:user}
            else
                false
    properties:
        name:
            type: 'string'
            required: true
            minLength: 2
            maxLength: 128
        options:
            properties:
                public:
                    type: 'boolean'
                unreadable:
                    type: 'string'
                    security:
                        read: false
        milestones:
            foreignCopy:
                type: 'Task'
                #property: 'projectId'
                predicate: (x) -> x.milestone
                filter: (x) ->
                    id: x.id
                    name: x.name
                    complete: x.complete

