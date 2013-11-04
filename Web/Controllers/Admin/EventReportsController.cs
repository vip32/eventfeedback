using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class EventReportsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public EventReportsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public Event Get(int id)
        {
            _traceSource.TraceInformation("eventreportscontroller get " + id);
            return _context.Events.Include("Sessions").FirstOrDefault(x => x.Id == id);
            

            // TODO: get event feedbacks and put on event.feedbacks
            // TODO: get session feedbacks and put on event.session[x].feedbacks 
        }
    }
}