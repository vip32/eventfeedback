using System.Data.Entity;
using System.Diagnostics;
using System.Reflection;
using EventFeedback.Common;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain
{
    public class DataContext : IdentityDbContext<User>
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public DataContext()
            : base("DefaultConnection")
        {
            //_traceSource.TraceInformation("datacontext ctor ");    
        }

        public DbSet<ResourceText> ResourceTexts { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackDefinition> FeedbackDefinitions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<IdentityUser>()
                .ToTable("Users");
            modelBuilder.Entity<User>()
                .ToTable("Users");
            modelBuilder.Entity<IdentityRole>()
                .ToTable("Roles");
            modelBuilder.Entity<Role>()
                .ToTable("Roles");
        }
    }
}
