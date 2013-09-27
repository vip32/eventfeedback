using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using WebMatrix.WebData;

namespace EventFeedback.Domain.Membership
{
    public class MembershipService
    {
        private readonly SimpleRoleProvider _roles;
        private readonly SimpleMembershipProvider _membership;

        public MembershipService()
        {
            _roles = (SimpleRoleProvider)System.Web.Security.Roles.Provider;
            _membership = (SimpleMembershipProvider)System.Web.Security.Membership.Provider;
        }

        private bool EnsureInitialized()
        {
            if (!WebSecurity.Initialized)
                WebSecurity.InitializeDatabaseConnection("DataContext", "UserProfiles", "UserId", "UserName",
                                                         autoCreateTables: false);
            return WebSecurity.Initialized;
        }

        //public bool EnsureUsers()
        //{
        //    if (EnsureInitialized())
        //    {
        //        if (!_roles.RoleExists("Administrator"))
        //        {
        //            _roles.CreateRole("Administrator");
        //        }
        //        if (_membership.GetUser("admin", false) == null)
        //        {
        //            _membership.CreateUserAndAccount("admin", "admin");
        //        }
        //        if (!_roles.GetRolesForUser("admin").Contains("Administrator"))
        //        {
        //            _roles.AddUsersToRoles(new[] { "admin" }, new[] { "Administrator" });
        //        }
        //        if (_membership.GetUser("user1", false) == null)
        //        {
        //            _membership.CreateUserAndAccount("user1", "test");
        //        }
        //        if (_membership.GetUser("user2", false) == null)
        //        {
        //            _membership.CreateUserAndAccount("user2", "test");
        //        }
        //        return true;
        //    }
        //    return false;
        //}

        public bool Login(string username, string password)
        {
            if(EnsureInitialized())
                return WebSecurity.Login(username, password);
            return false; // throw exception
        }

        public void Logout()
        {
            if (EnsureInitialized())
                WebSecurity.Logout();
            // throw exception
        }

        public IPrincipal CreateClaimsPrincipal(string username, string authMethod, string scheme)
        {
            if (EnsureInitialized())
            {
                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, username),
                        new Claim(ClaimTypes.AuthenticationMethod, authMethod)
                    };

                // map the membership roles to role claims, needed for [Authorize(Roles = "Administrator")]
                claims.AddRange(_roles.GetRolesForUser(username).Select(role => new Claim(ClaimTypes.Role, role)));

                return new ClaimsPrincipal(new[]
                    {
                        new ClaimsIdentity(claims, scheme)
                    });
            }
            // throw exception
            return null;
        }
    }
}
