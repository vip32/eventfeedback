namespace EventFeedback.Domain.Migrations
{
    using System.Data.Entity.Migrations;

    public sealed class Configuration : DbMigrationsConfiguration<DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(EventFeedback.Domain.DataContext context)
        {
            // TestData.Seed(context);
            ResourceTextData.Seed(context);
        }
    }
}
