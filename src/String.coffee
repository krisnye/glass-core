
Object.merge String.prototype,
    isId: -> /^[^\d\W]\w*$/.test @

exports.test = do ->
    assert = require('chai').assert
    '#isId':
        "should match foo": -> assert "foo".isId()
        "should not match <foo>": -> assert not "<foo>".isId()
        "should not match 2foo": -> assert not "2foo".isId()

