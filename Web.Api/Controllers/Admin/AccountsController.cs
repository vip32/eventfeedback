using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;

namespace EventFeedback.Web.Api.Controllers.Admin
{
    [Authorize(Roles = "Administrator")]
    [Route("api/v1/admin/users")]
    public class UsersController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        public IEnumerable<User> Get([FromUri] string filter = "")
        {
            //Thread.Sleep(1500);

            _traceSource.TraceInformation("usersscontroller get all");
            IEnumerable<User> result;

            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                result = _context.Users.OrderBy(e => e.UserName);
            else
                result = _context.Users.OrderBy(e => e.UserName) //.Include("Sessions")
                                 .Where(d => !(d.Active != null && !(bool)d.Active))
                                 .Where(d => !(d.Deleted != null && (bool)d.Deleted));

            return result.NullToEmpty().Any() ? result : null;
        }
    }
}