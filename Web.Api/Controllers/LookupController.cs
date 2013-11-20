using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/lookup")]
    public class LookupController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public LookupController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("apiinfo")]
        public IHttpActionResult ApiInfo()
        {
            var version = Assembly.GetExecutingAssembly().GetName().Version;
            return Ok(new
                {
                    Version = version.ToString(),
                    BuildDate = new DateTime(2000, 1, 1).Add(new TimeSpan(
                        TimeSpan.TicksPerDay*version.Build + // days since 1 January 2000
                        TimeSpan.TicksPerSecond*2*version.Revision)) // seconds since midnight, (multiply by 2 to get original)
                }
            );
        }

        [HttpGet]
        [Route("roles")]
        public IHttpActionResult Roles()
        {
            var roles = new[] {"User", "Administrator"};
            return Ok(roles.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("levels")]
        public IHttpActionResult Levels()
        {
            var levels = new[] { "100", "200", "300" };
            return Ok(levels.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("levels/{eventId}")]
        public IHttpActionResult Levels(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var levels = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.Level);
            return Ok(levels.Distinct().Select(t => new {Name = t}));
        }

        [HttpGet]
        [Route("tags/{eventId}")]
        public IHttpActionResult Tags(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var tags = new List<string>();
            var tagLists = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.TagList);
            tagLists.NullToEmpty().ForEach(tl => tags.AddRange(tl.Split(';')));

            return Ok(tags.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("speakers/{eventId}")]
        public IHttpActionResult Speakers(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var speakers = new List<string>();
            var speakerList = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.SpeakerList);
            speakerList.NullToEmpty().ForEach(tl => speakers.AddRange(tl.Split(';')));

            return Ok(speakers.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("tracks/{eventId}")]
        public IHttpActionResult Tracks(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var tracks = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.Track);

            return Ok(tracks.Distinct().Select(t => new { Name = t }));
        }

        // types
    }
}
