namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_ResourceText : DbMigration
    {
        public override void Up()
        {
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
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ResourceTexts");
        }
    }
}
