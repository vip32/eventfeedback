namespace EventFeedback.Domain.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<DataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(EventFeedback.Domain.DataContext context)
        {
            // TestData.Seed(context);
        }
    }
}
