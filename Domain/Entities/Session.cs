using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using EventFeedback.Common;

namespace EventFeedback.Domain
{
    public class Session
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
        public string Title { get; set; }
        [StringLength(512)]
        public string Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [StringLength(128)]
        public string Location { get; set; }
        [StringLength(10)]
        public string Level { get; set; } // 100/200/300
        [StringLength(128)]
        public string Type { get; set; } // Session/Workshop/Codemash
        [StringLength(128)]
        public string Track { get; set; } // C#/java/sap
        [StringLength(128)]
        public string Key { get; set; } // 101 (SessionID)
        [StringLength(512)]
        public string Link { get; set; }
        public bool? FeedbackAllowed { get; set; }

        public int EventId { get; set; }
        //public Event Event { get; set; }

        public ICollection<string> Speakers { get; set; }
        [StringLength(512)]
        public string SpeakerList
        {
            get
            {
                return String.Join(";", Speakers);
            }
            set
            {
                Speakers = value.NullToEmpty().Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            }
        }

        public ICollection<string> Tags { get; set; }
        [StringLength(512)]
        public string TagList
        {
            get
            {
                return String.Join(";", Tags);
            }
            set
            {
                Tags = value.NullToEmpty().Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            }
        }
        public ICollection<SessionFeedback> Feedback { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// </summary>
        public Session()
        {
            CreateDate = DateTime.Now;
            Active = true;
            Tags = new Collection<string>();
            FeedbackAllowed = true;
        }

        public bool IsCurrent()
        {
            var dateTime = SystemTime.Now();
            var minDateTime = dateTime.AddMinutes(-15);
            var maxDateTime = dateTime.AddMinutes(15);
            return
                ((!StartDate.HasValue) || (maxDateTime.CompareTo(StartDate.Value) == 1) || (maxDateTime.CompareTo(StartDate.Value) == 0)) &&
                ((!EndDate.HasValue) || (minDateTime.CompareTo(EndDate.Value) == -1) || (minDateTime.CompareTo(EndDate.Value)) == 0);
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
