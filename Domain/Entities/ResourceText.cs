using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventFeedback.Domain
{
    [Table("ResourceTexts")]
    public class ResourceText
    {
        public ResourceText()
        {
            CreateDate = DateTime.Now;
            Active = true;
            Language = "en-US";
        }

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
        [StringLength(8)]
        public string Language { get; set; }
        [StringLength(128)]
        [Required]
        public string Key{ get; set; }
        [StringLength(128)]
        public string Group { get; set; }
        [StringLength(1024)]
        public string Value { get; set; }
    }
}
