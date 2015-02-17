using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Cors;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Web.Api.Models;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;

namespace EventFeedback.Web.Api.Controllers
{
    [RoutePrefix("api/v1/user")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly UserService _userService;
        private readonly TelemetryClient _telemetry = new TelemetryClient();

        public UserController(UserService userService)
        {
            Guard.Against<ArgumentException>(userService == null, "userService cannot be null");
            _userService = userService;
        }

        [HttpPost]
        [Route("token")]
        public HttpResponseMessage Token(LoginBindingModel login)
        {
            using (new TraceLogicalScope(_traceSource, "UserController:Token"))
            {
                Guard.Against<ArgumentException>(login == null, "login cannot be empty be null");
                var et = new EventTelemetry("API:Users/Login");
                et.Properties.Add("username", login.UserName);
                _telemetry.TrackEvent(et);

                var user = _userService.FindUser(login.UserName, login.Password);
                if (user != null && user.IsActive())
                {
                    //_userService.HideSensitiveData(user);
                    var identity = _userService.CreateIdentity(user, Startup.OAuthBearerOptions.AuthenticationType);
                    identity.AddClaim(new Claim(ClaimTypes.Name, login.UserName));
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
                    var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                    var currentUtc = new SystemClock().UtcNow;
                    ticket.Properties.IssuedUtc = currentUtc;
                    ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromMinutes(1440));
                    _traceSource.Warn("login success");
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
                _traceSource.Warn("login failed");
                return new HttpResponseMessage(HttpStatusCode.Unauthorized);
            }
        }

        [HttpGet]
        [Route("profile")]
        [Authorize]
        public HttpResponseMessage Profile()
        {
            using (new TraceLogicalScope(_traceSource, "UserController:Profile"))
            {
                var user = _userService.FindUserByName(User.Identity.Name);
                if (user == null || !user.IsActive()) return new HttpResponseMessage(HttpStatusCode.Unauthorized);
                var roles = _userService.UserRoles(user);
                _userService.HideSensitiveData(user);
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<object>(new
                    {
                        UserName = User.Identity.Name,
                        Profile = user,
                        Roles = roles
                    }, Configuration.Formatters.JsonFormatter)
                };
            }
        }
    }
}