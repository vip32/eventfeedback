namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ValidFromDate", c => c.DateTime());
            AddColumn("dbo.Users", "ValidToDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "ValidToDate");
            DropColumn("dbo.Users", "ValidFromDate");
        }
    }
}
