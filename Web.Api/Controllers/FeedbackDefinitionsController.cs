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
    [Authorize]
    [RoutePrefix("api/v1/feedbackdefinitions")]
    public class FeedbackDefinitionsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public FeedbackDefinitionsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<FeedbackDefinition>))]
        public IHttpActionResult Get([FromUri] string filter = "")
        {
            //Thread.Sleep(1500);

            IEnumerable<FeedbackDefinition> result;
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.FeedbackDefinitions.OrderBy(e => e.CreateDate);
            else
                result = _context.FeedbackDefinitions.OrderBy(e => e.CreateDate) //.Include("Sessions")
                    .Where(d => !(d.Active != null && !(bool)d.Active))
                    .Where(d => !(d.Deleted != null && (bool)d.Deleted));

            return Ok(result);
        }

        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(FeedbackDefinition))]
        public IHttpActionResult Get(int id, [FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

            FeedbackDefinition result;
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.FeedbackDefinitions
                    .FirstOrDefault(x => x.Id == id); //.Include("Sessions")
            else
                result = _context.FeedbackDefinitions
                .Where(d => !(d.Active != null && !(bool)d.Active))
                .Where(d => !(d.Deleted != null && (bool)d.Deleted))
                .FirstOrDefault(x => x.Id == id); //.Include("Sessions")
            if (result == null) return StatusCode(HttpStatusCode.NotFound);
            return Ok(result);
        }

        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(FeedbackDefinition))]
        public IHttpActionResult Post([FromBody]FeedbackDefinition entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

            _context.FeedbackDefinitions.Add(entity);
            _context.SaveChanges();
            return Ok(entity);
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(FeedbackDefinition))]
        public IHttpActionResult Put(int id, [FromBody]FeedbackDefinition entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.FeedbackDefinitions.Any(f => f.Id == entity.Id))
                return StatusCode(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.Entity.EntityState.Detached)
            {
                _context.FeedbackDefinitions.Attach(entity);
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