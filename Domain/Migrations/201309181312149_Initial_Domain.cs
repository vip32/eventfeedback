namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial_Domain : DbMigration
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
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        Location = c.String(maxLength: 128),
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
                        EventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => t.EventId);
            
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
                        RateOverall = c.Int(nullable: false),
                        DescriptionOverall = c.String(),
                        Rate1 = c.Int(nullable: false),
                        Description1 = c.String(),
                        Rate2 = c.Int(nullable: false),
                        Description2 = c.String(),
                        Rate3 = c.Int(nullable: false),
                        Description3 = c.String(),
                        Rate4 = c.Int(nullable: false),
                        Description4 = c.String(),
                        Rate5 = c.Int(nullable: false),
                        Description5 = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Sessions", t => t.SessionId, cascadeDelete: true)
                .Index(t => t.SessionId);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.SessionFeedbacks", new[] { "SessionId" });
            DropIndex("dbo.Sessions", new[] { "EventId" });
            DropForeignKey("dbo.SessionFeedbacks", "SessionId", "dbo.Sessions");
            DropForeignKey("dbo.Sessions", "EventId", "dbo.Events");
            DropTable("dbo.SessionFeedbacks");
            DropTable("dbo.Sessions");
            DropTable("dbo.Events");
        }
    }
}
