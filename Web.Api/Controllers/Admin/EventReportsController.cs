using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [Authorize()] //Roles = "Administrator"
    [RoutePrefix("api/v1/events/{eventId}/report")] 
    public class EventReportsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public EventReportsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<Feedback>))]
        public IHttpActionResult Get(int eventId, [FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            Guard.Against<ArgumentException>(eventId == 0, "eventId cannot be empty or zero");

            _traceSource.TraceInformation("eventreportscontroller get " + eventId);
            var sessionIds = _context.Sessions
                .Where(s => s.EventId == eventId).Select(s => s.Id);
            //if (!sessionIds.Any()) return StatusCode(HttpStatusCode.NotFound);

            var result = _context.Feedbacks
                .Where(f => sessionIds.Contains(f.SessionId.Value));

            return Ok(result);

            // TODO: get event feedbacks and put on event.feedbacks
            // TODO: get session feedbacks and put on event.session[x].feedbacks 
        }
    }
}