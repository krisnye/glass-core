
glass = require './'

observe = (object, handler) ->
    Object.observe object, handler
    exports.watchCount++
unobserve = (object, handler) ->
    Object.unobserve object, handler
    exports.watchCount--

glass.defineProperties module.exports,
    watchCount: 0
    # must never respond with a value until AFTER function call returns
    watchProperty: watchProperty = (object, name, observer) ->
        callback = (changes) ->
            if not name?
                # when watching a whole object, we do send full changes
                # this optimization is used by 'for' function
                observer object, changes
            else
                for change in changes when name is change.name
                    observer object[name]
                    break
        observe object, callback
        return ->
            unobserve object, callback
    # must never respond with a value until AFTER function call returns
    watchPath: watchPath = (object, path, observer) ->
        throw new Error "object is required" if glass.isPrimitive object
        if Object.isString path
            path = path.split '.'
        property = path[0]
        remainder = path.slice 1
        subValue = undefined
        unwatchSubProperty = null
        setSubValue = (value) ->
            if subValue isnt value
                subValue = value
                # unwatch old value
                if unwatchSubProperty?
                    unwatchSubProperty()
                    unwatchSubProperty = null
                # watch new value
                if not glass.isPrimitive value
                    unwatchSubProperty = watchPath value, remainder, observer
                if path.length is 1
                    # notify if this is the final property
                    observer subValue
                else if path.length > 1 and glass.isPrimitive value
                    # or if we can no longer reach the final property
                    observer undefined

        unwatchBaseProperty = watchProperty object, property, (value) ->
            if property?
                setSubValue value
            else
                observer value

        glass.nextTick ->
            if property?
                currentValue = object[property]
                if currentValue isnt undefined
                    setSubValue currentValue
            else
                # call back immediately if value is already there.
                observer object
        return ->
            unwatchSubProperty?()
            unwatchBaseProperty()
    set: set = (target, property, context, expression) ->
        unwatch = watch context, expression, (value) ->
            if value isnt undefined
                target[property] = value
        return unwatch

    watch: watch = (context, expression, callback) ->
        # we silently fail if we don't have Object.observe
        return unless Object.observe?
        # find the dependent paths
        regex = /\bthis(\.\w+)+\b/g
        expressionText = expression.toString()
        watchers = {}
        lastValue = undefined
        maybeRecalculate = ->
            # we only recalculate if every watched value is defined
            for name, watcher of watchers
                if not watcher.defined
                    return
            # they are all defined, so we will calculate
            value = expression.call context
            if value isnt lastValue
                lastValue = value
                callback.call context, value

        # find each unique path starting with 'this' in the function
        while match = regex.exec expressionText
            # must put this in do so each iteration
            # closes around it's own variables
            do ->
                key = match[0]
                if not watchers[key]?
                    path = key.split('.').slice(1)
                    watchers[key] = watcher =
                        defined: false
                        unwatch: watchPath context, path, (value) ->
                            if  watcher.defined = value isnt undefined
                                maybeRecalculate()
        return ->
            for name, watcher of watchers
                watcher.unwatch()
    watchPathForEach: watchPathForEach = (context, path, predicate, eachHandler) ->
        if not eachHandler?
            eachHandler = predicate
            predicate = null
        currentValue = undefined
        unwatchValue = null
        unwatchPath = watchPath context, path, (value) ->
            if value isnt currentValue
                if unwatchValue?
                    unwatchValue()
                    unwatchValue = null
                # remove any previous items
                if currentValue
                    for name, item of currentValue
                        eachHandler name, undefined
                currentValue = value
                if not glass.isPrimitive value
                    unwatchValue = forEach value, predicate, eachHandler
        return ->
            unwatchValue?()
            unwatchPath()

    forEach: forEach = (collection, predicate, eachHandler) ->
        if not eachHandler?
            eachHandler = predicate
            predicate = null
        currentItems = {}
        itemUnwatchers = if predicate? then {} else null
        setCurrentItem = (name, item, predicateValue) ->
            if predicate? and not predicateValue?
                predicateValue = predicate.call item
            # we reject any item not matching the predicate
            if item isnt undefined and predicate? and predicateValue is false
                item = undefined
            currentItem = currentItems[name]
            if currentItem isnt item
                if currentItem?
                    # quit watching it
                    if (itemUnwatcher = itemUnwatchers?[name])?
                        itemUnwatcher()
                        delete itemUnwatchers[name]
                    # notify handler of removal
                    eachHandler name, undefined
                if item is undefined
                    delete currentItems[name]
                else
                    currentItems[name] = item
                    # notify handler of addition
                    eachHandler name, item
                    # consider watching the item for predicate changes
                    if predicate? and not glass.isPrimitive item
                        itemUnwatchers[name] = watch item, predicate, (value) ->
                            setCurrentItem name, item, value

        # add current items in nextTick
        glass.nextTick ->
            for name, item of collection
                setCurrentItem name, item
        # watch for changes
        observe collection, collectionObserver = (changes) ->
            for change in changes
                setCurrentItem change.name, collection[change.name]
        return ->
            # unwatch all items
            if itemUnwatchers?
                for name, unwatcher of itemUnwatchers
                    unwatcher()
            # unwatch the collection
            unobserve collection, collectionObserver

