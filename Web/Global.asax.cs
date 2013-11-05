using System;
using System.Web.Http;
using System.Web.Mvc;
using EventFeedback.Common;

namespace EventFeedback.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //AreaRegistration.RegisterAllAreas();
            //DependencyResolverConfig.Setup();
            //AuthConfig.Register(GlobalConfiguration.Configuration);
            //FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            //SystemTime.Now = () => new DateTime(2013, 10, 9);
        }
    }
}