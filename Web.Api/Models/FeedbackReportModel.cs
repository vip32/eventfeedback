﻿using System;

namespace EventFeedback.Web.Api.Models
{
    public class FeedbackReportModel
    {
        public int Id { get; set; }

        public DateTime? CreateDate { get; set; }

        public string AverageRate { get; set; }

        public string Answer0 { get; set; }

        public string Answer1 { get; set; }

        public string Answer2 { get; set; }

        public string Answer3 { get; set; }

        public string Answer4 { get; set; }

        public string Answer5 { get; set; }

        public string Answer6 { get; set; }

        public string Answer7 { get; set; }

        public string Answer8 { get; set; }
        
        public string Answer9 { get; set; }

        public string MaxRateQuestion0 { get; set; }
        
        public string MaxRateQuestion1 { get; set; }
        
        public string MaxRateQuestion2 { get; set; }
        
        public string MaxRateQuestion3 { get; set; }
        
        public string MaxRateQuestion4 { get; set; }
        
        public string MaxRateQuestion5 { get; set; }
        
        public string MaxRateQuestion6 { get; set; }
        
        public string MaxRateQuestion7 { get; set; }
        
        public string MaxRateQuestion8 { get; set; }
        
        public string MaxRateQuestion9 { get; set; }
    }
}