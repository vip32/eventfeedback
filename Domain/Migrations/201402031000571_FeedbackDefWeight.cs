namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbackDefWeight : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FeedbackDefinitions", "Weight0", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight1", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight2", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight3", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight4", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight5", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight6", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight7", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight8", c => c.Double(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Weight9", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.FeedbackDefinitions", "Weight9");
            DropColumn("dbo.FeedbackDefinitions", "Weight8");
            DropColumn("dbo.FeedbackDefinitions", "Weight7");
            DropColumn("dbo.FeedbackDefinitions", "Weight6");
            DropColumn("dbo.FeedbackDefinitions", "Weight5");
            DropColumn("dbo.FeedbackDefinitions", "Weight4");
            DropColumn("dbo.FeedbackDefinitions", "Weight3");
            DropColumn("dbo.FeedbackDefinitions", "Weight2");
            DropColumn("dbo.FeedbackDefinitions", "Weight1");
            DropColumn("dbo.FeedbackDefinitions", "Weight0");
        }
    }
}
