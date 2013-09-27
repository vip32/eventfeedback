using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Filters;

namespace EventFeedback.Common
{
    public class ExceptionHandlingAttribute : ExceptionFilterAttribute
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public override void OnException(HttpActionExecutedContext context)
        {

            _traceSource.TraceEvent(TraceEventType.Error, 0, "url: [{0}] {1}",
                                        context.Request.Method.Method.ToUpper(),
                                        context.Request.RequestUri.AbsoluteUri);
            _traceSource.TraceEvent(TraceEventType.Error, 0, context.Exception.Message);
            _traceSource.TraceData(TraceEventType.Error, 0, context.Exception);
            
            //if (context.Exception is ApplicationException)
            //{
            //    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            //    {
            //        Content = new StringContent(context.Exception.Message + " " + Trace.CorrelationManager.ActivityId),
            //        ReasonPhrase = "Application Exception"
            //    });
            //}

            //throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            //{
            //    Content = new StringContent("An error occurred, please try again or contact the administrator. " + Trace.CorrelationManager.ActivityId),
            //    ReasonPhrase = "Critical Exception"
            //});
        }
    }
}
