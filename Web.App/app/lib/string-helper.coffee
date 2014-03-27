if (typeof String::startsWith != 'function') 
  String::startsWith = (str) ->
    return this.slice(0, str.length) == str
 
if (typeof String::endsWith != 'function')
  String::endsWith = (str) ->
    return this.slice(-str.length) == str
 
if (typeof String::lpad != 'function')
  String::lpad = (padString, length) ->
    str = this
    while str.length < length
      str = padString + str
    return str
 
if (typeof String::rpad != 'function')
  String::rpad = (padString, length) ->
    str = this
    while str.length < length
      str = str + padString
    return str
 
if (typeof String::trim != 'function')
  String::trim = ->
    this.replace(/^\s+|\s+$/g, '')