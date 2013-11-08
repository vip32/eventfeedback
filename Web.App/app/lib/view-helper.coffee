# Put your handlebars.js helpers here.

Handlebars.registerHelper 'pick', (val, options) ->
	return options.hash[val]

#  format an ISO date using Moment.js
#  http://momentjs.com/
#  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
#  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper "dateFormat", (context, block) ->
  if window.moment
    f = block.hash.format or "MMM DD, YYYY hh:mm:ss A"
    return moment(context).format(f) #had to remove Date(context)
  else
    return context #  moment plugin not available. return data as is.
