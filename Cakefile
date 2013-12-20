fs = require 'fs'
cp = require 'child_process'

task "install", "installs local and external dependencies", ->
    ext = if process.platform is 'win32' then '.cmd' else ''
    if not fs.existsSync "../ion/lib"
        console.err "You must install ion locally before running this."
        return process.exit 1
    fs.mkdirSync "node_modules" if not fs.existsSync "node_modules"
    fs.symlinkSync "../../ion/lib", "node_modules/ion", "dir" if not fs.existsSync "node_modules/ion"
    # make a symlink from /lib/node_modules to our node_modules to simplify dev dependencies.
    fs.symlinkSync "../node_modules", "lib/node_modules", "dir" if not fs.existsSync "lib/node_modules"
    if not fs.existsSync "node_modules/sugar"
        cp.spawn "npm#{ext}", ["install"], {stdio:'inherit'}

task "watch", "incrementally builds the project", ->
    require('ion/builder').runTemplate './build.ion', {}
