using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Domain.Membership;

namespace EventFeedback.Web.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class UsersController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            _context = context;
        }

        // GET api/values
        public IEnumerable<User> Get()
        {
            _traceSource.TraceInformation("eventscontroller get all");
            return _context.Users.Each(u =>
                {
                    u.Password = null;
                    u.PasswordSalt = null;
                    u.PasswordVerificationToken = null;
                }).AsEnumerable();
        }

        // GET api/values/5
        public User Get(int id)
        {
            _traceSource.TraceInformation("eventscontroller get " + id);
            return Get().FirstOrDefault(x => x.Id == id);
        }

        // POST api/values
        public void Post([FromBody] UserProfile value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody] UserProfile value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}