using NUnit.Framework;

namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class HomeTests : BaseTests
    {
        public void OnAppStartupTheHomeViewIsShowed()
        {}
    }

    public class AboutTests : BaseTests
    { }

    [TestFixture]
    public class SigninTests : BaseTests
    {
        [Test]
        public void WithASignedoutUserAndNavigatingToTheEventsViewShowsTheSigninView()
        {
            Do(browser =>
            {
                browser.Visit(Root + Views.Events.Slug);

                browser.FillIn(Elements.SigninViewUserName.Name).With(UserName);
                browser.FillIn(Elements.SigninViewPassword.Name).With(Password);
                browser.ClickButton(Elements.SigninViewSubmit.Text);

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

    public class EventIndexTests : BaseTests
    {
        public void EventIndexViewShowsTheActiveEvents(){}
        
        public void WithAnAdminUserEventIndexViewShowsTheAddButton(){}

        public void EventIndexViewAndSelectingAnEventShowsTheEventDetailsView() { }
    }

    public class EventDetailsTests : BaseTests
    {
        public void WithAnAdminUserTheEventDetailsViewShowsTheEditAndDeleteButton(){}
    }

    public class SessionIndexTests : BaseTests
    {
        public void SessionIndexViewShowsTheActiveSessions() { }

        public void WithAnAdminUserEventIndexViewShowsTheAddButton() { }

        public void SessionIndexViewAndSelectingASessionShowsTheSessionDetailsView() { }
    }

    public class SessionDetailsTests : BaseTests
    {
        public void WithAnAdminUserTheSessionDetailsViewShowsTheEditAndDeleteButton(){}

        // feedbacks
    }
}
