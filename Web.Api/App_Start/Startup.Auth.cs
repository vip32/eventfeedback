using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace EventFeedback.Web.Api
{
    public partial class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
        public static int ExpireMinutes { get { return 1440; } } // 1440 = 24h, 10080 = 1week

        public void ConfigureAuth(IAppBuilder app)
        {
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            app.UseOAuthBearerAuthentication(OAuthBearerOptions);
            //app.UseCookieAuthentication(new CookieAuthenticationOptions
            //{
            //    AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
            //    LoginPath = new PathString("/#signin")
            //});
        }
    }
}
// http://stackoverflow.com/questions/20895057/asp-net-identity-ioc-and-sharing-dbcontext
// http://stackoverflow.com/questions/20790990/why-does-the-asp-net-spa-template-instantiate-usermanager-once-for-all-requests
// https://groups.google.com/forum/#!topic/net-http-abstractions/fjEa3Luyc5E
// https://github.com/DotNetDoodle/DotNetDoodle.Owin.Dependencies