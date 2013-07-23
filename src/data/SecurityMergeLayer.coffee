patch = require '../patch'

module.exports = SecurityMergeLayer = (require './DataLayer').extend
    id: module.id
    properties:
        getSecurityContext: (key) ->
            require('./SecurityContext').getSecurityContext key, @parent
        _pruneResults: (key, security, results) ->
            if security?
                # now apply security rules to prune the results
                if key.id?
                    # single results
                    results = security.prune results, 'read'
                else
                    # multiple results
                    for name, value of results
                        value = security.prune value, 'read'
                        if not value?
                            # we really shouldn't need to prune any entire results from a query.
                            console.log 'WARNING: Pruning results #{name} from query: #{key}'
                            delete results[name]
            return results
        patch: (key, values) ->
            if not key.id?
                throw new Error "Cannot patch query #{key}"

            # check that we are allowed to query first.
            security = @getSecurityContext key

            current = @watch key

            if security?
                security.document = current
                security.schema = key.type
                if not security.canWrite()
                    # consider patching some user meta data here.
                    throw new Error "403 Access Denied"

            if current?
                # apply security pruning to the patch values.

                # apply patch.
                values = patch.apply current, values

            # check security access to patch the whole thing.
            results = @parent?.patch key, values
            # then prune them with security context
            results = @_pruneResults key, security, results
            # and return them
            return results
        watch: (key, handler) ->
            # check that we can even do this query
            security = @getSecurityContext key
            # we can, so get the results
            results = @parent?.watch key, handler
            # then prune them with security context
            results = @_pruneResults key, security, results
            # and return them
            return results
