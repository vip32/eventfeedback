using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Controllers
{
    [Authorize]
    public class UsersController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        [HttpGet]
        [ActionName("current")]
        public User GetCurrent()
        {
            //Thread.Sleep(1500);

            _traceSource.TraceInformation("userscontroller get current");
            var user = _context.Users.FirstOrDefault(x => x.UserName.Equals(Thread.CurrentPrincipal.Identity.Name, StringComparison.CurrentCultureIgnoreCase));
            if (user == null) return null;
            user.PasswordHash = null;
            user.SecurityStamp = null;
            return user;
        }
    }
}