using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/v1/events")] 
    public class EventsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public EventsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<Event>))]
        public IHttpActionResult Get([FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            IEnumerable<Event> result;
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.Events.OrderBy(e => e.StartDate);
            else
                result = _context.Events.OrderBy(e => e.StartDate) //.Include("Sessions")
                                 .Where(d => !(d.Active != null && !(bool)d.Active))
                                 .Where(d => !(d.Deleted != null && (bool)d.Deleted));
            
            if (filter.Equals("current", StringComparison.CurrentCultureIgnoreCase))
                result = result.ToList().Where(e => e.IsCurrent());
            return Ok(result);
        }

        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(Event))]
        public IHttpActionResult Get(int id, [FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");
            
            Event result;
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.Events.FirstOrDefault(x => x.Id == id); //.Include("Sessions")
            else
                result = _context.Events
                           .Where(d => !(d.Active != null && !(bool) d.Active))
                           .Where(d => !(d.Deleted != null && (bool) d.Deleted))
                           .FirstOrDefault(x => x.Id == id); //.Include("Sessions")
            if (result == null) return StatusCode(HttpStatusCode.NotFound);
            return Ok(result);
        }

        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(Event))]
        public IHttpActionResult Post([FromBody]Event entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

            _context.Events.Add(entity);
            _context.SaveChanges();
            return Ok(entity);
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(Event))]
        public IHttpActionResult Put(int id, [FromBody]Event entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            
            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.Events.Any(f => f.Id == entity.Id))
                return StatusCode(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.Entity.EntityState.Detached)
            {
                _context.Events.Attach(entity);
                entry.State = System.Data.Entity.EntityState.Modified;
            }
            _context.SaveChanges();
            return Ok(entity);
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        public IHttpActionResult Delete(int id)
        {
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

            var entity = _context.Events.FirstOrDefault(x => x.Id == id);
            if (entity == null) return StatusCode(HttpStatusCode.NotFound);
            entity.Deleted = true;
            entity.DeleteDate = SystemTime.Now();
            entity.DeletedBy = User.Identity.Name;
            _context.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}