# we don't bother testing if there is no Object.observe
return unless Object.observe?
exports.test =
    watchPathForEach: (done) ->
            target =
                foo:
                    bar:
                        a: 1
                        b: 2
                        c: 3
            result = {}
            count = 0
            unwatch = exports.watchPathForEach target, "foo.bar", (name, item) ->
                if count++ is 0
                    target.foo =
                        bar:
                            alpha: 1
                            beta: 3
                if item is undefined
                    delete result[name]
                else
                    result[name] = item
                if Object.equal result, {alpha:1,beta:3}
                    unwatch()
                    done()
    forEach:
        simple: (done) ->
            target =
                a: 1
                b: 2
                c: 3
            result = {}
            unwatch = exports.forEach target, (name, item) ->
                if item is undefined
                    delete result[name]
                else
                    result[name] = item
                if Object.equal result, {a:1,b:2,c:3}
                    unwatch()
                    done()
        addAndRemove: (done) ->
            target =
                a: 1
                b: 2
                c: 3
            result = {}
            count = 0
            unwatch = exports.forEach target, (name, item) ->
                if count++ is 0
                    # only make the changes after the first callback
                    # now manipulate
                    target.d = 4
                    delete target.b
                if item is undefined
                    delete result[name]
                else
                    result[name] = item
                if Object.equal result, {a:1,c:3,d:4}
                    unwatch()
                    done()
        predicate: (done) ->
            target =
                a: {x:1}
                b: {x:-1}
                c: {x:10}
            result = {}
            count = 0
            predicate = -> @x > 0
            unwatch = exports.forEach target, predicate, (name, item) ->
                if count++ is 0
                    # only make the changes after the first callback
                    # now manipulate
                    target.d = {x:-2,y:3}
                    target.e = {}
                    target.f = {x:1}
                    target.a.x = -10
                    target.b.x = 5

                if item is undefined
                    delete result[name]
                else
                    result[name] = item

                if Object.equal result, {b:{x:5},c:{x:10},f:{x:1}}
                    unwatch()
                    done()
 
    checkWatchCount: (done) ->
        # this must come before the later watchers
        Object.observe exports, observer = (changes) ->
            for change in changes
                if change.type is 'updated' and change.name is 'watchCount' and exports.watchCount is 0
                    Object.unobserve exports, observer
                    done()
                    break
    watchProperty: (done) ->
        foo = {}
        unwatchFooBar = watchProperty foo, "bar", (value) ->
            unwatchFooBar?()
            if not Object.isFunction unwatchFooBar
                return done "unwatchFooBar was not a function: #{unwatchFooBar}"
            if value isnt 2
                return done "expected 2: #{value}"
            unwatchFooBar = watchProperty foo, null, (value) ->
                unwatchFooBar?()
                if not Object.isFunction unwatchFooBar
                    return done "unwatchFooBar was not a function: #{unwatchFooBar}"
                if value isnt foo
                    return done "value wasn't foo: #{JSON.stringify value}"
                if value.bar isnt 12
                    return done "foo.bar wasn't 12: #{value}"
                done()
            foo.bar = 12
        foo.bar = 2
    watchPath:
        unfinished: (done) ->
            a = {}
            unwatchABC = watchPath a, "b.c", (value) ->
                unwatchABC?()
                if not Object.isFunction unwatchABC
                    return done "unwatchABC should be function: #{unwatchABC}"
                if value isnt 1
                    return done "expected 1: #{value}"
                done()
            a.b = {c:1}
        finished: (done) ->
            a = {b:{c:1}}
            unwatchABC = watchPath a, ["b", "c"], (value) ->
                unwatchABC?()
                if not Object.isFunction unwatchABC
                    return done "unwatchABC should be function: #{unwatchABC}"
                if value isnt 1
                    return done "expected 1: #{value}"
                done()
        changed: (done) ->
            a = {b:{c:1}}
            unwatchABC = watchPath a, ["b", "c"], (value) ->
                if not Object.isFunction unwatchABC
                    return done "unwatchABC should be function: #{unwatchABC}"
                if value is 2
                    unwatchABC?()
                    done()
            a.b = {c:2}
        finalPropertyChange: (done) ->
            a = {b:{c:c = {}}}
            unwatchABC = watchPath a, ["b", "c"], (value) ->
                if unwatchABC? and value is c and c.change is true
                    unwatchABC()
                    unwatchABC = null
                    done()
            a.b.c.change = true
        undefined: (done) ->
            a = {b:{c:1}}
            unwatchABC = watchPath a, ["b", "c"], (value) ->
                if value is undefined
                    unwatchABC?()
                    return done()
            a.b = null
    set:
        immediate: (done) ->
            target =
                width: 10
                height: 20
            unset = set target, "area", target, -> @width * @height
            unwatch = watchProperty target, "area", (value) ->
                unset()
                unwatch()
                if value isnt 200
                    return done "value isn't 200: #{value}"
                done()
        changed: (done) ->
            target =
                width: 10
                height: 20
            unset = set target, "area", target, -> @width * @height
            unwatch = watchProperty target, "area", (value) ->
                if value is 50
                    unset()
                    unwatch()
                    done()
            target.width = 5
            target.height = 10
