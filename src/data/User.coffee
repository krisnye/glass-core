
module.exports = User = (require '../Component').extend
    id: module.id
    persistent: true
    properties:
        email:
            type: 'string'
            index: true
        authDomain:
            type: 'string'
            index: true
        federatedIdentity:
            type: 'string'
            index: true
        nickname:
            type: 'string'
        isAdmin:
            type: 'boolean'
        token:
            type: 'string'
            index: true
        loginUrl:
            type: 'string'
            format: 'uri'
        logoutUrl:
            type: 'string'
            format: 'uri'

