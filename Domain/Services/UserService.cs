using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Claims;
using EventFeedback.Common;
using EventFeedback.Domain.Identity;
using Microsoft.AspNet.Identity;

namespace EventFeedback.Domain
{
    public class UserService
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private readonly UserManager<User, Guid> _userManager;
        private readonly RoleManager<Role, Guid> _roleManager;
        private readonly DataContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserService" /> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="userManager">The user manager.</param>
        /// <param name="roleManager">The role manager.</param>
        public UserService(DataContext context,
                           UserManager<User, Guid> userManager, RoleManager<Role, Guid> roleManager)
        {
            Guard.Against<ArgumentNullException>(context == null, "context cannot be null");
            Guard.Against<ArgumentNullException>(userManager == null, "userManager cannot be null");
            Guard.Against<ArgumentNullException>(roleManager == null, "roleManager cannot be null");

            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            
            _userManager.UserValidator = new UserValidator<User, Guid>(_userManager)
            {
                AllowOnlyAlphanumericUserNames = true,
                RequireUniqueEmail = false
            };
            _userManager.PasswordValidator = new MinimumLengthValidator(4);
            //var dataProtectionProvider = options.DataProtectionProvider;
            //if (dataProtectionProvider != null)
            //{
            //    _userManager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser, int>(dataProtectionProvider.Create("PasswordReset"));
            //}
        }

        /// <summary>
        /// Creates the new user.
        /// </summary>
        /// <param name="user">The new user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public IdentityResult CreateUser(User user, string password)
        {
            if (user == null || 
                string.IsNullOrEmpty(user.UserName) || 
                string.IsNullOrEmpty(password)) return null;
            try
            {
                return _userManager.Create(user, password);
            }
            catch(Exception ex)
            {
                _traceSource.Error(ex.Message);
                _traceSource.Error(_context.GetValidationErrors());
                throw;
            }
        }

        public void UpdateUser(User user)
        {
            _userManager.Update(user);
        }

        /// <summary>
        /// Updates the password for the user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public IdentityResult UpdatePassword(Guid userId, string password)
        {
            if (userId.IsNull() || userId.IsNew()) return null;
            try
            {
                return _userManager.AddPassword(userId, password);
            }
            catch (Exception ex)
            {
                _traceSource.Error(ex.Message);
                _traceSource.Error(_context.GetValidationErrors());
                throw;
            }
        }

        /// <summary>
        /// Finds the user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public User FindUser(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password)) return null;
            return _userManager.Find(userName, password);
        }

        public User FindUserByName(string userName)
        {
            if (string.IsNullOrEmpty(userName)) return null;
            return _userManager.FindByName(userName);
        }

        public bool Exists(string userName)
        {
            if (string.IsNullOrEmpty(userName)) return false;
            return _userManager.FindByName(userName) != null;
        }

        public IEnumerable<string> AllRoles()
        {
            return _context.Roles.Select(r => r.Name);
        }

        public IEnumerable<string> UserRoles(User user)
        {
            if (user == null || user.Id.Equals(Guid.NewGuid())) return null;
            return _userManager.GetRoles(user.Id);
        }

        public User HideSensitiveData(User user)
        {
            user.PasswordHash = null;
            user.SecurityStamp = null;
            user.Roles.Clear();
            return user;
        }

        /// <summary>
        /// Creates the identity based on the user and its claims.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="type">The authentication type.</param>
        /// <returns></returns>
        public ClaimsIdentity CreateIdentity(User user, string type)
        {
            return _userManager.CreateIdentity(user, type);
        }

        /// <summary>
        /// Creates the new role.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <returns></returns>
        public IdentityResult CreateRole(Role role)
        {
            return _roleManager.Create(role);
        }

        /// <summary>
        /// Adds the user to the role.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="role">The role.</param>
        /// <returns></returns>
        public IdentityResult AddUserToRole(User user, string role)
        {
            if (user == null || user.Id.Equals(Guid.NewGuid())) return null;
            return _userManager.AddToRole(user.Id, role);
        }

        public void ClearUserRoles(User user)
        {
            if (user == null || user.Id.Equals(Guid.NewGuid())) return;
            foreach (var role in _userManager.GetRoles(user.Id))
                _userManager.RemoveFromRole(user.Id, role);

        }
    }
}
