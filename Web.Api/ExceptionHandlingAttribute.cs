using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;

namespace EventFeedback.Web.Api
{
    public class ExceptionHandlingAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception.GetType() != typeof (OperationCanceledException))
                return;

            var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(context.Exception.Message),
                ReasonPhrase = context.Exception.StackTrace
            };
            throw new HttpResponseException(resp);
        }
    }
}