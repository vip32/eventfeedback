using System;
using System.Collections.Generic;

namespace EventFeedback.Domain.Entities
{
    public class SessionReportModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

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
        
        public string Quesstion0 { get; set; }
        
        public string Quesstion1 { get; set; }
        
        public string Quesstion2 { get; set; }
        
        public string Quesstion3 { get; set; }
        
        public string Quesstion4 { get; set; }
        
        public string Quesstion5 { get; set; }
        
        public string Quesstion6 { get; set; }
        
        public string Quesstion7 { get; set; }
        
        public string Quesstion8 { get; set; }
        
        public string Quesstion9 { get; set; }

        public IEnumerable<FeedbackReportModel> Feedbacks { get; set; }
    }
}
