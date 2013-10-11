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
    public class EventsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public EventsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<Event> Get([FromUri] string filter = "")
        {
            Thread.Sleep(2500);

            _traceSource.TraceInformation("eventscontroller get all");
            IEnumerable<Event> result;

            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.Events.OrderBy(e => e.StartDate);
            else
                result = _context.Events.OrderBy(e => e.StartDate) //.Include("Sessions")
                                 .Where(d => !(d.Active != null && !(bool)d.Active))
                                 .Where(d => !(d.Deleted != null && (bool)d.Deleted));

            if (filter.Equals("current", StringComparison.CurrentCultureIgnoreCase))
                result = result.ToList().Where(e => e.IsCurrent());
            
            return result.NullToEmpty().Any() ? result : null;
        }

        public Event Get(int id, [FromUri] string filter = "")
        {
            Thread.Sleep(2500);
            
            _traceSource.TraceInformation("eventscontroller get " + id);
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                return _context.Events
                               .FirstOrDefault(x => x.Id == id); //.Include("Sessions")

            return _context.Events
                           .Where(d => !(d.Active != null && !(bool) d.Active))
                           .Where(d => !(d.Deleted != null && (bool) d.Deleted))
                           .FirstOrDefault(x => x.Id == id); //.Include("Sessions")
        }

        [Authorize(Roles = "Administrator")]
        public void Post([FromBody]Event entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

            _context.Events.Add(entity);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Put(int id, [FromBody]Event entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            Guard.Against<ArgumentException>(entity.Id == 0, "entity.id must be set");
            
            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.Events.Any(f => f.Id == entity.Id))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.EntityState.Detached)
            {
                _context.Events.Attach(entity);
                entry.State = System.Data.EntityState.Modified;
            }
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Delete(int id)
        {
            var entity = _context.Events.FirstOrDefault(x => x.Id == id);
            if (entity != null)
            {
                _context.Events.Remove(entity);
                _context.SaveChanges();
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }
    }
}