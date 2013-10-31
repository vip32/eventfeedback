namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_EventFeedback1 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.SessionFeedbacks", "SessionId", "dbo.Sessions");
            DropIndex("dbo.SessionFeedbacks", new[] { "SessionId" });
            CreateTable(
                "dbo.Feedbacks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        UserId = c.Int(nullable: false),
                        SessionId = c.Int(),
                        EventId = c.Int(),
                        AverageRate = c.Int(),
                        RateOverall = c.Int(),
                        QuestionOverall = c.String(maxLength: 1024),
                        DescriptionOverall = c.String(maxLength: 1024),
                        Rate1 = c.Int(),
                        Question1 = c.String(maxLength: 1024),
                        Description1 = c.String(maxLength: 1024),
                        Rate2 = c.Int(),
                        Question2 = c.String(maxLength: 1024),
                        Description2 = c.String(maxLength: 1024),
                        Rate3 = c.Int(),
                        Question3 = c.String(maxLength: 1024),
                        Description3 = c.String(maxLength: 1024),
                        Rate4 = c.Int(),
                        Question4 = c.String(maxLength: 1024),
                        Description4 = c.String(maxLength: 1024),
                        Rate5 = c.Int(),
                        Question5 = c.String(maxLength: 1024),
                        Description5 = c.String(maxLength: 1024),
                        Rate6 = c.Int(),
                        Question6 = c.String(maxLength: 1024),
                        Description6 = c.String(maxLength: 1024),
                        Rate7 = c.Int(),
                        Question7 = c.String(maxLength: 1024),
                        Description7 = c.String(maxLength: 1024),
                        Rate8 = c.Int(),
                        Question8 = c.String(maxLength: 1024),
                        Description8 = c.String(maxLength: 1024),
                        Rate9 = c.Int(),
                        Question9 = c.String(maxLength: 1024),
                        Description9 = c.String(maxLength: 1024),
                        Rate0 = c.Int(),
                        Question0 = c.String(maxLength: 1024),
                        Description0 = c.String(maxLength: 1024),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Events", "FeedbackAllowed", c => c.Boolean());
            DropTable("dbo.SessionFeedbacks");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.SessionFeedbacks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        UserId = c.Int(nullable: false),
                        SessionId = c.Int(nullable: false),
                        AverageRate = c.Int(),
                        RateOverall = c.Int(),
                        QuestionOverall = c.String(maxLength: 1024),
                        DescriptionOverall = c.String(maxLength: 1024),
                        Rate1 = c.Int(),
                        Question1 = c.String(maxLength: 1024),
                        Description1 = c.String(maxLength: 1024),
                        Rate2 = c.Int(),
                        Question2 = c.String(maxLength: 1024),
                        Description2 = c.String(maxLength: 1024),
                        Rate3 = c.Int(),
                        Question3 = c.String(maxLength: 1024),
                        Description3 = c.String(maxLength: 1024),
                        Rate4 = c.Int(),
                        Question4 = c.String(maxLength: 1024),
                        Description4 = c.String(maxLength: 1024),
                        Rate5 = c.Int(),
                        Question5 = c.String(maxLength: 1024),
                        Description5 = c.String(maxLength: 1024),
                        Rate6 = c.Int(),
                        Question6 = c.String(maxLength: 1024),
                        Description6 = c.String(maxLength: 1024),
                        Rate7 = c.Int(),
                        Question7 = c.String(maxLength: 1024),
                        Description7 = c.String(maxLength: 1024),
                        Rate8 = c.Int(),
                        Question8 = c.String(maxLength: 1024),
                        Description8 = c.String(maxLength: 1024),
                        Rate9 = c.Int(),
                        Question9 = c.String(maxLength: 1024),
                        Description9 = c.String(maxLength: 1024),
                        Rate0 = c.Int(),
                        Question0 = c.String(maxLength: 1024),
                        Description0 = c.String(maxLength: 1024),
                    })
                .PrimaryKey(t => t.Id);
            
            DropColumn("dbo.Events", "FeedbackAllowed");
            DropTable("dbo.Feedbacks");
            CreateIndex("dbo.SessionFeedbacks", "SessionId");
            AddForeignKey("dbo.SessionFeedbacks", "SessionId", "dbo.Sessions", "Id", cascadeDelete: true);
        }
    }
}
