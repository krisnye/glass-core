
# minimalist assert functions created so I can remove previous dependency on chai.
assert = (condition) ->
    if not condition
        throw new Error "Assert failed: #{condition}"
assert.equal = (a, b) ->
    if not `a == b`
        throw new Error "#{a} != #{b}"
assert.deepEqual = (a, b) ->
    if not Object.equal a, b
        throw new Error "#{a} not equal #{b}"
assert.throws = (fn) ->
    try
        fn()
        throw new Error "Should have thrown error: #{fn.toString()}"
    catch e
        return

module.exports = assert