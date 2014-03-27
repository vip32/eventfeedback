namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ValidTillDate", c => c.DateTime());
            DropColumn("dbo.Users", "ValidToDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "ValidToDate", c => c.DateTime());
            DropColumn("dbo.Users", "ValidTillDate");
        }
    }
}
