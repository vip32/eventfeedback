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
    [Route("api/v1/resources")]
    public class ResourceTextsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public ResourceTextsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<ResourceText> Get([FromUri] string filter = "", [FromUri] string language = "en-US")
        {
            Thread.Sleep(3500);

            _traceSource.TraceInformation("ResourceTextsController get all");
            IEnumerable<ResourceText> result;

            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.ResourceTexts.OrderBy(e => e.Key);
            else
                result = _context.ResourceTexts.OrderBy(e => e.Key) 
                                 .Where(d => d.Language.Equals(language, StringComparison.CurrentCultureIgnoreCase))
                                 .Where(d => !(d.Active != null && !(bool)d.Active))
                                 .Where(d => !(d.Deleted != null && (bool)d.Deleted));

            return result.NullToEmpty().Any() ? result : null; // TODO: maybe return anonymous here (id/key/group/val)
        }

        [Authorize(Roles = "Administrator")]
        public void Post([FromBody]ResourceText entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");

            _context.ResourceTexts.Add(entity);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Put(int id, [FromBody]ResourceText entity)
        {
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            Guard.Against<ArgumentException>(entity.Id == 0, "entity.id must be set");
            
            if (entity.Id == 0 && id != 0) entity.Id = id;
            if (!_context.Events.Any(f => f.Id == entity.Id))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            var entry = _context.Entry(entity);
            if (entry.State == System.Data.Entity.EntityState.Detached)
            {
                _context.ResourceTexts.Attach(entity);
                entry.State = System.Data.Entity.EntityState.Modified;
            }
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        public void Delete(int id)
        {
            var entity = _context.ResourceTexts.FirstOrDefault(x => x.Id == id);
            if (entity != null)
            {
                _context.ResourceTexts.Remove(entity);
                _context.SaveChanges();
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }
    }
}