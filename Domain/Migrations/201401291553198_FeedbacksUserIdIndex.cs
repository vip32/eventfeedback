namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbacksUserIdIndex : DbMigration
    {
        public override void Up()
        {
            CreateIndex("Feedbacks", new string[] { "UserId" }, false, "IX_Feedbacks_UserId");
        }
        
        public override void Down()
        {
            DropIndex("Feedbacks", "IX_Feedbacks_UserId");
        }
    }
}
