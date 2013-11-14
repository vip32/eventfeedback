using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [Authorize]
    [Route("api/v1/feedbackdefinitions")]
    public class FeedbackDefinitionsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public FeedbackDefinitionsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<FeedbackDefinition> Get([FromUri] string filter = "")
        {
            //Thread.Sleep(1500);

            _traceSource.TraceInformation("feedbackdefinitionscontroller get all");
            IEnumerable<FeedbackDefinition> result;

            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.FeedbackDefinitions.OrderBy(e => e.CreateDate);
            else
                result = _context.FeedbackDefinitions.OrderBy(e => e.CreateDate) //.Include("Sessions")
                    .Where(d => !(d.Active != null && !(bool)d.Active))
                    .Where(d => !(d.Deleted != null && (bool)d.Deleted));

            return result.NullToEmpty().Any() ? result : null;
        }

        public FeedbackDefinition Get(int id, [FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

            _traceSource.TraceInformation("feedbackdefinitionscontroller get " + id);
            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                return _context.FeedbackDefinitions
                    .FirstOrDefault(x => x.Id == id); //.Include("Sessions")

            return _context.FeedbackDefinitions
                .Where(d => !(d.Active != null && !(bool)d.Active))
                .Where(d => !(d.Deleted != null && (bool)d.Deleted))
                .FirstOrDefault(x => x.Id == id); //.Include("Sessions")
        }

        [Authorize(Roles = "Administrator")]
        public void Post([FromBody]FeedbackDefinition entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

            _context.FeedbackDefinitions.Add(entity);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Put(int id, [FromBody]FeedbackDefinition entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.FeedbackDefinitions.Any(f => f.Id == entity.Id))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.Entity.EntityState.Detached)
            {
                _context.FeedbackDefinitions.Attach(entity);
                entry.State = System.Data.Entity.EntityState.Modified;
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