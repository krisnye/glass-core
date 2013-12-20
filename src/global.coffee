
require 'ion/sugar'

# get the global object
global = do -> @
# set it as a global variable
global.global ?= global
# export the global object
module.exports = exports = global
