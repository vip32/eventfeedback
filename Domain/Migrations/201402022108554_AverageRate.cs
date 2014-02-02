namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AverageRate : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Feedbacks", "AverageRate", c => c.String(maxLength: 2048));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Feedbacks", "AverageRate", c => c.Int());
        }
    }
}
