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
    [RoutePrefix("api/v1/feedbacks")] // TODO : routes are defined in Startup.WebApi
    public class FeedbacksController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;
        private readonly UserService _userService;

        public FeedbacksController(DataContext context, UserService userService)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            Guard.Against<ArgumentException>(userService == null, "userService cannot be null");
            _context = context;
            _userService = userService;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<Feedback>))]
        public IHttpActionResult Get()
        {
            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return StatusCode(HttpStatusCode.Unauthorized);
            var result = _context.Feedbacks.Where(f => f.UserId == user.Id);
            return Ok(result);
        }

        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult Get(int id)
        {
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return StatusCode(HttpStatusCode.Unauthorized);
            var result = _context.Feedbacks
                .FirstOrDefault(f => f.UserId == user.Id && f.Id == id);
            if (result == null) return StatusCode(HttpStatusCode.NotFound);
            return Ok(result);
        }

        [HttpPost]
        [Route("")]
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult Post([FromBody] Feedback entity)
        {
            Thread.Sleep(2500);
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id != 0, "entity.id must be empty");
            Guard.Against<ArgumentException>(!entity.EventId.HasValue && !entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set");
            Guard.Against<ArgumentException>(entity.EventId.HasValue && entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set, not both");

            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return StatusCode(HttpStatusCode.Unauthorized);

            // check if feedback for this user allready present (event or session)
            if(entity.SessionId.HasValue)
                if (_context.Feedbacks.Any(f => f.UserId == user.Id && f.SessionId == entity.SessionId))
                    return StatusCode(HttpStatusCode.NotModified);
            if (entity.EventId.HasValue)
                if (_context.Feedbacks.Any(f => f.UserId == user.Id && f.EventId == entity.EventId))
                    return StatusCode(HttpStatusCode.NotModified);

            // TODO: check if the event is still active (DB!)

            entity.UserId = user.Id;
            entity.UpdateAverageRate();
            _context.Feedbacks.Add(entity);
            _context.SaveChanges();

            return Ok(entity);
        }
        
        [HttpPut]
        [Route("{id:int}")]
        [ResponseType(typeof(Feedback))]
        public IHttpActionResult Put(int id, [FromBody] Feedback entity)
        {
            Thread.Sleep(2500);
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(entity.Id == 0 && id == 0, "entity.id or id must be set");
            //Guard.Against<ArgumentException>(!entity.EventId.HasValue && !entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set");
            //Guard.Against<ArgumentException>(entity.EventId.HasValue && entity.SessionId.HasValue, "entity.eventid or entity.sessionid should be set, not both");

            if (entity.Id == 0 && id != 0) entity.Id = id;
            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return StatusCode(HttpStatusCode.Unauthorized);

            var oldEntity = _context.Feedbacks.Find(entity.Id);
            if (oldEntity == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            if (oldEntity.UserId != user.Id) return StatusCode(HttpStatusCode.Unauthorized);
            if (oldEntity.SessionId != entity.SessionId) return StatusCode(HttpStatusCode.BadRequest);

            oldEntity.Answer0 = entity.Answer0;
            oldEntity.Answer1 = entity.Answer1;
            oldEntity.Answer2 = entity.Answer2;
            oldEntity.Answer3 = entity.Answer3;
            oldEntity.Answer4 = entity.Answer4;
            oldEntity.Answer5 = entity.Answer5;
            oldEntity.Answer6 = entity.Answer6;
            oldEntity.Answer7 = entity.Answer7;
            oldEntity.Answer8 = entity.Answer8;
            oldEntity.Answer9 = entity.Answer9;
            oldEntity.UpdateAverageRate();
            // TODO: check if the event is still active (DB!)

            //entity.Id = id;
            //entity.SessionId = oldEntity.SessionId;
            //entity.EventId = oldEntity.EventId;
            //var entry = _context.Entry(entity);
            //if (entry.State == System.Data.Entity.EntityState.Detached)
            //{
            //    _context.FeedbackReportModel.Attach(entity);
            //    entry.State = System.Data.Entity.EntityState.Modified;
            //}
            _context.SaveChanges();
            return Ok(entity);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            Guard.Against<ArgumentException>(id == 0, "id cannot be empty or zero");

            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return StatusCode(HttpStatusCode.Unauthorized);

            var entity = _context.Feedbacks.FirstOrDefault(f => f.Id == id && f.UserId == user.Id);
            if (entity == null) return StatusCode(HttpStatusCode.NotFound);
            entity.Deleted = true;
            entity.DeleteDate = SystemTime.Now();
            entity.DeletedBy = User.Identity.Name;
            _context.SaveChanges();
            return Ok(entity);
        }
    }
}