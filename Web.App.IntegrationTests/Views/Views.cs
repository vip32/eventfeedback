using ClaySharp;

namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class Views
    {
        private readonly dynamic _new;

        public Views()
        {
            _new = new ClayFactory(); // http://weblogs.asp.net/bleroy/archive/2010/08/18/clay-malleable-c-dynamic-objects-part-2.aspx
        }

        public dynamic Signin
        {
            get
            {
                return _new.View(
                    Slug: "#signin",
                    Id: "signin-view",
                    Elements: _new.Elements(
                        UserName: _new.Element(Name: "username"),
                        Password: _new.Element(Name: "password"),
                        Submit: _new.Element(Text: "Sign in")
                        ));
            }
        }

        public dynamic Events
        {
            get
            {
                return _new.View(
                    Slug: "#events",
                    Id: "event-index-view",
                    Elements: _new.Elements(
                        ));
            }
        }

        public dynamic About
        {
            get
            {
                return _new.View(
                    Slug: "#about",
                    Id: "about-view",
                    Elements: _new.Elements(
                        ));
            }
        }

        public dynamic Home {
            get
            {
                return _new.View(
                    Slug: "#home",
                    Id: "home-view",
                    Elements: _new.Elements(
                        ));
            }
        }
    }
}