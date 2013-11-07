namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FeedbackDefinition2 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Events", name: "FeedbackDefinition_Id", newName: "FeedbackDefinitionId");
            RenameColumn(table: "dbo.Sessions", name: "FeedbackDefinition_Id", newName: "FeedbackDefinitionId");
        }
        
        public override void Down()
        {
            RenameColumn(table: "dbo.Sessions", name: "FeedbackDefinitionId", newName: "FeedbackDefinition_Id");
            RenameColumn(table: "dbo.Events", name: "FeedbackDefinitionId", newName: "FeedbackDefinition_Id");
        }
    }
}
