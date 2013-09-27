using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http.Controllers;

namespace EventFeedback.Common
{
    public class ActivityTraceFilterAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public static string HeaderName { get { return "TraceCorrelationHeader"; } }

        public override void OnActionExecuting(HttpActionContext context)
        {
            var activityId = Guid.NewGuid();
            IEnumerable<string> headerValues;
            context.Request.Headers.TryGetValues(HeaderName, out headerValues);

            if (headerValues != null && headerValues.Any())
            {
                Guid.TryParse(headerValues.FirstOrDefault(), out activityId);
            }
            Trace.CorrelationManager.ActivityId = activityId;

            if (!context.Request.RequestUri.AbsoluteUri.Contains("favicon.ico") &&
                !context.Request.RequestUri.AbsoluteUri.Contains("/Content/") &&
                !context.Request.RequestUri.AbsoluteUri.Contains("/Glimpse.axd") &&
                !context.Request.RequestUri.AbsoluteUri.Contains("/Scripts/"))
                _traceSource.TraceEvent(TraceEventType.Start, 0, "url: [{0}] {1}", context.Request.Method, context.Request.RequestUri.AbsoluteUri);
        }
    }
}