namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreatedByModifiedBy : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Events", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.FeedbackDefinitions", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.FeedbackDefinitions", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Sessions", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Sessions", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Feedbacks", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Feedbacks", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.ResourceTexts", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.ResourceTexts", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Roles", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Roles", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Users", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Users", "ModifiedBy", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "ModifiedBy");
            DropColumn("dbo.Users", "CreatedBy");
            DropColumn("dbo.Roles", "ModifiedBy");
            DropColumn("dbo.Roles", "CreatedBy");
            DropColumn("dbo.ResourceTexts", "ModifiedBy");
            DropColumn("dbo.ResourceTexts", "CreatedBy");
            DropColumn("dbo.Feedbacks", "ModifiedBy");
            DropColumn("dbo.Feedbacks", "CreatedBy");
            DropColumn("dbo.Sessions", "ModifiedBy");
            DropColumn("dbo.Sessions", "CreatedBy");
            DropColumn("dbo.FeedbackDefinitions", "ModifiedBy");
            DropColumn("dbo.FeedbackDefinitions", "CreatedBy");
            DropColumn("dbo.Events", "ModifiedBy");
            DropColumn("dbo.Events", "CreatedBy");
        }
    }
}
