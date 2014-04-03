using System;
using Coypu;
using Coypu.Drivers.Selenium;

namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class BaseViewTests
    {
        public Settings Settings = new Settings();
        public Views Views = new Views();

        public void Do(Action<BrowserSession> action)
        {
            using (var browser = new BrowserSession(new SessionConfiguration
            {
                Driver = typeof(SeleniumWebDriver),
                Browser = Coypu.Drivers.Browser.Chrome,
                AppHost = Settings.AppHost, Port = Settings.Port, SSL = Settings.SSL
            }))
            {
                action(browser);
            }
        }
    }
}