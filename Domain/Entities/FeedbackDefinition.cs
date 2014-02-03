using System;
using System.ComponentModel.DataAnnotations;

namespace EventFeedback.Domain
{
    public class FeedbackDefinition
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

        public bool? Active0 { get; set; }
        public int Order0 { get; set; }
        public double Weight0 { get; set; }
        public FeedbackQuestionType? QuestionType0 { get; set; }
        [StringLength(512)]
        public string Title0 { get; set; }
        [StringLength(1024)]
        public string Description0 { get; set; }
        [StringLength(2048)]
        public string Help0 { get; set; }
        public bool? Required0 { get; set; }

        public bool? Active1 { get; set; }
        public int Order1 { get; set; }
        public double Weight1 { get; set; }
        public FeedbackQuestionType? QuestionType1 { get; set; }
        [StringLength(512)]
        public string Title1 { get; set; }
        [StringLength(1024)]
        public string Description1 { get; set; }
        [StringLength(2048)]
        public string Help1 { get; set; }
        public bool? Required1 { get; set; }

        public bool? Active2 { get; set; }
        public int Order2 { get; set; }
        public double Weight2 { get; set; }
        public FeedbackQuestionType? QuestionType2 { get; set; }
        [StringLength(512)]
        public string Title2 { get; set; }
        [StringLength(1024)]
        public string Description2 { get; set; }
        [StringLength(2048)]
        public string Help2 { get; set; }
        public bool? Required2 { get; set; }

        public bool? Active3 { get; set; }
        public int Order3 { get; set; }
        public double Weight3 { get; set; }
        public FeedbackQuestionType? QuestionType3 { get; set; }
        [StringLength(512)]
        public string Title3 { get; set; }
        [StringLength(1024)]
        public string Description3 { get; set; }
        [StringLength(2048)]
        public string Help3 { get; set; }
        public bool? Required3 { get; set; }

        public bool? Active4 { get; set; }
        public int Order4 { get; set; }
        public double Weight4 { get; set; }
        public FeedbackQuestionType? QuestionType4 { get; set; }
        [StringLength(512)]
        public string Title4 { get; set; }
        [StringLength(1024)]
        public string Description4 { get; set; }
        [StringLength(2048)]
        public string Help4 { get; set; }
        public bool? Required4 { get; set; }

        public bool? Active5 { get; set; }
        public int Order5 { get; set; }
        public double Weight5 { get; set; }
        public FeedbackQuestionType? QuestionType5 { get; set; }
        [StringLength(512)]
        public string Title5 { get; set; }
        [StringLength(1024)]
        public string Description5 { get; set; }
        [StringLength(2048)]
        public string Help5 { get; set; }
        public bool? Required5 { get; set; }

        public bool? Active6 { get; set; }
        public int Order6 { get; set; }
        public double Weight6 { get; set; }
        public FeedbackQuestionType? QuestionType6 { get; set; }
        [StringLength(512)]
        public string Title6 { get; set; }
        [StringLength(1024)]
        public string Description6 { get; set; }
        [StringLength(2048)]
        public string Help6 { get; set; }
        public bool? Required6 { get; set; }

        public bool? Active7 { get; set; }
        public int Order7 { get; set; }
        public double Weight7 { get; set; }
        public FeedbackQuestionType? QuestionType7 { get; set; }
        [StringLength(512)]
        public string Title7 { get; set; }
        [StringLength(1024)]
        public string Description7 { get; set; }
        [StringLength(2048)]
        public string Help7 { get; set; }
        public bool? Required7 { get; set; }

        public bool? Active8 { get; set; }
        public int Order8 { get; set; }
        public double Weight8 { get; set; }
        public FeedbackQuestionType? QuestionType8 { get; set; }
        [StringLength(512)]
        public string Title8 { get; set; }
        [StringLength(1024)]
        public string Description8 { get; set; }
        [StringLength(2048)]
        public string Help8 { get; set; }
        public bool? Required8 { get; set; }

        public bool? Active9 { get; set; }
        public int Order9 { get; set; }
        public double Weight9 { get; set; }
        public FeedbackQuestionType? QuestionType9 { get; set; }
        [StringLength(512)]
        public string Title9 { get; set; }
        [StringLength(1024)]
        public string Description9 { get; set; }
        [StringLength(2048)]
        public string Help9 { get; set; }
        public bool? Required9 { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// </summary>
        public FeedbackDefinition()
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