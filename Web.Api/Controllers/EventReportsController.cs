using System;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Web.Api.Models;

namespace EventFeedback.Web.Api.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("api/v1/events/{eventId}/report")] 
    public class EventReportsController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public EventReportsController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(EventReportModel))]
        public IHttpActionResult Get(int eventId, [FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            Guard.Against<ArgumentException>(eventId == 0, "eventId cannot be empty or zero");

            var ev = _context.Events
                .Include("FeedbackDefinition")
                .Include("Sessions").Include("Sessions.FeedbackDefinition")
                .Where(d => !(d.Active != null && !(bool) d.Active))
                .Where(d => !(d.Deleted != null && (bool) d.Deleted))
                .FirstOrDefault(e => e.Id == eventId);
            if (ev == null) return StatusCode(HttpStatusCode.NotFound);
            var sIds = ev.Sessions.Select(s => s.Id);
            var eventFeedbacks = _context.Feedbacks.Where(f => f.EventId == eventId)
                .Where(d => !(d.Active != null && !(bool) d.Active))
                .Where(d => !(d.Deleted != null && (bool) d.Deleted)).ToList();
            var sessionFeedbacks = _context.Feedbacks.Where(f => sIds.Contains(f.SessionId.Value))
                .Where(d => !(d.Active != null && !(bool) d.Active))
                .Where(d => !(d.Deleted != null && (bool) d.Deleted)).ToList();

            var result = new EventReportModel
            {
                Id = ev.Id, 
                Title = ev.Title,
                StartDate = ev.StartDate,
                EndDate = ev.EndDate,
                Location = ev.Location,
                AverageRate = Math.Round(eventFeedbacks
                        .Where(f => f.UpdateAverageRate().IsDouble())
                        .Select(f => f.UpdateAverageRate().ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                QuesstionTitle0 = ev.FeedbackDefinition.Title0, QuesstionTitle1 = ev.FeedbackDefinition.Title1,
                QuesstionTitle2 = ev.FeedbackDefinition.Title2, QuesstionTitle3 = ev.FeedbackDefinition.Title3,
                QuesstionTitle4 = ev.FeedbackDefinition.Title4, QuesstionTitle5 = ev.FeedbackDefinition.Title5,
                QuesstionTitle6 = ev.FeedbackDefinition.Title6, QuesstionTitle7 = ev.FeedbackDefinition.Title7,
                QuesstionTitle8 = ev.FeedbackDefinition.Title8, QuesstionTitle9 = ev.FeedbackDefinition.Title9,
                Feedbacks = eventFeedbacks.Select(f => new FeedbackReportModel
                {
                    Id = f.Id,
                    AverageRate = f.UpdateAverageRate(),
                    CreateDate = f.CreateDate,
                    Answer0 = f.Answer0, Answer1 = f.Answer1, Answer2 = f.Answer2, 
                    Answer3 = f.Answer3, Answer4 = f.Answer4, Answer5 = f.Answer5, 
                    Answer6 = f.Answer6, Answer7 = f.Answer7, Answer8 = f.Answer8, 
                    Answer9 = f.Answer9,
                    MaxRateQuestion0 = MaxRate(ev.FeedbackDefinition.QuestionType0).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion1 = MaxRate(ev.FeedbackDefinition.QuestionType1).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion2 = MaxRate(ev.FeedbackDefinition.QuestionType2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion3 = MaxRate(ev.FeedbackDefinition.QuestionType3).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion4 = MaxRate(ev.FeedbackDefinition.QuestionType4).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion5 = MaxRate(ev.FeedbackDefinition.QuestionType5).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion6 = MaxRate(ev.FeedbackDefinition.QuestionType6).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion7 = MaxRate(ev.FeedbackDefinition.QuestionType7).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion8 = MaxRate(ev.FeedbackDefinition.QuestionType8).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion9 = MaxRate(ev.FeedbackDefinition.QuestionType9).ToString(CultureInfo.InvariantCulture),
                }),
                Sessions = ev.Sessions.Select(s => new SessionReportModel
                {
                    Id = s.Id,
                    Title = s.Title,
                    SpeakerList = s.SpeakerList,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Location = s.Location,
                    FeedbackAllowed = !(s.FeedbackAllowed != null && !(bool)s.FeedbackAllowed),
                    AverageRate = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.UpdateAverageRate().IsDouble())
                        .Select(f => f.UpdateAverageRate().ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer0 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                       .Where(f => f.Answer0.IsDouble())
                       .Select(f => f.Answer0.ToDouble()).DefaultIfEmpty()
                       .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion0 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType0).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer1 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer1.IsDouble())
                        .Select(f => f.Answer1.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion1 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType1).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer2 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer2.IsDouble())
                        .Select(f => f.Answer2.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion2 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType2).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer3 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer3.IsDouble())
                        .Select(f => f.Answer3.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion3 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType3).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer4 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer4.IsDouble())
                        .Select(f => f.Answer4.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion4 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType4).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer5 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer5.IsDouble())
                        .Select(f => f.Answer6.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion5 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType5).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer6 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer6.IsDouble())
                        .Select(f => f.Answer6.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion6 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType6).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer7 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer7.IsDouble())
                        .Select(f => f.Answer7.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion7 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType7).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer8 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer8.IsDouble())
                        .Select(f => f.Answer8.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion8 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType8).ToString(CultureInfo.InvariantCulture),
                    AverageRateAnswer9 = Math.Round(sessionFeedbacks.NullToEmpty().Where(f => f.SessionId == s.Id)
                        .Where(f => f.Answer9.IsDouble())
                        .Select(f => f.Answer9.ToDouble()).DefaultIfEmpty()
                        .Average(), 2).ToString(CultureInfo.InvariantCulture),
                    MaxRateQuestion9 = s.FeedbackDefinition == null ? "" : MaxRate(s.FeedbackDefinition.QuestionType9).ToString(CultureInfo.InvariantCulture),
                    QuesstionTitle0 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title0,
                    QuesstionTitle1 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title1,
                    QuesstionTitle2 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title2,
                    QuesstionTitle3 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title3,
                    QuesstionTitle4 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title4,
                    QuesstionTitle5 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title5,
                    QuesstionTitle6 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title6,
                    QuesstionTitle7 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title7,
                    QuesstionTitle8 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title8,
                    QuesstionTitle9 = s.FeedbackDefinition == null ? "" : s.FeedbackDefinition.Title9,
                    Feedbacks = sessionFeedbacks.NullToEmpty()
                        .Where(f=> f.SessionId == s.Id)
                        .Select(f => new FeedbackReportModel
                        {
                            Id = f.Id,
                            AverageRate = f.UpdateAverageRate(),
                            CreateDate = f.CreateDate,
                            Answer0 = f.Answer0, Answer1 = f.Answer1, Answer2 = f.Answer2, 
                            Answer3 = f.Answer3, Answer4 = f.Answer4, Answer5 = f.Answer5,
                            Answer6 = f.Answer6, Answer7 = f.Answer7, Answer8 = f.Answer8, 
                            Answer9 = f.Answer9,
                            MaxRateQuestion0 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType0).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion1 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType1).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion2 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType2).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion3 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType3).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion4 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType4).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion5 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType5).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion6 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType6).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion7 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType7).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion8 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType8).ToString(CultureInfo.InvariantCulture),
                            MaxRateQuestion9 = MaxRate(s.FeedbackDefinition == null ? FeedbackQuestionType.Freetext : s.FeedbackDefinition.QuestionType9).ToString(CultureInfo.InvariantCulture),
                        })
                }).OrderBy(s=>s.StartDate)
            };
            return Ok(result);
        }

        private int MaxRate(FeedbackQuestionType? type)
        {
            return type == FeedbackQuestionType.ThreeStarRate
                ? 3
                : type == FeedbackQuestionType.FiveStarRate
                    ? 5
                    : type == FeedbackQuestionType.TenStarRate ? 10 : 0;
        }
    }
}