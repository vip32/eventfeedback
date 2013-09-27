using System;
using System.Diagnostics;
using System.IdentityModel.Tokens;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EventFeedback.Common;
using EventFeedback.Domain.Membership;
using WebMatrix.WebData;

namespace EventFeedback.Web
{
    public class BasicAuthenticationHandler : DelegatingHandler
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly MembershipService _membershipService;
        private const string Scheme = "Basic";

        public BasicAuthenticationHandler(MembershipService membershipService)
        {
            Guard.Against<ArgumentNullException>(membershipService == null, "membershipService");
            _membershipService = membershipService;
        }

        protected async override Task<HttpResponseMessage>
            SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
                //_traceSource.TraceInformation("checking auth");

                // perform request processing 
                var headers = request.Headers;
                if (headers.Authorization != null && Scheme.Equals(headers.Authorization.Scheme))
                {
                    var authenticated = false;
                    var encoding = Encoding.GetEncoding("iso-8859-1");
                    var credentials = encoding.GetString(Convert.FromBase64String(headers.Authorization.Parameter));
                    var parts = credentials.Split(':');
                    var username = parts[0].Trim();
                    var password = parts[1].Trim();

                    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                        authenticated = _membershipService.Login(username, password);

                    if (authenticated)
                    {
                        Thread.CurrentPrincipal = _membershipService.CreateClaimsPrincipal(username, AuthenticationMethods.Password, Scheme);
                    }
                    else
                    {
                        Thread.CurrentPrincipal = null;
                        WebSecurity.Logout();
                    }
                }

                var response = await base.SendAsync(request, cancellationToken);
                response.Headers.Add("X-ActivityId", Trace.CorrelationManager.ActivityId.ToString());
                // perform response processing
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                    response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("x" + Scheme));

                return response;
            }
            catch (Exception ex)
            {
                // perform error processing
                var response = request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex);
                response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue(Scheme));
                return response;
            }
        }
    }
}
