using System.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain
{
    public class UserService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserService"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public UserService(DataContext context)
        {
            _userManager = new UserManager<User>(new UserStore<User>(context));
            _roleManager = new RoleManager<Role>(new RoleStore<Role>(context));
        }

        /// <summary>
        /// Creates the new user.
        /// </summary>
        /// <param name="user">The new user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public IdentityResult CreateUser(User user, string password)
        {
            if (user == null || string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(password)) return null;
            return _userManager.Create(user, password);
        }

        /// <summary>
        /// Finds the user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public User FindUser(string userName, string password)
        {
            return _userManager.Find(userName, password);
        }

        /// <summary>
        /// Creates the identity based on the user and its claims.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        public ClaimsIdentity CreateIdentity(User user)
        {
            return _userManager.CreateIdentity(user, AuthenticationMethods.Password);
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
        /// <param name="userId">The user identifier.</param>
        /// <param name="role">The role.</param>
        /// <returns></returns>
        public IdentityResult AddUserToRole(string userId, string role)
        {
            return _userManager.AddToRole(userId, role);
        }
    }
}
