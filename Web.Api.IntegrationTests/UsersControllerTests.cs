using System;
using System.Net;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EventFeedback.Web.Api.IntegrationTests
{
    [TestClass]
    public class UsersControllerTests : BaseControllerTests
    {
        [TestMethod]
        public void Can_Obtain_Token_For_Valid_User()
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
                    var accessToken = result.Value<string>("accessToken");
                    
                    Assert.IsNotNull(result);
                    Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
                    Assert.IsTrue(response.StatusCode == HttpStatusCode.OK, "HttpStatusCode should be Ok");
                    Assert.IsTrue(!string.IsNullOrEmpty(accessToken), "AccessToken");
                }
                else
                    Assert.Fail("Finished with unexpected StatusCode '{0}'", response.StatusCode);
            }
        }

        [TestMethod]
        public void Cannot_Obtain_Token_For_InValid_User()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(BaseUrl);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = client.PostAsJsonAsync("api/v1/user/token", new
                {
                    UserName = "unk",
                    Password = "unkunk"
                }).Result;
                Assert.IsTrue(!response.IsSuccessStatusCode);
                Assert.IsTrue(response.StatusCode == HttpStatusCode.Unauthorized,
                    "HttpStatusCode should be NotFound was " + response.StatusCode);
            }
        }

        [TestMethod]
        public void Access_Secured_Endpoint_With_Obtained_Token()
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
                    Assert.IsNotNull(result);
                    var accessToken = result.Value<string>("accessToken");
                    Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
                    Assert.IsTrue(!string.IsNullOrEmpty(accessToken), "AccessToken");

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var profile = client.GetAsync("api/v1/user/profile")
                        .Result.Content.ReadAsAsync<JObject>().Result;

                    Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
                    Assert.IsNotNull(profile);

                    var userName = profile.Value<string>("userName");
                    Assert.IsTrue(!string.IsNullOrEmpty(userName));
                }
                else
                    Assert.Fail("Finished with unexpected StatusCode '{0}'", response.StatusCode);
            }
        }
    }
}
