using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventFeedback.Domain.Membership
{
    [Table("webpages_Membership")]
    public class User
    {
        public User()
        {
            CreateDate = DateTime.UtcNow;
            Active = true;

            Roles = new List<Role>();
            OAuthMemberships = new List<OAuthMembership>();
            CreateDate = DateTime.Now;
        }

        [Key, Column("UserId"), DatabaseGenerated(DatabaseGeneratedOption.None)]
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

        [StringLength(128)]
        public string ConfirmationToken { get; set; }
        public bool? IsConfirmed { get; set; }
        public DateTime? LastPasswordFailureDate { get; set; }
        public int PasswordFailuresSinceLastSuccess { get; set; }
        [Required, StringLength(128)]
        public string Password { get; set; }
        public DateTime? PasswordChangedDate { get; set; }
        [StringLength(128)] // Required
        public string PasswordSalt { get; set; }
        [StringLength(128)]
        public string PasswordVerificationToken { get; set; }
        public DateTime? PasswordVerificationTokenExpirationDate { get; set; }
        public ICollection<Role> Roles { get; set; }
        [ForeignKey("UserId")]
        public ICollection<OAuthMembership> OAuthMemberships { get; set; }
    }
}
