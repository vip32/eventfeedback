namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbacksIndexes : DbMigration
    {
        public override void Up()
        {
            CreateIndex("Feedbacks", new string[] { "SessionId" }, false, "IX_Feedbacks_SessionId");
            CreateIndex("Feedbacks", new string[] { "EventId" }, false, "IX_Feedbacks_EventId");
        }

        public override void Down()
        {
            DropIndex("Feedbacks", "IX_Feedbacks_SessionId");
            DropIndex("Feedbacks", "IX_Feedbacks_EventId");
        }
    }
}
