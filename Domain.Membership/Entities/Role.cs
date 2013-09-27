using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventFeedback.Domain.Membership
{
    [Table("webpages_Roles")]
    public class Role
    {
        public Role()
        {
            CreateDate = DateTime.UtcNow;
            Active = true;

            Members = new List<User>();
        }

        [Key, Column("RoleId")]
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

        [StringLength(256)]
        public string RoleName { get; set; }
        public ICollection<User> Members { get; set; }
    }
}