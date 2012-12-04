schematic = require 'schematic'
_ = require 'underscore'

compilerRoot = "compiler"
compilerModule = "./#{compilerRoot}/compiler"
srcRoot = "runtime"
srcExpr = /\.(coffee|pegjs)$/
webRoot = "www"
jsPath = "/js"
jsRoot = "#{webRoot}#{jsPath}"
includeFile = "#{webRoot}/includes.html"
testName = "glass.allTests"
testModule = "./#{jsRoot}/#{testName}"
buildDebug = "buildlog.html"

exec = (command) ->
	require('child_process').exec command, (error, stdout, stderr) ->
		console.log error if error?
		console.log stdout.toString()
		console.log stderr.toString()

options =
	input:
		dir: srcRoot
		match: srcExpr
	output:
		dir: jsRoot
	script:
		includes: includeFile
		prefix: "#{jsPath}/"
	module:
		main: "glass.js"
		prefix: "./#{jsRoot}/"
	# debug: buildDebug
	test: testName

task 'build', 'builds this library', build = ->
	require(compilerModule).compile options
	invoke 'test'

task 'test', 'tests this library', test = ->
	require "./" + options.module.main
	eval("(#{options.test})")();

task 'watch', 'watches for changes and rebuilds', ->
	watchBuild = _.debounce (-> exec 'cake build'), 100
	options =
		ignoreDotFiles: true
		interval: 100
	for root in [srcRoot, compilerRoot]
		require('watch').watchTree root, options, (f, curr, prev) ->
			watchBuild()

task 'update', 'updates npm dependencies', ->
	exec 'npm install ../schematic'