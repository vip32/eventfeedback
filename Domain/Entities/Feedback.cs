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

        [StringLength(256)]
        public string UserId { get; set; }

        public int FeedbackDefinitionId { get; set; }
        public FeedbackDefinition FeedbackDefinition { get; set; }

        public int? SessionId { get; set; }
        public int? EventId { get; set; }

        public int? AverageRate { get; set; }

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
