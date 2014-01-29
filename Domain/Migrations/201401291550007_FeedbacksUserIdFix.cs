namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbacksUserIdFix : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Feedbacks", "UserId", c => c.String(maxLength: 256));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Feedbacks", "UserId", c => c.String());
        }
    }
}
