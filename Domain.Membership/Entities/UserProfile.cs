using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventFeedback.Domain.Membership
{
    [Table("UserProfiles")]
    public class UserProfile
    {
        public UserProfile()
        {
            CreateDate = DateTime.UtcNow;
            Active = true;
        }

        [Key, Column("UserId"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
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

        [Required, StringLength(128)]
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}