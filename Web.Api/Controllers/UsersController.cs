using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Web.Api.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/user")]
    public class UserController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            Guard.Against<ArgumentException>(userService == null, "userService cannot be null");
            _userService = userService;
        }

        [HttpPost]
        [Route("token")]
        public HttpResponseMessage Token(LoginBindingModel login)
        {
            Guard.Against<ArgumentException>(login == null, "login cannot be empty be null");

            //Thread.Sleep(1500);

            var user = _userService.FindUser(login.UserName, login.Password);
            if (user != null && user.IsActive())
            {
                _userService.HideSensitiveData(user);
                var identity = _userService.CreateIdentity(user, Startup.OAuthBearerOptions.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, login.UserName));
                var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                var currentUtc = new SystemClock().UtcNow;
                ticket.Properties.IssuedUtc = currentUtc;
                ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromMinutes(Startup.ExpireMinutes));
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<object>(new
                    {
                        UserName = identity.GetUserName(),
                        AccessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket),
                        Issued = DateTime.UtcNow,
                        Expires = ticket.Properties.ExpiresUtc
                    }, Configuration.Formatters.JsonFormatter)
                };
            }
            return new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }

        [HttpGet]
        [Route("profile")]
        [Authorize]
        public HttpResponseMessage Profile()
        {
            Thread.Sleep(1500);

            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return new HttpResponseMessage(HttpStatusCode.Unauthorized);
            _userService.HideSensitiveData(user);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<object>(new
                {
                    UserName = User.Identity.Name,
                    Profile = user
                }, Configuration.Formatters.JsonFormatter)
            };
        }
    }
}