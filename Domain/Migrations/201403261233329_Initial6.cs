namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial6 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Sessions", "ActiveFromDate", c => c.DateTime());
            AddColumn("dbo.Sessions", "ActiveTillDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Sessions", "ActiveTillDate");
            DropColumn("dbo.Sessions", "ActiveFromDate");
        }
    }
}
