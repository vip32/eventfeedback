using System;
using System.ComponentModel.DataAnnotations;

namespace EventFeedback.Domain
{
    public class SessionFeedback
    {
        public int Id { get; set; }
        public bool? Active { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? ModifyDate { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? DeleteDate { get; set; }
        [StringLength(128)]
        public string DeletedBy { get; set; }

        public int UserId { get; set; }
        //public User User { get; set; }

        public int SessionId { get; set; }
        //public Session Session { get; set; }

        public int RateOverall { get; set; }
        public string DescriptionOverall { get; set; }

        public int Rate1 { get; set; }
        public string Description1 { get; set; }
        public int Rate2 { get; set; }
        public string Description2 { get; set; }
        public int Rate3 { get; set; }
        public string Description3 { get; set; }
        public int Rate4 { get; set; }
        public string Description4 { get; set; }
        public int Rate5 { get; set; }
        public string Description5 { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// </summary>
        public SessionFeedback()
        {
            CreateDate = DateTime.Now;
            Active = true;
        }

        /// <summary>
        /// Sets the deleted flag for this document.
        /// </summary>
        /// <param name="accountName">Name of the account of the deleter.</param>
        public void SetDeleted(string accountName)
        {
            Deleted = true;
            ModifyDate = DateTime.Now;
            DeleteDate = DateTime.Now;
            DeletedBy = accountName;
        }
    }
}
