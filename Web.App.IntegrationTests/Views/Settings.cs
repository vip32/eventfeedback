namespace Eventfeedback.Web.App.IntegrationTests.UI
{
    public class Settings
    {
        public string AppHost
        {
            get { return "localhost"; }
        }         // "bit-eventfeedback.azurewebsites.net"

        public string Root
        {
            get { return "www/index.local.html"; }
        }

        public int Port
        {
            get { return 44300; }
        }

        public bool SSL
        {
            get { return true; }
        }

        public string UserName
        {
            get { return "admin"; }
        }

        public string Password
        {
            get { return "admin"; }
        }
    }
}