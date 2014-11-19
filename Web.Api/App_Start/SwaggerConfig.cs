using System.Web.Http;
using EventFeedback.Web.Api;
using WebActivatorEx;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace EventFeedback.Web.Api
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            Swashbuckle.Bootstrapper.Init(GlobalConfiguration.Configuration);

            // NOTE: If you want to customize the generated swagger or UI, use SwaggerSpecConfig and/or SwaggerUiConfig here ...
        }
    }
}