using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain
{
    public class User : IdentityUser
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="User"/> class.
        /// </summary>
        public User()
        {
            CreateDate = DateTime.Now;
            Active = true;
        }
          
        public bool? Active { get; set; }
        public DateTime? CreateDate { get; set; }
        [StringLength(128)]
        public string CreatedBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        [StringLength(128)]
        public string ModifiedBy { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? DeleteDate { get; set; }
        [StringLength(128)]
        public string DeletedBy { get; set; }
        [StringLength(128)]
        public string Email { get; set; }
        [StringLength(128)]
        public string Organization { get; set; }

        /// <summary>
        /// Determines whether this instance is active.
        /// </summary>
        /// <returns></returns>
        public bool IsActive()
        {
            return !(Active != null && !(bool) Active) && !IsDeleted();
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
