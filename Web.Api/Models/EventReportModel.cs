using System;
using System.Collections.Generic;

namespace EventFeedback.Domain.Entities
{
    public class EventReportModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
        
        public string AverageRate { get; set; }

        public IEnumerable<SessionReportModel> SessionReports { get; set; }
    }
}