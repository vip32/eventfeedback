using System;
using System.ComponentModel.DataAnnotations;

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

        public string UserId { get; set; }

        public int? SessionId { get; set; }
        public int? EventId { get; set; }

        public int? AverageRate { get; set; }

        public int? RateOverall { get; set; }
        [StringLength(1024)]
        public string QuestionOverall { get; set; }
        [StringLength(1024)]
        public string DescriptionOverall { get; set; }

        public int? Rate1 { get; set; }
        [StringLength(1024)]
        public string Question1 { get; set; }
        [StringLength(1024)]
        public string Description1 { get; set; }

        public int? Rate2 { get; set; }
        [StringLength(1024)]
        public string Question2 { get; set; }
        [StringLength(1024)]
        public string Description2 { get; set; }

        public int? Rate3 { get; set; }
        [StringLength(1024)]
        public string Question3 { get; set; }
        [StringLength(1024)]
        public string Description3 { get; set; }

        public int? Rate4 { get; set; }
        [StringLength(1024)]
        public string Question4 { get; set; }
        [StringLength(1024)]
        public string Description4 { get; set; }

        public int? Rate5 { get; set; }
        [StringLength(1024)]
        public string Question5 { get; set; }
        [StringLength(1024)]
        public string Description5 { get; set; }

        public int? Rate6 { get; set; }
        [StringLength(1024)]
        public string Question6 { get; set; }
        [StringLength(1024)]
        public string Description6 { get; set; }

        public int? Rate7 { get; set; }
        [StringLength(1024)]
        public string Question7 { get; set; }
        [StringLength(1024)]
        public string Description7 { get; set; }

        public int? Rate8 { get; set; }
        [StringLength(1024)]
        public string Question8 { get; set; }
        [StringLength(1024)]
        public string Description8 { get; set; }

        public int? Rate9 { get; set; }
        [StringLength(1024)]
        public string Question9 { get; set; }
        [StringLength(1024)]
        public string Description9 { get; set; }

        public int? Rate0 { get; set; }
        [StringLength(1024)]
        public string Question0 { get; set; }
        [StringLength(1024)]
        public string Description0 { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// </summary>
        public Feedback()
        {
            CreateDate = DateTime.Now;
            Active = true;
        }

        /// <summary>
        /// Determines whether this instance is active.
        /// </summary>
        /// <returns></returns>
        public bool IsActive()
        {
            return !(Active != null && !(bool)Active);
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
