using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Controllers
{
    [Authorize]
    public class SessionsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public SessionsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<Session> Get(int eventId)
        {
            _traceSource.TraceInformation("eventscontroller get all");
            var result =  _context.Sessions.Where(s => s.EventId == eventId).AsEnumerable();
            return result.Any() ? result : null;
        }

        public Session Get(int eventId, int id)
        {
            _traceSource.TraceInformation("eventscontroller get " + id);
            return _context.Sessions.Where(s => s.EventId == eventId).FirstOrDefault(x => x.Id == id);
        }

        [Authorize(Roles = "Administrator")]
        public void Post([FromBody]Session entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");
            Guard.Against<ArgumentException>(entity.EventId == 0, "entity.eventid must be set");


            _context.Sessions.Add(entity);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Put(int id, [FromBody]Session entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            Guard.Against<ArgumentException>(entity.EventId == 0, "entity.eventid must be set");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.Sessions.Any(f => f.Id == entity.Id))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.EntityState.Detached)
            {
                _context.Sessions.Attach(entity);
                entry.State = System.Data.EntityState.Modified;
            }
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Delete(int id)
        {
            var entity = _context.Sessions.FirstOrDefault(x => x.Id == id);
            if (entity != null)
            {
                _context.Sessions.Remove(entity);
                _context.SaveChanges();
            }
            else
            {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }
    }
}