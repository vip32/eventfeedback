namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Rate_Nullable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SessionFeedbacks", "AverageRate", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "RateOverall", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate1", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate2", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate3", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate4", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate5", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate6", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate7", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate8", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate9", c => c.Int());
            AlterColumn("dbo.SessionFeedbacks", "Rate0", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SessionFeedbacks", "Rate0", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate9", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate8", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate7", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate6", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate5", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate4", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate3", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate2", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "Rate1", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "RateOverall", c => c.Int(nullable: false));
            AlterColumn("dbo.SessionFeedbacks", "AverageRate", c => c.Int(nullable: false));
        }
    }
}
