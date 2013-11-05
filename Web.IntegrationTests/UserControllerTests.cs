using System.Net;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Web.IntegrationTests
{
    [TestClass]
    public class UserControllerTests
    {
        private const string BaseUrl = "https://localhost:44300/api";

        public UserControllerTests()
        {
            ServicePointManager
                .ServerCertificateValidationCallback +=
                (sender, cert, chain, sslPolicyErrors) => true;
        }

        [TestMethod]
        public void Can_Obtain_Token_For_Valid_User()
        {
            var client = new HttpClient();
            var response = client.PostAsJsonAsync(BaseUrl + "/user/token", new
            {
                UserName = "admin",
                Password = "adminadmin"
            }).Result;
            var result = response.Content.ReadAsAsync<JObject>().Result;
            Assert.IsNotNull(result);
            var accessToken = result.Value<string>("accessToken");

            Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
            Assert.IsTrue(!string.IsNullOrEmpty(accessToken), "AccessToken");
        }

        [TestMethod]
        public void Cannot_Obtain_Token_For_InValid_User()
        {
            var client = new HttpClient();
            var response = client.PostAsJsonAsync(BaseUrl + "/user/token", new
            {
                UserName = "unk",
                Password = "unkunk"
            }).Result;

            var result = response.Content.ReadAsAsync<JObject>().Result;
            Assert.IsNull(result);
            Assert.IsTrue(!response.IsSuccessStatusCode, "IsSuccessStatusCode");
            Assert.IsTrue(result == null, "AccessToken");
        }

        [TestMethod]
        public void Access_Secured_Endpoint_With_Obtained_Token()
        {
            var client = new HttpClient();
            var response = client.PostAsJsonAsync(BaseUrl + "/user/token", new
            {
                UserName = "admin",
                Password = "adminadmin"
            }).Result;
            var result = response.Content.ReadAsAsync<JObject>().Result;
            Assert.IsNotNull(result);
            var accessToken = result.Value<string>("accessToken");

            Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
            Assert.IsTrue(!string.IsNullOrEmpty(accessToken), "AccessToken");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var profile = client.GetAsync(BaseUrl + "/user/profile")
                .Result.Content.ReadAsAsync<JObject>().Result;

            Assert.IsTrue(response.IsSuccessStatusCode, "IsSuccessStatusCode");
            Assert.IsNotNull(profile);

            var userName = profile.Value<string>("userName");
            Assert.IsTrue(!string.IsNullOrEmpty(userName));
        }
    }
}
