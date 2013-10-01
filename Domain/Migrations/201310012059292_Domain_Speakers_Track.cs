namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Domain_Speakers_Track : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sessions", "Track", c => c.String(maxLength: 128));
            AddColumn("dbo.Sessions", "SpeakerList", c => c.String(maxLength: 512));
            DropColumn("dbo.Sessions", "Speaker");
            DropColumn("dbo.Sessions", "Tracks");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Sessions", "Tracks", c => c.String(maxLength: 128));
            AddColumn("dbo.Sessions", "Speaker", c => c.String(maxLength: 128));
            DropColumn("dbo.Sessions", "SpeakerList");
            DropColumn("dbo.Sessions", "Track");
        }
    }
}
