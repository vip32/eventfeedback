using System.Web;
using EventFeedback.Domain;
using Microsoft.Practices.Unity;

namespace EventFeedback.Web.Api
{
    public static class ContainerBuilder
    {
        public static IUnityContainer Build()
        {
            var container = new UnityContainer();

            return container
                //.RegisterType<IUserStore<User>, UserStore<User>>()
                //.RegisterType<IRoleStore<IdentityRole>, RoleStore<IdentityRole>>()
                //.RegisterType<UserManager<User>, UserManager<User>>()
                //.RegisterType<RoleManager<IdentityRole>, RoleManager<IdentityRole>>()
                .RegisterType<DataContext, DataContext>()
                .RegisterType<UserService, UserService>()
                .RegisterType<HttpContext>(
                    new InjectionFactory(c => HttpContext.Current));
        }
    }
}