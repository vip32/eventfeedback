using System.Data.Entity;
using System.Diagnostics;
using System.Reflection;
using EventFeedback.Domain.Membership;

namespace EventFeedback.Domain
{
    public class DataContext : DbContext
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public DataContext()
        {
            //_traceSource.TraceInformation("datacontext ctor ");    
        }

        public DbSet<ResourceText> ResourceTexts { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionFeedback> SessionFeedbacks { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
    }
}
