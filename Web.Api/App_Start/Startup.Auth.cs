using Microsoft.Owin.Security.OAuth;
using Owin;

namespace EventFeedback.Web.Api
{
    public partial class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
        public static int ExpireMinutes { get { return 1440; } } // 24h

        public void ConfigureAuth(IAppBuilder app)
        {
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            app.UseOAuthBearerAuthentication(OAuthBearerOptions);
        }
    }
}