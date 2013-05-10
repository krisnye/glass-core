fs = require 'fs'
np = require 'path'
cp = require 'child_process'

module.exports = exports =
    spawn: spawn = (command, options, callback) ->
        return callback?() unless command?
        if typeof options is 'function'
            callback = options
            options = null
        options ?= {}
        options.stdio ?= 'inherit'
        args = command.split /\s+/
        command = args.shift()
        child = cp.spawn command, args, options
        child.on 'exit', callback if callback?
    exec: exec = (command, options, callback) ->
        return callback?() unless command?
        if typeof options is 'function'
            callback = options
            options = null
        options ?= {}
        cp.exec command, options, (err, stdout, stderr) ->
            console.log err if err?
            console.log stdout.toString() if stdout?
            console.log stderr.toString() if stderr?
            callback?()
    isMatch: isMatch = (value, match, defaultValue=false) ->
        value = value.split(/[\/\\]/g).pop()
        return defaultValue unless match?
        return match value if 'function' is typeof match
        return match.indexOf(value) >= 0 if Array.isArray match
        return value.substring(value.length-match.length) is match if typeof match is 'string'
        return match.test value
    defaultFileExclude: ["node_modules","www"]
    list: list = (dir, options={}, files=[]) ->
        exclude = options.exclude ? exports.defaultFileExclude
        recursive = options.recursive ? true
        for file in fs.readdirSync(dir)
            file = np.join dir, file
            if not isMatch file, exclude, false
                if fs.statSync(file)?.isFile?()
                    files.push file if isMatch file, options.match, true
                else if recursive
                    list file, options, files
        files
    makeParentDirectories: makeParentDirectories = (file) ->
        parent = np.dirname(file)
        if not fs.existsSync parent
            makeParentDirectories parent
            fs.mkdirSync parent
    read: read = (file) ->
        fs.readFileSync(file, 'utf8')
    write: write = (file, content) ->
        makeParentDirectories file
        fs.writeFileSync(file, content, 'utf8')

if typeof describe is 'function'
    assert = require 'assert'
    describe 'glass.build.utility', ->
        describe 'isMatch', ->
            it "should work", ->
                assert isMatch "foo.js", ".js"
                assert isMatch "foo.js", ["foo.bar","foo.js"]
                assert isMatch "foo.js", /\.js$/
                assert isMatch "foo.js", (x) -> x is "foo.js"
                assert not isMatch "foo.jsp", ".js"
                assert not isMatch "foo.jsp", ["foo.bar","foo.js"]
                assert not isMatch "foo.jsp", /\.js$/
                assert not isMatch "foo.jsp", (x) -> x is "foo.js"
