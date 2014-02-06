using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using EventFeedback.Common;

namespace EventFeedback.Domain
{
    public class Feedback
    {
        public int Id { get; set; }
        public bool? Active { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? ModifyDate { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? DeleteDate { get; set; }
        [StringLength(128)]
        public string DeletedBy { get; set; }

        [StringLength(256)]
        public string UserId { get; set; }

        public int FeedbackDefinitionId { get; set; }
        public FeedbackDefinition FeedbackDefinition { get; set; }

        public int? SessionId { get; set; }
        public int? EventId { get; set; }

        [StringLength(2048)]
        public string AverageRate { get; set; }

        [StringLength(2048)]
        public string Answer0 { get; set; }

        [StringLength(2048)]
        public string Answer1 { get; set; }

        [StringLength(2048)]
        public string Answer2 { get; set; }

        [StringLength(2048)]
        public string Answer3 { get; set; }

        [StringLength(2048)]
        public string Answer4 { get; set; }

        [StringLength(2048)]
        public string Answer5 { get; set; }

        [StringLength(2048)]
        public string Answer6 { get; set; }

        [StringLength(2048)]
        public string Answer7 { get; set; }

        [StringLength(2048)]
        public string Answer8 { get; set; }

        [StringLength(2048)]
        public string Answer9 { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// </summary>
        public Feedback()
        {
            CreateDate = DateTime.Now;
            Active = true;
        }

        public string UpdateAverageRate()
        {
            var counts = new List<double>();
            if (Answer0.IsDouble()) counts.Add(Answer0.ToDouble());
            if (Answer1.IsDouble()) counts.Add(Answer1.ToDouble());
            if (Answer2.IsDouble()) counts.Add(Answer2.ToDouble());
            if (Answer3.IsDouble()) counts.Add(Answer3.ToDouble());
            if (Answer4.IsDouble()) counts.Add(Answer4.ToDouble());
            if (Answer5.IsDouble()) counts.Add(Answer5.ToDouble());
            if (Answer6.IsDouble()) counts.Add(Answer6.ToDouble());
            if (Answer7.IsDouble()) counts.Add(Answer7.ToDouble());
            if (Answer8.IsDouble()) counts.Add(Answer8.ToDouble());
            if (Answer9.IsDouble()) counts.Add(Answer9.ToDouble());
            var result = Math.Round(counts.Average(), 2).ToString(CultureInfo.InvariantCulture);
            AverageRate = result;
            return result;
        }

        /// <summary>
        /// Determines whether this instance is active.
        /// </summary>
        /// <returns></returns>
        public bool IsActive()
        {
            return !(Active != null && !(bool)Active) && !IsDeleted();
        }

        /// <summary>
        /// Determines whether this instance is deleted.
        /// </summary>
        /// <returns></returns>
        public bool IsDeleted()
        {
            return (Deleted != null && !(bool)Deleted);
        }

        /// <summary>
        /// Sets the deleted flag for this document.
        /// </summary>
        /// <param name="accountName">Name of the account of the deleter.</param>
        public void SetDeleted(string accountName)
        {
            Deleted = true;
            Active = false;
            ModifyDate = DateTime.Now;
            DeleteDate = DateTime.Now;
            DeletedBy = accountName;
        }
    }
}
