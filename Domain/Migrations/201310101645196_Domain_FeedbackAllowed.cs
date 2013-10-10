namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_FeedbackAllowed : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "Key", c => c.String(maxLength: 128));
            AddColumn("dbo.Events", "Link", c => c.String(maxLength: 512));
            AddColumn("dbo.Sessions", "Link", c => c.String(maxLength: 512));
            AddColumn("dbo.Sessions", "FeedbackAllowed", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sessions", "FeedbackAllowed");
            DropColumn("dbo.Sessions", "Link");
            DropColumn("dbo.Events", "Link");
            DropColumn("dbo.Events", "Key");
        }
    }
}
