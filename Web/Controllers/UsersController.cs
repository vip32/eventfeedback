using System.Diagnostics;
using System.Reflection;
using EventFeedback.Web.Models;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Controllers
{
    public class UserController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            Guard.Against<ArgumentNullException>(userService == null, "userService cannot be null");
            _userService = userService;
        }

        [HttpPost]
        [Route("api/user/token")]
        public HttpResponseMessage Token(LoginBindingModel login)
        {
            if (login != null)
            {
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
                            UserName = login.UserName,
                            AccessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket),
                            Expires = ticket.Properties.ExpiresUtc
                        }, Configuration.Formatters.JsonFormatter)
                    };
                }
            }
            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        [Route("api/user/profile")]
        [Authorize]
        public HttpResponseMessage Profile()
        {
            var user = _userService.FindUserByName(User.Identity.Name);
            if (user == null || !user.IsActive()) return new HttpResponseMessage(HttpStatusCode.BadRequest);
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