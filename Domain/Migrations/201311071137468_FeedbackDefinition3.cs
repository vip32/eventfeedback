namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbackDefinition3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Feedbacks", "FeedbackDefinitionId", c => c.Int(nullable: false));
            CreateIndex("dbo.Feedbacks", "FeedbackDefinitionId");
            AddForeignKey("dbo.Feedbacks", "FeedbackDefinitionId", "dbo.FeedbackDefinitions", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Feedbacks", "FeedbackDefinitionId", "dbo.FeedbackDefinitions");
            DropIndex("dbo.Feedbacks", new[] { "FeedbackDefinitionId" });
            DropColumn("dbo.Feedbacks", "FeedbackDefinitionId");
        }
    }
}
