using NUnit.Framework;

namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class HomeViewTests : BaseViewTests
    {
        public void OnAppStartupTheHomeViewIsShowed()
        {}
    }

    public class AboutViewTests : BaseViewTests
    { }

    [TestFixture]
    public class SigninViewTests : BaseViewTests
    {
        [Test]
        public void WithASignedoutUserAndNavigatingToTheEventsViewShowsTheSigninView()
        {
            Do(browser =>
            {
                browser.Visit(Settings.Root + Views.Events.Slug);

                browser.FillIn(Views.Signin.Elements.UserName.Name).With(Settings.UserName);
                browser.FillIn(Views.Signin.Elements.Password.Name).With(Settings.Password);
                browser.ClickButton(Views.Signin.Elements.Submit.Text);

                Assert.IsTrue(browser.FindId(Views.Events.Id).Exists());
            });
        }

        public void WithASignedinUserAndNavigatingToTheEventsViewShowsTheEventsView()
        {
        }

        public void SigninWithValidCredentials() { }

        public void UrlSigninWithValidCredentials() { }

        public void SigninWithInvalidCredentials() { }

        public void UrlSigninWithInvalidCredentials() { }
    }

    public class EventIndexViewTests : BaseViewTests
    {
        public void EventIndexViewShowsTheActiveEvents(){}
        
        public void WithAnAdminUserEventIndexViewShowsTheAddButton(){}

        public void EventIndexViewAndSelectingAnEventShowsTheEventDetailsView() { }
    }

    public class EventDetailsViewTests : BaseViewTests
    {
        public void WithAnAdminUserTheEventDetailsViewShowsTheEditAndDeleteButton(){}
    }

    public class SessionIndexViewTests : BaseViewTests
    {
        public void SessionIndexViewShowsTheActiveSessions() { }

        public void WithAnAdminUserEventIndexViewShowsTheAddButton() { }

        public void SessionIndexViewAndSelectingASessionShowsTheSessionDetailsView() { }
    }

    public class SessionDetailsViewTests : BaseViewTests
    {
        public void WithAnAdminUserTheSessionDetailsViewShowsTheEditAndDeleteButton(){}

        // feedbacks
    }
}
