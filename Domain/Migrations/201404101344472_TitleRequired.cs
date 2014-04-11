namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TitleRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "Title", c => c.String(nullable: false, maxLength: 256));
            AlterColumn("dbo.Sessions", "Title", c => c.String(nullable: false, maxLength: 256));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Sessions", "Title", c => c.String(maxLength: 256));
            AlterColumn("dbo.Events", "Title", c => c.String(maxLength: 256));
        }
    }
}
