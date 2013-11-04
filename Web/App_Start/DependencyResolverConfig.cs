using System.Web.Http;
using EventFeedback.Domain;
using Microsoft.Practices.Unity;

namespace EventFeedback.Web
{
    public static class DependencyResolverConfig
    {
        public static void Setup()
        {
            var container = BuildUnityContainer();

            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            return container
                //.RegisterType<IUserStore<User>, UserStore<User>>()
                //.RegisterType<IRoleStore<IdentityRole>, RoleStore<IdentityRole>>()
                //.RegisterType<UserManager<User>, UserManager<User>>()
                //.RegisterType<RoleManager<IdentityRole>, RoleManager<IdentityRole>>()
                .RegisterType<DataContext, DataContext>()
                .RegisterType<UserService, UserService>()
                .RegisterType<BasicAuthenticationHandler, BasicAuthenticationHandler>();

        }
    }
}