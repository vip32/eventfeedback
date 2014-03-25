using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Diagnostics;
using System.Reflection;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain.Identity
{
    public class IdentityDataContext : IdentityDbContext<User, Role, Guid, UserLogin, UserRole, UserClaim>
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        protected IdentityDataContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Properties<Guid>()
                .Where(info => info.Name.ToLower() == "id")
                .Configure(
                    configuration => configuration.HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity));

            modelBuilder.Entity<User>()
                .ToTable("Users");
            modelBuilder.Entity<Role>()
                .ToTable("Roles");
            modelBuilder.Entity<UserRole>()
                .ToTable("UserRoles")
                .HasKey(x => new
                {
                    x.RoleId, x.UserId
                });
            modelBuilder.Entity<UserLogin>()
                .ToTable("UserLogins")
                .HasKey(x => new
                {
                    x.UserId, x.ProviderKey, x.LoginProvider
                });
            modelBuilder.Entity<UserClaim>()
                .ToTable("UserClaims");
        }
    }
}