using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using EventFeedback.Common;
using EventFeedback.Domain;
using EventFeedback.Domain.Identity;
using EventFeedback.Web.Api.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Web.Api.Controllers.Admin
{
    [Authorize(Roles = "Administrator")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RolesController : ApiController
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly DataContext _context;
        //private readonly UserService _userService;

        public RolesController(DataContext context /*, UserService userService*/)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            //Guard.Against<ArgumentNullException>(userService == null, "userService cannot be null");

            _context = context;
            //_userService = userService;
        }

        [Route("api/v1/admin/roles")]
        [HttpGet]
        [ResponseType(typeof(IEnumerable<RoleAdminBindingModel>))]
        public IHttpActionResult Get()
        {
            _traceSource.TraceInformation("usersscontroller get all");
            return
                Ok(Map(_context.Roles.OrderBy(u => u.Name)));
        }

        private IEnumerable<RoleAdminBindingModel> Map(IEnumerable<Role> sources)
        {
            foreach (var user in sources.NullToEmpty())
            {
                yield return new RoleAdminBindingModel
                {
                    Id = user.Id.ToString(),
                    Name = user.Name,
                };
            }
        }

        //private IdentityRole Map(RoleAdminBindingModel source)
        //{
        //    return new IdentityRole
        //    {
        //        Id = source.Id,
        //        Name = source.Name
        //    };
        //}
    }
}