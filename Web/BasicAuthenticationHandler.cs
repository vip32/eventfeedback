//using System;
//using System.Diagnostics;
//using System.IdentityModel.Tokens;
//using System.Net;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Reflection;
//using System.Security.Claims;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;
//using EventFeedback.Common;
//using EventFeedback.Domain;
//using Microsoft.AspNet.Identity;

//namespace EventFeedback.Web
//{
//    public class BasicAuthenticationHandler : DelegatingHandler
//    {
//        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
//        private readonly UserService _userService;
//        private const string Scheme = "Basic";

//        public BasicAuthenticationHandler(UserService userService)
//        {
//            Guard.Against<ArgumentNullException>(userService == null, "userService");

//            _userService = userService;
//        }

//        protected override Task<HttpResponseMessage>
//            SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
//        {
//            //try
//            //{
//                // perform request processing 
//                Thread.CurrentPrincipal = null;
//                var headers = request.Headers;
//                if (headers.Authorization != null && Scheme.Equals(headers.Authorization.Scheme))
//                {
//                    var encoding = Encoding.GetEncoding("iso-8859-1");
//                    var credentials = encoding.GetString(Convert.FromBase64String(headers.Authorization.Parameter));
//                    var parts = credentials.Split(':');
//                    var username = parts[0].Trim();
//                    var password = parts[1].Trim();

//                    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
//                    {
//                        var user = _userService.FindUser(username, password);
//                        if (user != null && user.IsActive())
//                        {
//                            var identity = _userService.CreateIdentity(user);
//                            Thread.CurrentPrincipal = new ClaimsPrincipal(identity);
//                        }
//                    }
//                }

//                //var response = await base.SendAsync(request, cancellationToken);
//                //response.Headers.Add("X-ActivityId", Trace.CorrelationManager.ActivityId.ToString());

//                //// perform response processing
//                //if (response.StatusCode == HttpStatusCode.Unauthorized)
//                //    response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("x" + Scheme));

//                //return response;
//            //}
//            //catch (Exception ex)
//            //{
//            //    // perform error processing
//            //    var response = request.CreateErrorResponse(HttpStatusCode.Unauthorized, ex);
//            //    response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue(Scheme));
//            //    //return response;
//            //}

//            return base.SendAsync(request, cancellationToken);
//        }
//    }
//}
