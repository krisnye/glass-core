
module.exports = Task = (require '../Persistent').extend
    id: 'glass-core/data/sample/Task'
    properties:
        projectId:
            foreignKey:
                type: 'Project'
                #property: 'id'
            required: false
            index: true
        name:
            type: 'string'
            required: true
            minLength: 2
            maxLength: 128
        milestone:
            type: 'boolean'
            required: true
            default: false
        complete:
            type: 'integer'
            required: true
            default: 0
            minimum: 0
            maximum: 100
