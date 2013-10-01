namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Tags : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "TagList", c => c.String(maxLength: 512));
            AddColumn("dbo.Sessions", "Speaker", c => c.String(maxLength: 128));
            AddColumn("dbo.Sessions", "TagList", c => c.String(maxLength: 512));
            AlterColumn("dbo.Sessions", "Level", c => c.String(maxLength: 10));
            AlterColumn("dbo.Sessions", "Type", c => c.String(maxLength: 128));
            AlterColumn("dbo.Sessions", "Tracks", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Sessions", "Tracks", c => c.String());
            AlterColumn("dbo.Sessions", "Type", c => c.String());
            AlterColumn("dbo.Sessions", "Level", c => c.String());
            DropColumn("dbo.Sessions", "TagList");
            DropColumn("dbo.Sessions", "Speaker");
            DropColumn("dbo.Events", "TagList");
        }
    }
}
