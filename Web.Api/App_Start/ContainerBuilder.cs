using System;
using System.Data.Entity;
using System.Web;
using EventFeedback.Domain;
using EventFeedback.Domain.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Practices.Unity;

namespace EventFeedback.Web.Api
{
    public static class ContainerBuilder
    {
        public static IUnityContainer Build()
        {
            var container = new UnityContainer();

            return container
                .RegisterType<DataContext, DataContext>()

                .RegisterType<UserManager<User, Guid>, UserManager<User, Guid>>(
                    new InjectionConstructor(
                            typeof(UserStore<User, Role, Guid, UserLogin, UserRole, UserClaim>)))
                .RegisterType<UserStore<User, Role, Guid, UserLogin, UserRole, UserClaim>, UserStore<User, Role, Guid, UserLogin, UserRole, UserClaim>>(
                    new InjectionConstructor(typeof(DataContext)))

                .RegisterType<RoleManager<Role, Guid>, RoleManager<Role, Guid>>(
                    new InjectionConstructor(
                            typeof(RoleStore<Role, Guid, UserRole>)))
                .RegisterType<RoleStore<Role, Guid, UserRole>, RoleStore<Role, Guid, UserRole>>(
                    new InjectionConstructor(typeof(DataContext)))


                .RegisterType<UserService, UserService>(
                    new InjectionConstructor(
                        typeof(DataContext),
                        typeof(UserManager<User, Guid>),
                        typeof(RoleManager<Role, Guid>)))

                .RegisterType<HttpContext>(
                    new InjectionFactory(c => HttpContext.Current));
        }
    }
}