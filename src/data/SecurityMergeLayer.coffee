patch = require '../patch'

module.exports = SecurityMergeLayer = (require './DataLayer').extend
    id: module.id
    properties:
        getSecurityContext: (key) ->
            require('./SecurityContext').getSecurityContext key, @parent
        patch: (key, values) ->
            if not key.id?
                throw new Error "Cannot patch query #{key}"

            # check that we are allowed to query first
            security = @getSecurityContext key
            console.log JSON.stringify security, null, '   '

            current = @watch key

            security.document = current
            if not security.canRead()
                # consider patching some user meta data here.
                throw new Error "403 Access Denied"

            if current?
                # apply security pruning to the patch values

                # apply patch
                values = patch.apply current, values

            # check security access to patch the whole thing

            @parent?.patch key, values
        watch: (key, handler) ->

            # check security to watch these records
            @parent?.watch key, handler
