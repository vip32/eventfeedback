if (typeof String::startsWith != 'function') 
  String::startsWith = (str) ->
    return this.slice(0, str.length) == str
 
if (typeof String::endsWith != 'function')
  String::endsWith = (str) ->
    return this.slice(-str.length) == str
 
if (typeof String::addCommas != 'function')
  String::addCommas = ->
    str = this
    str += ''
    x = str.split('.')
    x1 = x[0]
    x2 = if x.length > 1 then '.' + x[1] else ''
    rgx = /(\d+)(\d{3})/
    while (rgx.test(x1))
      x1 = x1.replace(rgx, '$1' + ',' + '$2')
    x1 + x2
 
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