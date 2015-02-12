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

            // TODO: update database migration here
        }
	}
}