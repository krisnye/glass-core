require 'sugar'
fs = require 'fs'
np = require 'path'
util = require './utility'
watcher = require './watcher'

check = (config) ->
    throw new Error "config.name is required" unless config.name?
    throw new Error "config.input is required" unless config.input?
    throw new Error "config.node.output is required" unless config.node.output?
    # TODO: Remove this later when appropriate.
    config.main ?= "#{config.input}/index.coffee"
    if config.browser?
        config.browser.name ?= config.name
    return

getCjsifyCommand = (config, watch = false) ->
    return null unless config?.browser?.output?
    name = "#{config.name}-full-browser"
    command = "cjsify.cmd -r #{config.input} --ignore-missing -o #{config.browser.output}/#{config.browser.name}.js --source-map #{config.browser.output}/#{config.browser.name}.map #{config.main}"
    if watch
        command += " -w"
    command

buildBrowserTestFile = (config) ->
    return unless config?.browser?.output?
    fs.writeFileSync "#{config.browser.output}/index.html",
        """
        <html>
            <head>
                <title>#{config.browser.name.capitalize()} Test</title>
                <link rel="stylesheet" type="text/css" href="https://raw.github.com/visionmedia/mocha/master/mocha.css">
                <script src="https://raw.github.com/visionmedia/mocha/master/mocha.js"></script>
                <script>mocha.setup('bdd');</script>
                <script src="#{config.browser.name}.js"></script>
            </head>
            <body>
                <div id="mocha"></div>
                <script>
                mocha.setup('bdd');
                mocha.run();
                </script>
            </body>
        </html>
        """, "utf8"

build = (config, callback) ->
    util.spawn "coffee.cmd -c -m -o #{config.node.output} #{config.input}", ->
        buildBrowserTestFile config
        util.spawn getCjsifyCommand(config, false), callback

runTest = (config, callback) ->
    list = util.list config.node.output, {match:".js"}
    util.spawn "mocha.cmd --harmony -R spec #{list.join ' '}", callback
    # util.spawn "mocha.cmd --recursive -R spec -g unitTest* -u exports #{config.node.output}", callback
watchCompile = (config) ->
    util.spawn "coffee.cmd -w -m -c -o #{config.node.output} #{config.input}"
    buildBrowserTestFile config
    util.spawn getCjsifyCommand(config, true)
watchTest = (config) ->
    # use a directory watcher to invoke nodeunit tests
    debouncedRunTest = (->
        runTest config
    ).debounce(500)
    options =
        filter: ".js"
        initial: false
    watcher.watchDirectory config.node.output, options, debouncedRunTest
getPackageJson = (config) ->
    path = np.join(config.node.output, 'package.json')
    JSON.parse fs.readFileSync(path, 'utf8')
module.exports = exports =
    # builds this project
    build: (config) ->
        check config
        build config, ->
            runTest config
    # watches input and incrementally builds output
    watch: (config) ->
        check config
        watchCompile config
        watchTest config
    # runs our unit tests
    test: (config) ->
        check config
        runTest config
    # runs npm publish on the output library
    publish: (config) ->
        util.spawn "npm.cmd publish #{config.node.output}"
    # bumps the package.json build version number
    bump: (config) ->
        pj = getPackageJson config
        version = pj.version.split '.'
        # bump the build version
        version[2] = parseInt(version[2]) + 1
        version = version.join '.'
        util.spawn "npm.cmd version #{version}", {cwd:config.node.output}, ->
            # now publish it
            exports.publish config
