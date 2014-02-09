namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DescrLenght : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "Description", c => c.String(maxLength: 2048));
            AlterColumn("dbo.Sessions", "Description", c => c.String(maxLength: 2048));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Sessions", "Description", c => c.String(maxLength: 512));
            AlterColumn("dbo.Events", "Description", c => c.String(maxLength: 512));
        }
    }
}
