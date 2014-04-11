using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace EventFeedback.Common
{
    public class ValidationActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var modelState = actionContext.ModelState;
            if( actionContext.Request.Method.Equals(HttpMethod.Post) || 
                actionContext.Request.Method.Equals(HttpMethod.Put))
                if (!modelState.IsValid)
                    actionContext.Response = actionContext.Request
                         .CreateErrorResponse(HttpStatusCode.BadRequest, modelState);
        }
    }
}
