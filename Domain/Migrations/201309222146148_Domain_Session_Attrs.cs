namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Session_Attrs : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sessions", "Level", c => c.String());
            AddColumn("dbo.Sessions", "Type", c => c.String());
            AddColumn("dbo.Sessions", "Tracks", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sessions", "Tracks");
            DropColumn("dbo.Sessions", "Type");
            DropColumn("dbo.Sessions", "Level");
        }
    }
}
