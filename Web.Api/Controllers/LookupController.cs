using System;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/lookup")]
    public class LookupController : ApiController
    {
        [HttpGet]
        [Route("apiinfo")]
        public HttpResponseMessage ApiInfo()
        {
            var version = Assembly.GetExecutingAssembly().GetName().Version;
            var buildDateTime = new DateTime(2000, 1, 1).Add(new TimeSpan(
            TimeSpan.TicksPerDay * version.Build + // days since 1 January 2000
            TimeSpan.TicksPerSecond * 2 * version.Revision)); // seconds since midnight, (multiply by 2 to get original)

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<object>(new
                {
                    Version = version.ToString(),
                    BuildDate = buildDateTime
                }, Configuration.Formatters.JsonFormatter)
            };
        }



        // levels
        // types
        // tracks
    }
}
