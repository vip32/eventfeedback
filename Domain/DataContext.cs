using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Diagnostics;
using System.Reflection;
using EventFeedback.Domain.Identity;

namespace EventFeedback.Domain
{
    public class DataContext : IdentityDataContext
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public DataContext()
            : base("DefaultConnection")
        { }

        public DbSet<ResourceText> ResourceTexts { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackDefinition> FeedbackDefinitions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Properties<Guid>()
                .Where(info => info.Name.ToLower() == "id")
                .Configure(configuration => 
                    configuration.HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity));
        }

        //public ObjectContext ObjectContext()
        //{
        //    var contextAdapter = this as IObjectContextAdapter;
        //    if (contextAdapter != null) return contextAdapter.ObjectContext;
        //    throw new ArgumentException(
        //        "Context does not implement IObjectContextAdapter, cannot provide ObjectContext.");
        //}

        //public override int SaveChanges()
        //{
        //    ChangeTracker.DetectChanges();

        //    foreach (var insert in ObjectContext().ObjectStateManager.GetObjectStateEntries(EntityState.Added)){
        //        if (insert.Entity.GetType().GetProperty("CreateDate") != null)
        //            insert.Entity.GetType().GetProperty("CreateDate").SetValue(insert.Entity, DateTime.UtcNow, null);
        //        if (insert.Entity.GetType().GetProperty("ModifyDate") != null)
        //            insert.Entity.GetType().GetProperty("ModifyDate").SetValue(insert.Entity, DateTime.UtcNow, null);
        //    }
        //    foreach (var update in ObjectContext().ObjectStateManager.GetObjectStateEntries(EntityState.Modified))
        //    {
        //        if (update.Entity.GetType().GetProperty("ModifyDate") != null)
        //            update.Entity.GetType().GetProperty("ModifyDate").SetValue(update.Entity, DateTime.UtcNow, null);
        //    }
        //    foreach (var delete in ObjectContext().ObjectStateManager.GetObjectStateEntries(EntityState.Deleted))
        //    {
        //        if (delete.Entity.GetType().GetProperty("DeleteDate") != null)
        //            delete.Entity.GetType().GetProperty("DeleteDate").SetValue(delete.Entity, DateTime.UtcNow, null);
        //    }
        //    return base.SaveChanges();
        //}
    }
}