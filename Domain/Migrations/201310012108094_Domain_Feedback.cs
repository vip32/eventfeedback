namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Feedback : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SessionFeedbacks", "AverageRate", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "DescriptionOverall", c => c.String(maxLength: 1024));
            AlterColumn("dbo.SessionFeedbacks", "Description1", c => c.String(maxLength: 1024));
            AlterColumn("dbo.SessionFeedbacks", "Description2", c => c.String(maxLength: 1024));
            AlterColumn("dbo.SessionFeedbacks", "Description3", c => c.String(maxLength: 1024));
            AlterColumn("dbo.SessionFeedbacks", "Description4", c => c.String(maxLength: 1024));
            AlterColumn("dbo.SessionFeedbacks", "Description5", c => c.String(maxLength: 1024));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SessionFeedbacks", "Description5", c => c.String());
            AlterColumn("dbo.SessionFeedbacks", "Description4", c => c.String());
            AlterColumn("dbo.SessionFeedbacks", "Description3", c => c.String());
            AlterColumn("dbo.SessionFeedbacks", "Description2", c => c.String());
            AlterColumn("dbo.SessionFeedbacks", "Description1", c => c.String());
            AlterColumn("dbo.SessionFeedbacks", "DescriptionOverall", c => c.String());
            DropColumn("dbo.SessionFeedbacks", "AverageRate");
        }
    }
}
