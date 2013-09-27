using System;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace EventFeedback.Common
{
    public class FromValuesListConstraint : IRouteConstraint
    {
        private readonly string[] _values;

        public FromValuesListConstraint(params string[] values)
        {
            _values = values;
        }
        public bool Match(HttpContextBase httpContext,
            Route route,
            string parameterName,
            RouteValueDictionary values,
            RouteDirection routeDirection)
        {
            // Get the value called "parameterName" from the
            // RouteValueDictionary called "value"
            string value = values[parameterName].ToString();
            // Return true is the list of allowed values contains
            // this value.
            return _values.Contains(value, StringComparer.CurrentCultureIgnoreCase);
        }
    }
}
