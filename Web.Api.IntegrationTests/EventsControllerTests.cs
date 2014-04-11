using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using EventFeedback.Domain;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EventFeedback.Web.Api.IntegrationTests
{
    [TestClass]
    public class EventsControllerTests : BaseControllerTests
    {
        [TestMethod]
        public async Task GetActiveEventsTest()
        {
            using (var client = new HttpClient())
            {
                // arrange
                client.BaseAddress = new Uri(BaseUrl);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
                
                // act
                var response = await client.GetAsync("api/v1/events");
                if (response.IsSuccessStatusCode)
                {
                    var entities = await response.Content.ReadAsAsync<IEnumerable<Event>>();

                    // assert
                    Assert.IsNotNull(entities);
                    Assert.IsTrue(entities.Any());
                }
                else
                    Assert.Fail("Finished with unexpected StatusCode '{0}'", response.StatusCode);
            }
        }
    }
}
