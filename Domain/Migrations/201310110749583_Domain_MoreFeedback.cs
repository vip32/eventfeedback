namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_MoreFeedback : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SessionFeedbacks", "QuestionOverall", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Question1", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Question2", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Question3", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Question4", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Question5", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Rate6", c => c.Int(nullable: false));
            AddColumn("dbo.SessionFeedbacks", "Question6", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Description6", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Rate7", c => c.Int(nullable: false));
            AddColumn("dbo.SessionFeedbacks", "Question7", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Description7", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Rate8", c => c.Int(nullable: false));
            AddColumn("dbo.SessionFeedbacks", "Question8", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Description8", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Rate9", c => c.Int(nullable: false));
            AddColumn("dbo.SessionFeedbacks", "Question9", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Description9", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Rate0", c => c.Int(nullable: false));
            AddColumn("dbo.SessionFeedbacks", "Question0", c => c.String(maxLength: 1024));
            AddColumn("dbo.SessionFeedbacks", "Description0", c => c.String(maxLength: 1024));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SessionFeedbacks", "Description0");
            DropColumn("dbo.SessionFeedbacks", "Question0");
            DropColumn("dbo.SessionFeedbacks", "Rate0");
            DropColumn("dbo.SessionFeedbacks", "Description9");
            DropColumn("dbo.SessionFeedbacks", "Question9");
            DropColumn("dbo.SessionFeedbacks", "Rate9");
            DropColumn("dbo.SessionFeedbacks", "Description8");
            DropColumn("dbo.SessionFeedbacks", "Question8");
            DropColumn("dbo.SessionFeedbacks", "Rate8");
            DropColumn("dbo.SessionFeedbacks", "Description7");
            DropColumn("dbo.SessionFeedbacks", "Question7");
            DropColumn("dbo.SessionFeedbacks", "Rate7");
            DropColumn("dbo.SessionFeedbacks", "Description6");
            DropColumn("dbo.SessionFeedbacks", "Question6");
            DropColumn("dbo.SessionFeedbacks", "Rate6");
            DropColumn("dbo.SessionFeedbacks", "Question5");
            DropColumn("dbo.SessionFeedbacks", "Question4");
            DropColumn("dbo.SessionFeedbacks", "Question3");
            DropColumn("dbo.SessionFeedbacks", "Question2");
            DropColumn("dbo.SessionFeedbacks", "Question1");
            DropColumn("dbo.SessionFeedbacks", "QuestionOverall");
        }
    }
}
