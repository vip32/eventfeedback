using Microsoft.Owin.Security.OAuth;
using Owin;

namespace EventFeedback.Web.Api
{
    public partial class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
        public static int ExpireMinutes { get { return 10080; } } // 1440 = 24h, 10080 = 1week

        public void ConfigureAuth(IAppBuilder app)
        {
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            app.UseOAuthBearerAuthentication(OAuthBearerOptions);
        }
    }
}