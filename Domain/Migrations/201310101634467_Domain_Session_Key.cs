namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Session_Key : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sessions", "Key", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sessions", "Key");
        }
    }
}
