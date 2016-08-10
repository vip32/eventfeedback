using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using Microsoft.ApplicationInsights;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/lookup")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LookupController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;
        private readonly TelemetryClient _telemetry = new TelemetryClient();

        public LookupController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("apiinfo")]
        public IHttpActionResult ApiInfo()
        {
            using (new TraceLogicalScope(_traceSource, "LookupController:ApiInfo"))
            {

                _telemetry.TrackEvent("API:Lookup/ApiInfo");
                var version = Assembly.GetExecutingAssembly().GetName().Version;
                return Ok(new
                {
                    Version = version.ToString(),
                    BuildDate = new DateTime(2000, 1, 1).Add(new TimeSpan(
                        TimeSpan.TicksPerDay*version.Build + // days since 1 January 2000
                        TimeSpan.TicksPerSecond*2*version.Revision)),
                    // seconds since midnight, (multiply by 2 to get original)
                    Environment = Environment.GetEnvironmentVariable("APPSETTING_Environment"),
                    DbName = _context.Database.Connection.Database,
                    DbMigrations = new DbMigrator(new Domain.Migrations.Configuration()).GetDatabaseMigrations()
                });
            }
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
        public IHttpActionResult LevelsForEvent(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var levels = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.Level);
            return Ok(levels.Distinct().Select(t => new {Name = t}));
        }

        [HttpGet]
        [Route("tags/{eventId}")]
        public IHttpActionResult TagsForEvent(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var tags = new List<string>();
            var tagLists = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.TagList);
            tagLists.NullToEmpty().ForEach(tl => tags.AddRange(tl.NullToEmpty().Split(';')));

            return Ok(tags.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("speakers/{eventId}")]
        public IHttpActionResult SpeakersForEvent(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var speakers = new List<string>();
            var speakerList = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.SpeakerList);
            speakerList.NullToEmpty().ForEach(tl => speakers.AddRange(tl.NullToEmpty().Split(';')));

            return Ok(speakers.Distinct().Select(t => new { Name = t }));
        }

        [HttpGet]
        [Route("tracks/{eventId}")]
        public IHttpActionResult TracksForEvent(int eventId)
        {
            Guard.Against<ArgumentException>(eventId == 0, "eventid cannot be empty or zero");

            var tracks = _context.Sessions.Where(s => s.EventId == eventId).Select(e => e.Track);

            return Ok(tracks.Distinct().Select(t => new { Name = t }));
        }

        // types
    }
}
