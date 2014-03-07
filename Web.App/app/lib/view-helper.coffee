Handlebars.registerHelper 'pick', (val, options) ->
	return options.hash[val]

#  format an ISO date using Moment.js
#  http://momentjs.com/
#  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
#  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper "dateFormat", (context, options) ->
  if window.moment
    f = options.hash.format or "MMM DD, YYYY hh:mm:ss A"
    return moment(context).format(f) #had to remove Date(context)
  else
    return context #  moment plugin not available. return data as is.

# if conditional (compare) helper
Handlebars.registerHelper "ifCond", (v1, v2, options) ->
  if v1 is v2
    options.fn(@)
    
# unless conditional (compare) helper
Handlebars.registerHelper "unlessCond", (v1, v2, options) ->
  if v1 isnt v2
    options.fn(@)
    
#  format an ISO date using moment.js
#  http://momentjs.com/
#  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
#  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper "dateFormat", (context, block) ->
  if window.moment
    f = block.hash.format or "MMM DD, YYYY hh:mm:ss A"
    return moment(context).format(f) #had to remove Date(context)
  else
    return context #  moment plugin not available. return data as is.
  return
  
Handlebars.registerHelper "seperatelist", (text) ->
  text = Handlebars.Utils.escapeExpression(text)
  text = text.replace(/;/g, ', ') 
  new Handlebars.SafeString(text)
  
Handlebars.registerHelper "zerowhenempty", (text) ->
  if _.isEmpty(text)
    return 0
  return text
