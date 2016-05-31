using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace EventFeedback.Common
{
    public class RequireHttpsHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage>
            SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = await base.SendAsync(request, cancellationToken);

            if (request.RequestUri.Scheme != Uri.UriSchemeHttps && !request.RequestUri.Host.Contains("localhost"))
            {
                var uriBuilder = new UriBuilder(request.RequestUri)
                    {
                        Scheme = Uri.UriSchemeHttps,
                        Port = 443

                    };
                response = request.CreateErrorResponse(HttpStatusCode.Forbidden, "https required");
                response.Headers.Location = uriBuilder.Uri;
            }
            return response;
        }
    }
}
