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

        public IEnumerable<SessionFeedback> Get()
        {
            _traceSource.TraceInformation("feedbackscontroller get all");

            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            var result = _context.SessionFeedbacks.Where(f => f.UserId == user.Id).AsEnumerable(); 
            return result.Any() ? result : null;
        }

        public SessionFeedback Get(int id)
        {
            _traceSource.TraceInformation("eventscontroller get " + id);
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            return _context.SessionFeedbacks.FirstOrDefault(f => f.UserId == user.Id);
        }

        public void Post([FromBody] SessionFeedback entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");
            Guard.Against<ArgumentException>(entity.SessionId == 0, "entity.sessionid must be set");

            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            if (user == null) throw new HttpResponseException(HttpStatusCode.Unauthorized);

            // check if session feedback for this user allready present, must use put
            if (_context.SessionFeedbacks.Any(f => f.UserId == user.Id && f.SessionId == entity.SessionId))
                throw new HttpResponseException(HttpStatusCode.NotModified);

            entity.UserId = user.Id;
            _context.SessionFeedbacks.Add(entity);
            _context.SaveChanges();
        }
        
        public void Put(int id, [FromBody] SessionFeedback entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            Guard.Against<ArgumentNullException>(entity.SessionId == 0, "sessionid must be set");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name));
            if (user == null) throw new HttpResponseException(HttpStatusCode.Unauthorized);
            
            var oldEntity = _context.SessionFeedbacks.Find(entity.Id);
            if (oldEntity == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            if (oldEntity.UserId != user.Id) throw new HttpResponseException(HttpStatusCode.Unauthorized);

            entity.Id = id;
            entity.SessionId = oldEntity.SessionId;
            var entry = _context.Entry(entity);
            if (entry.State == System.Data.EntityState.Detached)
            {
                _context.SessionFeedbacks.Attach(entity);
                entry.State = System.Data.EntityState.Modified;
            }
            _context.SaveChanges();
        }
    }
}