namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EventOrganization : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "Organization", c => c.String(maxLength: 128));
            AlterColumn("dbo.Users", "Email", c => c.String(maxLength: 128));
            AlterColumn("dbo.Users", "Organization", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Organization", c => c.String());
            AlterColumn("dbo.Users", "Email", c => c.String());
            DropColumn("dbo.Events", "Organization");
        }
    }
}
