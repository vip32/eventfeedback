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

        public UserService(DataContext context)
        {
            _userManager = new UserManager<User>(new UserStore<User>(context));
            _roleManager = new RoleManager<Role>(new RoleStore<Role>(context));
        }

        public IdentityResult CreateUser(User user, string password)
        {
            if (user == null || string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(password)) return null;
            return _userManager.Create(user, password);
        }

        public User FindUser(string userName, string password)
        {
            return _userManager.Find(userName, password);
        }

        public ClaimsIdentity CreateIdentity(User user)
        {
            return _userManager.CreateIdentity(user, AuthenticationMethods.Password);
        }
    }
}
