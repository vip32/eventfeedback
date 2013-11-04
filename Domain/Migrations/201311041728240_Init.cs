namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
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
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Title = c.String(maxLength: 256),
                        Description = c.String(maxLength: 512),
                        Key = c.String(maxLength: 128),
                        Link = c.String(maxLength: 512),
                        FeedbackAllowed = c.Boolean(),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Location = c.String(maxLength: 128),
                        TagList = c.String(maxLength: 512),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Sessions",
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
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Location = c.String(maxLength: 128),
                        Level = c.String(maxLength: 10),
                        Type = c.String(maxLength: 128),
                        Track = c.String(maxLength: 128),
                        Key = c.String(maxLength: 128),
                        Link = c.String(maxLength: 512),
                        FeedbackAllowed = c.Boolean(),
                        EventId = c.Int(nullable: false),
                        SpeakerList = c.String(maxLength: 512),
                        TagList = c.String(maxLength: 512),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => t.EventId);
            
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
                        UserId = c.String(),
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
            
            CreateTable(
                "dbo.ResourceTexts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
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
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        Active = c.Boolean(),
                        CreateDate = c.DateTime(),
                        ModifyDate = c.DateTime(),
                        Deleted = c.Boolean(),
                        DeleteDate = c.DateTime(),
                        DeletedBy = c.String(maxLength: 128),
                        Email = c.String(),
                        Organization = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.LoginProvider, t.ProviderKey })
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.Users");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.Users");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.Users");
            DropForeignKey("dbo.Sessions", "EventId", "dbo.Events");
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.Sessions", new[] { "EventId" });
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.Users");
            DropTable("dbo.Roles");
            DropTable("dbo.ResourceTexts");
            DropTable("dbo.Feedbacks");
            DropTable("dbo.Sessions");
            DropTable("dbo.Events");
        }
    }
}
