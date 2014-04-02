using System;
using Coypu;
using Coypu.Drivers.Selenium;

namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class BaseTests
    {
        public string AppHost = "localhost";  // "eventfeedback.azurewebsites.net"
        public string Root = "www/index.local.html";
        public int Port = 44300;
        public bool SSL = true;
        public string UserName = "admin";
        public string Password = "admin";
        public Views Views = new Views();
        public Elements Elements = new Elements();

        // TODO: ^^^get all from tempated config

        public void Do(Action<BrowserSession> action)
        {
            using (var browser = new BrowserSession(new SessionConfiguration
            {
                Driver = typeof(SeleniumWebDriver),
                Browser = Coypu.Drivers.Browser.Chrome,
                AppHost = AppHost, Port = Port, SSL = SSL
            }))
            {
                action(browser);
            }
        }
    }

    public class Views
    {
        public View Home = new View {Slug = "#home", Id = "home-view"};
        public View About = new View {Slug = "#about", Id = "about-view"};
        public View Events = new View {Slug = "#events", Id = "event-index-view"};
        public View Signin = new View {Slug = "#signin", Id = "signin-view"};
    }

    public class Elements
    {
        public Element SigninViewUserName = new Element {Name = "username"};
        public Element SigninViewPassword = new Element {Name = "password"};
        public Element SigninViewSubmit = new Element { Text = "Sign in" };
    }

    public class Element
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public string Css { get; set; }
    }

    public class View
    {
        public string Id { get; set; }
        public string Slug { get; set; }
    }
}