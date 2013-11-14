﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Web.Api.Models;

namespace EventFeedback.Web.Api.Controllers.Admin
{
    [Authorize(Roles = "Administrator")]
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

        [Route("api/v1/admin/users")]
        [HttpGet]
        public IEnumerable<UserAdminBindingModel> Get([FromUri] string filter = "")
        {
            //Thread.Sleep(1500);
            _traceSource.TraceInformation("usersscontroller get all");
            IEnumerable<User> users;

            if (filter.Equals("all", StringComparison.CurrentCultureIgnoreCase) && User.IsInRole("Administrator"))
                return 
                    Map(_context.Users.OrderBy(u => u.UserName));
            return
                Map(_context.Users.OrderBy(u => u.UserName)
                    .Include(u => u.Roles)
                    .Where(u => !(u.Active != null && !(bool) u.Active))
                    .Where(u => !(u.Deleted != null && (bool) u.Deleted)));
        }

        [Route("api/v1/admin/users")]
        public void Post(UserAdminBindingModel entity)
        {
            _traceSource.TraceInformation("userscontroller post");
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(!string.IsNullOrEmpty(entity.Id), "entity.id must be empty");
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(entity.Password), "entity.password cannot be empty");
            
            var user = Map(entity);
            user.Id = Guid.NewGuid().ToString();
            var result = _userService.CreateUser(user, entity.Password);

            // add the roles
            if(result.Succeeded)
                foreach(var role in entity.Roles.NullToEmpty().Split(' '))
                    _userService.AddUserToRole(user.Id, role);
        }

        [Route("api/v1/admin/users/{id}")]
        public void Put(string id, UserAdminBindingModel entity)
        {
            _traceSource.TraceInformation("usersscontroller put");
            Guard.Against<ArgumentException>(entity == null, "entity cannot be empty");
            Guard.Against<ArgumentException>(string.IsNullOrEmpty(entity.Id) && string.IsNullOrEmpty(id), "entity.id or id must be set");

            if (string.IsNullOrEmpty(entity.Id) && !string.IsNullOrEmpty(id)) entity.Id = id;
            if (!_context.Users.Has(entity.Id))
                throw new HttpResponseException(HttpStatusCode.NotFound);

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
            _userService.ClearUserRoles(user.Id);
            foreach (var role in entity.Roles.NullToEmpty().Split(' '))
                _userService.AddUserToRole(user.Id, role);
        }

        private IEnumerable<UserAdminBindingModel> Map(IEnumerable<User> sources)
        {
            foreach (var user in sources.NullToEmpty())
            {
                    yield return new UserAdminBindingModel
                    {
                        Id = user.Id,
                        Name = user.UserName,
                        Password = string.Empty,
                        Active = !user.Active.HasValue || user.Active.Value,
                        Organization = user.Organization,
                        Email = user.Email,
                        Roles = user.Roles != null && user.Roles.Any() 
                                ? user.Roles.OrderBy(r => r.Role.Name).Select(r => r.Role.Name).ToString(" ")
                                : null
                    };
            }
        }

        private User Map(UserAdminBindingModel source)
        {
            return new User
            {
                Id = source.Id,
                UserName = source.Name,
                Organization = source.Organization,
                Email = source.Email,
                Active = source.Active
                // todo ROLES
            };
        }
    }

    
}