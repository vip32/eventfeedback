using System.Web.Http;
using EventFeedback.Domain;
using EventFeedback.Domain.Membership;
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
                .RegisterType<MembershipService, MembershipService>()
                .RegisterType<DataContext, DataContext>();
        }
    }
}