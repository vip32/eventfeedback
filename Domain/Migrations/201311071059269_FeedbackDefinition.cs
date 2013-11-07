namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbackDefinition : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FeedbackDefinitions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Title = c.String(maxLength: 256),
                        Description = c.String(maxLength: 512),
                        Active0 = c.Boolean(),
                        QuestionType0 = c.Int(),
                        Title0 = c.String(maxLength: 512),
                        Description0 = c.String(maxLength: 1024),
                        Help0 = c.String(maxLength: 2048),
                        Required0 = c.Boolean(),
                        Active1 = c.Boolean(),
                        QuestionType1 = c.Int(),
                        Title1 = c.String(maxLength: 512),
                        Description1 = c.String(maxLength: 1024),
                        Help1 = c.String(maxLength: 2048),
                        Required1 = c.Boolean(),
                        Active2 = c.Boolean(),
                        QuestionType2 = c.Int(),
                        Title2 = c.String(maxLength: 512),
                        Description2 = c.String(maxLength: 1024),
                        Help2 = c.String(maxLength: 2048),
                        Required2 = c.Boolean(),
                        Active3 = c.Boolean(),
                        QuestionType3 = c.Int(),
                        Title3 = c.String(maxLength: 512),
                        Description3 = c.String(maxLength: 1024),
                        Help3 = c.String(maxLength: 2048),
                        Required3 = c.Boolean(),
                        Active4 = c.Boolean(),
                        QuestionType4 = c.Int(),
                        Title4 = c.String(maxLength: 512),
                        Description4 = c.String(maxLength: 1024),
                        Help4 = c.String(maxLength: 2048),
                        Required4 = c.Boolean(),
                        Active5 = c.Boolean(),
                        QuestionType5 = c.Int(),
                        Title5 = c.String(maxLength: 512),
                        Description5 = c.String(maxLength: 1024),
                        Help5 = c.String(maxLength: 2048),
                        Required5 = c.Boolean(),
                        Active6 = c.Boolean(),
                        QuestionType6 = c.Int(),
                        Title6 = c.String(maxLength: 512),
                        Description6 = c.String(maxLength: 1024),
                        Help6 = c.String(maxLength: 2048),
                        Required6 = c.Boolean(),
                        Active7 = c.Boolean(),
                        QuestionType7 = c.Int(),
                        Title7 = c.String(maxLength: 512),
                        Description7 = c.String(maxLength: 1024),
                        Help7 = c.String(maxLength: 2048),
                        Required7 = c.Boolean(),
                        Active8 = c.Boolean(),
                        QuestionType8 = c.Int(),
                        Title8 = c.String(maxLength: 512),
                        Description8 = c.String(maxLength: 1024),
                        Help8 = c.String(maxLength: 2048),
                        Required8 = c.Boolean(),
                        Active9 = c.Boolean(),
                        QuestionType9 = c.Int(),
                        Title9 = c.String(maxLength: 512),
                        Description9 = c.String(maxLength: 1024),
                        Help9 = c.String(maxLength: 2048),
                        Required9 = c.Boolean(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Events", "FeedbackDefinition_Id", c => c.Int());
            AddColumn("dbo.Sessions", "FeedbackDefinition_Id", c => c.Int());
            AddColumn("dbo.Feedbacks", "Answer0", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer1", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer2", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer3", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer4", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer5", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer6", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer7", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer8", c => c.String(maxLength: 2048));
            AddColumn("dbo.Feedbacks", "Answer9", c => c.String(maxLength: 2048));
            CreateIndex("dbo.Events", "FeedbackDefinition_Id");
            CreateIndex("dbo.Sessions", "FeedbackDefinition_Id");
            AddForeignKey("dbo.Events", "FeedbackDefinition_Id", "dbo.FeedbackDefinitions", "Id");
            AddForeignKey("dbo.Sessions", "FeedbackDefinition_Id", "dbo.FeedbackDefinitions", "Id");
            DropColumn("dbo.Feedbacks", "RateOverall");
            DropColumn("dbo.Feedbacks", "QuestionOverall");
            DropColumn("dbo.Feedbacks", "DescriptionOverall");
            DropColumn("dbo.Feedbacks", "Rate1");
            DropColumn("dbo.Feedbacks", "Question1");
            DropColumn("dbo.Feedbacks", "Description1");
            DropColumn("dbo.Feedbacks", "Rate2");
            DropColumn("dbo.Feedbacks", "Question2");
            DropColumn("dbo.Feedbacks", "Description2");
            DropColumn("dbo.Feedbacks", "Rate3");
            DropColumn("dbo.Feedbacks", "Question3");
            DropColumn("dbo.Feedbacks", "Description3");
            DropColumn("dbo.Feedbacks", "Rate4");
            DropColumn("dbo.Feedbacks", "Question4");
            DropColumn("dbo.Feedbacks", "Description4");
            DropColumn("dbo.Feedbacks", "Rate5");
            DropColumn("dbo.Feedbacks", "Question5");
            DropColumn("dbo.Feedbacks", "Description5");
            DropColumn("dbo.Feedbacks", "Rate6");
            DropColumn("dbo.Feedbacks", "Question6");
            DropColumn("dbo.Feedbacks", "Description6");
            DropColumn("dbo.Feedbacks", "Rate7");
            DropColumn("dbo.Feedbacks", "Question7");
            DropColumn("dbo.Feedbacks", "Description7");
            DropColumn("dbo.Feedbacks", "Rate8");
            DropColumn("dbo.Feedbacks", "Question8");
            DropColumn("dbo.Feedbacks", "Description8");
            DropColumn("dbo.Feedbacks", "Rate9");
            DropColumn("dbo.Feedbacks", "Question9");
            DropColumn("dbo.Feedbacks", "Description9");
            DropColumn("dbo.Feedbacks", "Rate0");
            DropColumn("dbo.Feedbacks", "Question0");
            DropColumn("dbo.Feedbacks", "Description0");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Feedbacks", "Description0", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question0", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate0", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description9", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question9", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate9", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description8", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question8", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate8", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description7", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question7", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate7", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description6", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question6", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate6", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description5", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question5", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate5", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description4", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question4", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate4", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description3", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question3", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate3", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description2", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question2", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate2", c => c.Int());
            AddColumn("dbo.Feedbacks", "Description1", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Question1", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "Rate1", c => c.Int());
            AddColumn("dbo.Feedbacks", "DescriptionOverall", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "QuestionOverall", c => c.String(maxLength: 1024));
            AddColumn("dbo.Feedbacks", "RateOverall", c => c.Int());
            DropForeignKey("dbo.Sessions", "FeedbackDefinition_Id", "dbo.FeedbackDefinitions");
            DropForeignKey("dbo.Events", "FeedbackDefinition_Id", "dbo.FeedbackDefinitions");
            DropIndex("dbo.Sessions", new[] { "FeedbackDefinition_Id" });
            DropIndex("dbo.Events", new[] { "FeedbackDefinition_Id" });
            DropColumn("dbo.Feedbacks", "Answer9");
            DropColumn("dbo.Feedbacks", "Answer8");
            DropColumn("dbo.Feedbacks", "Answer7");
            DropColumn("dbo.Feedbacks", "Answer6");
            DropColumn("dbo.Feedbacks", "Answer5");
            DropColumn("dbo.Feedbacks", "Answer4");
            DropColumn("dbo.Feedbacks", "Answer3");
            DropColumn("dbo.Feedbacks", "Answer2");
            DropColumn("dbo.Feedbacks", "Answer1");
            DropColumn("dbo.Feedbacks", "Answer0");
            DropColumn("dbo.Sessions", "FeedbackDefinition_Id");
            DropColumn("dbo.Events", "FeedbackDefinition_Id");
            DropTable("dbo.FeedbackDefinitions");
        }
    }
}
