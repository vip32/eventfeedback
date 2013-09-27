using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Filters;

namespace EventFeedback.Common
{
    public class NullFilter : ActionFilterAttribute
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            var response = actionExecutedContext.Response;

            object responseValue;
            var hasContent = response != null && response.TryGetContentValue(out responseValue);

            if (!hasContent && actionExecutedContext.Request.Method == HttpMethod.Get)
            {
                _traceSource.TraceEvent(TraceEventType.Warning, 404 , HttpStatusCode.NotFound.ToString());
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }
    }
}
