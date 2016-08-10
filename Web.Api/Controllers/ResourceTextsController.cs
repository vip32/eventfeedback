using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;
using Microsoft.ApplicationInsights;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/resources")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [ExceptionHandling]
    public class ResourceTextsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;
        private readonly TelemetryClient _telemetry = new TelemetryClient();

        public ResourceTextsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<ResourceText>))]
        public IHttpActionResult Get([FromUri] string filter = "", [FromUri] string language = "en-US")
        {
            using (new TraceLogicalScope(_traceSource, "ResourceTextsController:Put"))
            {
                _telemetry.TrackEvent("API:Resources/Get");
                IEnumerable<ResourceText> result;

                if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                    result = _context.ResourceTexts.OrderBy(e => e.Key);
                else
                    result = _context.ResourceTexts.OrderBy(e => e.Key)
                        .Where(d => d.Language.Equals(language, StringComparison.CurrentCultureIgnoreCase))
                        .Where(d => !(d.Active != null && !(bool) d.Active))
                        .Where(d => !(d.Deleted != null && (bool) d.Deleted));
                return Ok(result);
            }
        }

        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(ResourceText))]
        public IHttpActionResult Post([FromBody]ResourceText entity)
        {
            using (new TraceLogicalScope(_traceSource, "ResourceTextsController:Post"))
            {
                Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
                Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

                _context.ResourceTexts.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(ResourceText))]
        public IHttpActionResult Put(int id, [FromBody]ResourceText entity)
        {
            using (new TraceLogicalScope(_traceSource, "ResourceTextsController:Put"))
            {
                Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
                Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
                Guard.Against<ArgumentException>(entity.Id == 0, "entity.id must be set");

                if (entity.Id == 0 && id != 0) entity.Id = id;
                if (!_context.Events.Any(f => f.Id == entity.Id))
                    return StatusCode(HttpStatusCode.NotFound);

                var entry = _context.Entry(entity);
                if (entry.State == System.Data.Entity.EntityState.Detached)
                {
                    _context.ResourceTexts.Attach(entity);
                    entry.State = System.Data.Entity.EntityState.Modified;
                }
                _context.SaveChanges();
                return Ok(entity);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Administrator")]
        public IHttpActionResult Delete(int id)
        {
            using (new TraceLogicalScope(_traceSource, "ResourceTextsController:Delete"))
            {
                Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

                var entity = _context.ResourceTexts.FirstOrDefault(x => x.Id == id);
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