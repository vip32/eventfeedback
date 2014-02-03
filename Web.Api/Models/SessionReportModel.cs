using System;
using System.Collections.Generic;

namespace EventFeedback.Web.Api.Models
{
    public class SessionReportModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public ICollection<string> Speakers { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

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
        
        public string QuesstionTitle1 { get; set; }
        
        public string QuesstionTitle2 { get; set; }
        
        public string QuesstionTitle3 { get; set; }
        
        public string QuesstionTitle4 { get; set; }
        
        public string QuesstionTitle5 { get; set; }
        
        public string QuesstionTitle6 { get; set; }
        
        public string QuesstionTitle7 { get; set; }
        
        public string QuesstionTitle8 { get; set; }
        
        public string QuesstionTitle9 { get; set; }

        public IEnumerable<FeedbackReportModel> Feedbacks { get; set; }
    }
}
