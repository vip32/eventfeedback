using System;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;

namespace EventFeedback.Web.Api.IntegrationTests
{
    public class BaseControllerTests
    {
        public const string BaseUrl = "https://localhost:44300";
        public static string Token { get; set; }

        static BaseControllerTests()
        {
            Token = ObtainToken();
        }

        public static string ObtainToken()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(BaseUrl);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = client.PostAsJsonAsync("api/v1/user/token", new
                {
                    UserName = "admin",
                    Password = "admin"
                }).Result;
                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsAsync<JObject>().Result;
                    return result.Value<string>("accessToken");
                }
                throw new InternalTestFailureException("Cannot obtain token. StatusCode=" + response.StatusCode);
            }
        }
    }
}