namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Title = c.String(maxLength: 256),
                        Description = c.String(maxLength: 2048),
                        Key = c.String(maxLength: 128),
                        Link = c.String(maxLength: 512),
                        FeedbackAllowed = c.Boolean(),
                        FeedbackDefinitionId = c.Int(),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Location = c.String(maxLength: 128),
                        Organization = c.String(maxLength: 128),
                        ActiveFromDate = c.DateTime(),
                        ActiveTillDate = c.DateTime(),
                        TagList = c.String(maxLength: 512),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FeedbackDefinitions", t => t.FeedbackDefinitionId)
                .Index(t => t.Key)
                .Index(t => t.FeedbackDefinitionId);
            
            CreateTable(
                "dbo.FeedbackDefinitions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Title = c.String(maxLength: 256),
                        Description = c.String(maxLength: 512),
                        Active0 = c.Boolean(),
                        Order0 = c.Int(nullable: false),
                        Weight0 = c.Double(nullable: false),
                        QuestionType0 = c.Int(),
                        Title0 = c.String(maxLength: 512),
                        Description0 = c.String(maxLength: 1024),
                        Help0 = c.String(maxLength: 2048),
                        Required0 = c.Boolean(),
                        Active1 = c.Boolean(),
                        Order1 = c.Int(nullable: false),
                        Weight1 = c.Double(nullable: false),
                        QuestionType1 = c.Int(),
                        Title1 = c.String(maxLength: 512),
                        Description1 = c.String(maxLength: 1024),
                        Help1 = c.String(maxLength: 2048),
                        Required1 = c.Boolean(),
                        Active2 = c.Boolean(),
                        Order2 = c.Int(nullable: false),
                        Weight2 = c.Double(nullable: false),
                        QuestionType2 = c.Int(),
                        Title2 = c.String(maxLength: 512),
                        Description2 = c.String(maxLength: 1024),
                        Help2 = c.String(maxLength: 2048),
                        Required2 = c.Boolean(),
                        Active3 = c.Boolean(),
                        Order3 = c.Int(nullable: false),
                        Weight3 = c.Double(nullable: false),
                        QuestionType3 = c.Int(),
                        Title3 = c.String(maxLength: 512),
                        Description3 = c.String(maxLength: 1024),
                        Help3 = c.String(maxLength: 2048),
                        Required3 = c.Boolean(),
                        Active4 = c.Boolean(),
                        Order4 = c.Int(nullable: false),
                        Weight4 = c.Double(nullable: false),
                        QuestionType4 = c.Int(),
                        Title4 = c.String(maxLength: 512),
                        Description4 = c.String(maxLength: 1024),
                        Help4 = c.String(maxLength: 2048),
                        Required4 = c.Boolean(),
                        Active5 = c.Boolean(),
                        Order5 = c.Int(nullable: false),
                        Weight5 = c.Double(nullable: false),
                        QuestionType5 = c.Int(),
                        Title5 = c.String(maxLength: 512),
                        Description5 = c.String(maxLength: 1024),
                        Help5 = c.String(maxLength: 2048),
                        Required5 = c.Boolean(),
                        Active6 = c.Boolean(),
                        Order6 = c.Int(nullable: false),
                        Weight6 = c.Double(nullable: false),
                        QuestionType6 = c.Int(),
                        Title6 = c.String(maxLength: 512),
                        Description6 = c.String(maxLength: 1024),
                        Help6 = c.String(maxLength: 2048),
                        Required6 = c.Boolean(),
                        Active7 = c.Boolean(),
                        Order7 = c.Int(nullable: false),
                        Weight7 = c.Double(nullable: false),
                        QuestionType7 = c.Int(),
                        Title7 = c.String(maxLength: 512),
                        Description7 = c.String(maxLength: 1024),
                        Help7 = c.String(maxLength: 2048),
                        Required7 = c.Boolean(),
                        Active8 = c.Boolean(),
                        Order8 = c.Int(nullable: false),
                        Weight8 = c.Double(nullable: false),
                        QuestionType8 = c.Int(),
                        Title8 = c.String(maxLength: 512),
                        Description8 = c.String(maxLength: 1024),
                        Help8 = c.String(maxLength: 2048),
                        Required8 = c.Boolean(),
                        Active9 = c.Boolean(),
                        Order9 = c.Int(nullable: false),
                        Weight9 = c.Double(nullable: false),
                        QuestionType9 = c.Int(),
                        Title9 = c.String(maxLength: 512),
                        Description9 = c.String(maxLength: 1024),
                        Help9 = c.String(maxLength: 2048),
                        Required9 = c.Boolean(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sessions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Title = c.String(maxLength: 256),
                        Description = c.String(maxLength: 2048),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Location = c.String(maxLength: 128),
                        Level = c.String(maxLength: 10),
                        Type = c.String(maxLength: 128),
                        Track = c.String(maxLength: 128),
                        Key = c.String(maxLength: 128),
                        Link = c.String(maxLength: 512),
                        ActiveFromDate = c.DateTime(),
                        ActiveTillDate = c.DateTime(),
                        FeedbackAllowed = c.Boolean(),
                        FeedbackDefinitionId = c.Int(),
                        EventId = c.Int(nullable: false),
                        SpeakerList = c.String(maxLength: 512),
                        TagList = c.String(maxLength: 512),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FeedbackDefinitions", t => t.FeedbackDefinitionId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => t.Key)
                .Index(t => t.FeedbackDefinitionId)
                .Index(t => t.EventId);
            
            CreateTable(
                "dbo.Feedbacks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        UserId = c.Guid(nullable: false),
                        FeedbackDefinitionId = c.Int(nullable: false),
                        SessionId = c.Int(),
                        EventId = c.Int(),
                        AverageRate = c.String(maxLength: 2048),
                        Answer0 = c.String(maxLength: 2048),
                        Answer1 = c.String(maxLength: 2048),
                        Answer2 = c.String(maxLength: 2048),
                        Answer3 = c.String(maxLength: 2048),
                        Answer4 = c.String(maxLength: 2048),
                        Answer5 = c.String(maxLength: 2048),
                        Answer6 = c.String(maxLength: 2048),
                        Answer7 = c.String(maxLength: 2048),
                        Answer8 = c.String(maxLength: 2048),
                        Answer9 = c.String(maxLength: 2048),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FeedbackDefinitions", t => t.FeedbackDefinitionId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.FeedbackDefinitionId)
                .Index(t => t.SessionId)
                .Index(t => t.EventId);
            
            CreateTable(
                "dbo.ResourceTexts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Language = c.String(maxLength: 8),
                        Key = c.String(nullable: false, maxLength: 128),
                        Group = c.String(maxLength: 128),
                        Value = c.String(maxLength: 1024),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        RoleId = c.Guid(nullable: false),
                        UserId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.RoleId, t.UserId })
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        CreatedBy = c.String(maxLength: 128),
                        ModifyDate = c.DateTime(),
                        ModifiedBy = c.String(maxLength: 128),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Organization = c.String(maxLength: 128),
                        ActiveFromDate = c.DateTime(),
                        ActiveTillDate = c.DateTime(),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.UserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Guid(nullable: false),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserLogins",
                c => new
                    {
                        UserId = c.Guid(nullable: false),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.ProviderKey, t.LoginProvider })
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRoles", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserLogins", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserClaims", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.Feedbacks", "FeedbackDefinitionId", "dbo.FeedbackDefinitions");
            DropForeignKey("dbo.Sessions", "EventId", "dbo.Events");
            DropForeignKey("dbo.Sessions", "FeedbackDefinitionId", "dbo.FeedbackDefinitions");
            DropForeignKey("dbo.Events", "FeedbackDefinitionId", "dbo.FeedbackDefinitions");
            DropIndex("dbo.UserLogins", new[] { "UserId" });
            DropIndex("dbo.UserClaims", new[] { "UserId" });
            DropIndex("dbo.Users", "UserNameIndex");
            DropIndex("dbo.UserRoles", new[] { "UserId" });
            DropIndex("dbo.UserRoles", new[] { "RoleId" });
            DropIndex("dbo.Roles", "RoleNameIndex");
            DropIndex("dbo.Feedbacks", new[] { "EventId" });
            DropIndex("dbo.Feedbacks", new[] { "SessionId" });
            DropIndex("dbo.Feedbacks", new[] { "FeedbackDefinitionId" });
            DropIndex("dbo.Feedbacks", new[] { "UserId" });
            DropIndex("dbo.Sessions", new[] { "EventId" });
            DropIndex("dbo.Sessions", new[] { "FeedbackDefinitionId" });
            DropIndex("dbo.Sessions", new[] { "Key" });
            DropIndex("dbo.Events", new[] { "FeedbackDefinitionId" });
            DropIndex("dbo.Events", new[] { "Key" });
            DropTable("dbo.UserLogins");
            DropTable("dbo.UserClaims");
            DropTable("dbo.Users");
            DropTable("dbo.UserRoles");
            DropTable("dbo.Roles");
            DropTable("dbo.ResourceTexts");
            DropTable("dbo.Feedbacks");
            DropTable("dbo.Sessions");
            DropTable("dbo.FeedbackDefinitions");
            DropTable("dbo.Events");
        }
    }
}
