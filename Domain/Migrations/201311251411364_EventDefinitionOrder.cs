namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EventDefinitionOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FeedbackDefinitions", "Order0", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order1", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order2", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order3", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order4", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order5", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order6", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order7", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order8", c => c.Int(nullable: false));
            AddColumn("dbo.FeedbackDefinitions", "Order9", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.FeedbackDefinitions", "Order9");
            DropColumn("dbo.FeedbackDefinitions", "Order8");
            DropColumn("dbo.FeedbackDefinitions", "Order7");
            DropColumn("dbo.FeedbackDefinitions", "Order6");
            DropColumn("dbo.FeedbackDefinitions", "Order5");
            DropColumn("dbo.FeedbackDefinitions", "Order4");
            DropColumn("dbo.FeedbackDefinitions", "Order3");
            DropColumn("dbo.FeedbackDefinitions", "Order2");
            DropColumn("dbo.FeedbackDefinitions", "Order1");
            DropColumn("dbo.FeedbackDefinitions", "Order0");
        }
    }
}
