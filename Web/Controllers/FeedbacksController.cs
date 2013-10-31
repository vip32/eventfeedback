using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Controllers
{
    [Authorize]
    public class FeedbacksController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public FeedbacksController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<Feedback> Get()
        {
            _traceSource.TraceInformation("feedbackscontroller get all");

            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            var result = _context.Feedbacks.Where(f => f.UserId == user.Id).AsEnumerable(); 
            return result.Any() ? result : null;
        }

        public Feedback Get(int id)
        {
            _traceSource.TraceInformation("eventscontroller get " + id);
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            return _context.Feedbacks.FirstOrDefault(f => f.UserId == user.Id);
        }

        public void Post([FromBody] Feedback entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");
            Guard.Against<ArgumentException>(!entity.EventId.HasValue && !entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set");
            Guard.Against<ArgumentException>(entity.EventId.HasValue && entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set, not both");

            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            if (user == null) throw new HttpResponseException(HttpStatusCode.Unauthorized);

            // check if feedback for this user allready present (event or session)
            if(entity.SessionId.HasValue)
                if (_context.Feedbacks.Any(f => f.UserId == user.Id && f.SessionId == entity.SessionId))
                    throw new HttpResponseException(HttpStatusCode.NotModified);
            if (entity.EventId.HasValue)
                if (_context.Feedbacks.Any(f => f.UserId == user.Id && f.EventId == entity.EventId))
                    throw new HttpResponseException(HttpStatusCode.NotModified);

            // TODO: check if the event is still active (DB!)

            entity.UserId = user.Id;
            _context.Feedbacks.Add(entity);
            _context.SaveChanges();
        }
        
        public void Put(int id, [FromBody] Feedback entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            //Guard.Against<ArgumentException>(!entity.EventId.HasValue && !entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set");
            //Guard.Against<ArgumentException>(entity.EventId.HasValue && entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set, not both");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            if (user == null) throw new HttpResponseException(HttpStatusCode.Unauthorized);

            var oldEntity = _context.Feedbacks.Find(entity.Id);
            if (oldEntity == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            if (oldEntity.UserId != user.Id) throw new HttpResponseException(HttpStatusCode.Unauthorized);

            // TODO: check if the event is still active (DB!)

            entity.Id = id;
            entity.SessionId = oldEntity.SessionId;
            entity.EventId = oldEntity.EventId;
            var entry = _context.Entry(entity);
            if (entry.State == System.Data.EntityState.Detached)
            {
                _context.Feedbacks.Attach(entity);
                entry.State = System.Data.EntityState.Modified;
            }
            _context.SaveChanges();
        }
    }
}