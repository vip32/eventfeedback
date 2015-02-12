using System.Configuration;
using System.Data.Entity.Migrations;
using System.Web.Http;
using System.Web.Mvc;

namespace EventFeedback.Web.Api
{
	public class Global : System.Web.HttpApplication
	{
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // update database migration here
            if (bool.Parse(ConfigurationManager.AppSettings["MigrateDatabaseToLatestVersion"]))
            {
                System.Diagnostics.Trace.Write("starting db migrations upgrade");
                var configuration = new Domain.Migrations.Configuration();
                var migrator = new DbMigrator(configuration);
                migrator.Update();
            }
        }
	}
}