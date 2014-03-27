namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial5 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "ActiveFromDate", c => c.DateTime());
            AddColumn("dbo.Events", "ActiveTillDate", c => c.DateTime());
            AddColumn("dbo.Users", "ActiveFromDate", c => c.DateTime());
            AddColumn("dbo.Users", "ActiveTillDate", c => c.DateTime());
            DropColumn("dbo.Users", "ValidFromDate");
            DropColumn("dbo.Users", "ValidTillDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "ValidTillDate", c => c.DateTime());
            AddColumn("dbo.Users", "ValidFromDate", c => c.DateTime());
            DropColumn("dbo.Users", "ActiveTillDate");
            DropColumn("dbo.Users", "ActiveFromDate");
            DropColumn("dbo.Events", "ActiveTillDate");
            DropColumn("dbo.Events", "ActiveFromDate");
        }
    }
}
