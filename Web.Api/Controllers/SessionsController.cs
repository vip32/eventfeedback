using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/v1/events/{eventId}/sessions")] 
    public class SessionsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public SessionsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<Session>))]
        public IHttpActionResult Get(int eventId, [FromUri] string filter = "")
        {
            using (new TraceLogicalScope(_traceSource, "SessionsController:Get"))
            {
                _traceSource.Verbose("eventId={0}, filter={1}" ,eventId, filter);
                Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

                IEnumerable<Session> result;
                if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                    result = _context.Sessions
                        .Include(s => s.FeedbackDefinition)
                        .OrderBy(e => e.StartDate)
                        .Where(s => s.EventId == eventId);
                else
                    result = _context.Sessions
                        .Include(s => s.FeedbackDefinition)
                        .OrderBy(e => e.StartDate)
                        .Where(s => s.EventId == eventId)
                        .ToList().Where(e => e.IsActive());
                        //.Where(d => !(d.Active != null && !(bool) d.Active))
                        //.Where(d => !(d.Deleted != null && (bool) d.Deleted));

                if (filter.Equals("current", StringComparison.CurrentCultureIgnoreCase))
                    result = result.ToList().Where(e => e.IsCurrent());
                return Ok(result);
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(Session))]
        public IHttpActionResult Get(int eventId, int id, [FromUri] string filter = "")
        {
            using (new TraceLogicalScope(_traceSource, "SessionsController:Get"))
            {
                _traceSource.Verbose("eventId={0}, id={1}, filter={2}", eventId, id, filter);
                Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");
                Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

                Session result;
                if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                    result = _context.Sessions
                        .Include(s => s.FeedbackDefinition)
                        .Where(s => s.EventId == eventId)
                        .FirstOrDefault(x => x.Id == id);
                else
                    result = _context.Sessions
                        .Include(s => s.FeedbackDefinition)
                        .Where(s => s.EventId == eventId)
                        .Where(d => !(d.Active != null && !(bool) d.Active))
                        .Where(d => !(d.Deleted != null && (bool) d.Deleted))
                        .FirstOrDefault(x => x.Id == id);
                if (result == null) return StatusCode(HttpStatusCode.NotFound);
                return Ok(result);
            }
        }

        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(Session))]
        public IHttpActionResult Post([FromBody]Session entity)
        {
            using (new TraceLogicalScope(_traceSource, "SessionsController:Post"))
            {
                _traceSource.Verbose(entity);
                Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
                Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");
                Guard.Against<ArgumentException>(entity.EventId == 0, "entity.eventid must be set");

                _context.Sessions.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(Session))]
        public IHttpActionResult Put(int id, [FromBody]Session entity)
        {
            using (new TraceLogicalScope(_traceSource, "SessionsController:Put"))
            {
                _traceSource.Verbose(entity);
                Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
                Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
                Guard.Against<ArgumentException>(entity.EventId == 0, "entity.eventid must be set");

                if (entity.Id == 0 && id != 0) entity.Id = id;
                if (!_context.Sessions.Any(f => f.Id == entity.Id))
                    return StatusCode(HttpStatusCode.NotFound);

                var entry = _context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    _context.Sessions.Attach(entity);
                    entry.State = EntityState.Modified;
                }
                _context.SaveChanges();
                return Ok(entity);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public IHttpActionResult Delete(int id)
        {
            using (new TraceLogicalScope(_traceSource, "SessionsController:Delete"))
            {
                _traceSource.Verbose("id={0}", id);
                Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

                var entity = _context.Sessions.FirstOrDefault(x => x.Id == id);
                if (entity == null) return StatusCode(HttpStatusCode.NotFound);
                entity.Deleted = true;
                entity.DeleteDate = SystemTime.Now();
                entity.DeletedBy = User.Identity.Name;
                _context.SaveChanges();
                return StatusCode(HttpStatusCode.NoContent);
            }
        }
    }
}