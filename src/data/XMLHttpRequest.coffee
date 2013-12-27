require '../global'

return if global.java

module.exports = global.XMLHttpRequest ? require('xmlhttprequest').XMLHttpRequest
