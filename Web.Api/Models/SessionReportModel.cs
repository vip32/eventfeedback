using System;
using System.Collections.Generic;

namespace EventFeedback.Web.Api.Models
{
    public class SessionReportModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string SpeakerList { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool FeedbackAllowed { get; set; }

        public string AverageRate { get; set; }
        
        public string AverageRateAnswer0 { get; set; }

        public string AverageRateAnswer1 { get; set; }

        public string AverageRateAnswer2 { get; set; }

        public string AverageRateAnswer3 { get; set; }

        public string AverageRateAnswer4 { get; set; }

        public string AverageRateAnswer5 { get; set; }

        public string AverageRateAnswer6 { get; set; }

        public string AverageRateAnswer7 { get; set; }

        public string AverageRateAnswer8 { get; set; }

        public string AverageRateAnswer9 { get; set; }
        
        public string QuesstionTitle0 { get; set; }

        public string MaxRateQuestion0 { get; set; }
        
        public string QuesstionTitle1 { get; set; }

        public string MaxRateQuestion1 { get; set; }
        
        public string QuesstionTitle2 { get; set; }

        public string MaxRateQuestion2 { get; set; }
        
        public string QuesstionTitle3 { get; set; }

        public string MaxRateQuestion3 { get; set; }
        
        public string QuesstionTitle4 { get; set; }

        public string MaxRateQuestion4 { get; set; }
        
        public string QuesstionTitle5 { get; set; }

        public string MaxRateQuestion5 { get; set; }
        
        public string QuesstionTitle6 { get; set; }

        public string MaxRateQuestion6 { get; set; }
        
        public string QuesstionTitle7 { get; set; }

        public string MaxRateQuestion7 { get; set; }
        
        public string QuesstionTitle8 { get; set; }

        public string MaxRateQuestion8 { get; set; }
        
        public string QuesstionTitle9 { get; set; }

        public string MaxRateQuestion9 { get; set; }

        public IEnumerable<FeedbackReportModel> Feedbacks { get; set; }
    }
}
