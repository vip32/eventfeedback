using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Domain.Identity;
using EventFeedback.Web.Api.Models;

namespace EventFeedback.Web.Api.Controllers.Admin
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("api/v1/admin/users")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;
        private readonly UserService _userService;

        public UsersController(DataContext context, UserService userService)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            Guard.Against<ArgumentNullException>(userService == null, "userService cannot be null");

            _context = context;
            _userService = userService;
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(IEnumerable<User>))]
        public IHttpActionResult Get([FromUri] string filter = "")
        {
            _traceSource.TraceInformation("usersscontroller get all");
            return filter.Equals("all", StringComparison.CurrentCultureIgnoreCase)
                ? Ok(Map(_context.Users.OrderBy(u => u.UserName)))
                : Ok(Map(_context.Users.OrderBy(u => u.UserName).ToList().Where(u => u.IsActive())));
            //.Where(u => !(u.Active != null && !(bool) u.Active))
            //.Where(u => !(u.Deleted != null && (bool) u.Deleted))));
        }

        [HttpPost]
        [Route("")]
        [ResponseType(typeof(User))]
        public IHttpActionResult Post(UserAdminBindingModel entity)
        {
            _traceSource.TraceInformation("userscontroller post");
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(!string.IsNullOrEmpty(entity.Id), "entity.id must be empty");
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(entity.UserName), "entity.userName cannot be empty");
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(entity.Password), "entity.password cannot be empty");
            
            var user = Map(entity);
            if (_userService.Exists(user.UserName))
                return BadRequest(string.Format("user with name {0} already exists", user.UserName));

            var result = _userService.CreateUser(user, entity.Password);

            // add the roles
            if(result.Succeeded && !string.IsNullOrEmpty(entity.Roles))
                foreach(var role in entity.Roles.Split(' '))
                    _userService.AddUserToRole(user, role);

            // set the other properties
            if (entity.ActiveFrom != null) user.ActiveFromDate = entity.ActiveFrom.Value;
            if (entity.ActiveTill != null) user.ActiveTillDate = entity.ActiveTill.Value;
            if (!string.IsNullOrEmpty(entity.Organization)) user.Organization = entity.Organization;
            _userService.UpdateUser(user);

            return Created("http://acme.com/users/" + user.Id, user);
        }

        [HttpPut]
        [Route("{id}")]
        [ResponseType(typeof(User))]
        public IHttpActionResult Put(string id, UserAdminBindingModel entity)
        {
            _traceSource.TraceInformation("usersscontroller put");
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(entity.Id) && string.IsNullOrEmpty(id), "entity.id or id must be set");

            if (string.IsNullOrEmpty(entity.Id) && !string.IsNullOrEmpty(id)) entity.Id = id;
            if (!_context.Users.Has(entity.Id))
                return StatusCode(HttpStatusCode.NotFound);

            var user = Map(entity);
            var entry = _context.Entry(user);
            if (entry.State == EntityState.Detached)
            {
                _context.Users.Attach(user);
                entry.State = EntityState.Modified;
            }
            _context.SaveChanges();

            // update the password if it is provided
            if (!string.IsNullOrEmpty(entity.Password))
                _userService.UpdatePassword(user.Id, entity.Password);

            // update the roles
            _userService.ClearUserRoles(user);
            foreach (var role in entity.Roles.NullToEmpty().Split(' '))
                _userService.AddUserToRole(user, role);

            // update the other properties
            if (entity.ActiveFrom != null) 
                user.ActiveFromDate = entity.ActiveFrom.Value;
            else
                user.ActiveFromDate = null;
            if (entity.ActiveTill != null)
                user.ActiveTillDate = entity.ActiveTill.Value;
            else
                user.ActiveTillDate = null;
            user.Organization = entity.Organization;
            _userService.UpdateUser(user);

            return Ok(user);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Administrator")]
        public IHttpActionResult Delete(string id)
        {
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(id), "id cannot be empty or zero");

            var entity = _context.Users.Find(id);
            if (entity == null) return StatusCode(HttpStatusCode.NotFound);
            entity.Deleted = true;
            entity.DeleteDate = SystemTime.Now();
            entity.DeletedBy = User.Identity.Name;
            _context.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }

        private IEnumerable<UserAdminBindingModel> Map(IEnumerable<User> sources)
        {
            foreach (var user in sources.NullToEmpty())
            {
                    yield return new UserAdminBindingModel
                    {
                        Id = user.Id.ToString(),
                        UserName = user.UserName,
                        Password = string.Empty,
                        Active = !user.Active.HasValue || user.Active.Value,
                        Organization = user.Organization,
                        Email = user.Email,
                    };
            }
        }

        private User Map(UserAdminBindingModel source)
        {
            return new User
            {
                Id = !string.IsNullOrEmpty(source.Id) ? new Guid(source.Id) : Guid.Empty,
                UserName = source.UserName,
                Organization = source.Organization,
                Email = source.Email,
                Active = source.Active
            };
        }
    }
}