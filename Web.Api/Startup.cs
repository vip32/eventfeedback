using System;
using System.Web.Mvc;
using EventFeedback.Common;
using Owin;

namespace EventFeedback.Web.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            SystemTime.Now = () => new DateTime(2013, 10, 9);

            AreaRegistration.RegisterAllAreas();

            ConfigureAuth(app);
            ConfigureWebApi(app);
        }
    }
}