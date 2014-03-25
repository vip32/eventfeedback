using System;
using System.Data.Entity;
using System.Linq;

namespace EventFeedback.Domain.Identity
{
    public static class DataContextExtensions
    {
        //public static User Find(this IDbSet<User> source, string id)
        //{
        //    return source.FirstOrDefault(u => u.Id.Equals(id));
        //}

        public static bool Has(this IDbSet<User> source, string id)
        {
            return source.Any(u => u.Id.Equals(id));
        }

        //public static bool Has(this IDbSet<User> source, int id)
        //{
        //    return source.Any(u => u.Id == id);
        //}

        //public static bool Has(this IDbSet<User> source, Guid id)
        //{
        //    return source.Any(u => u.Id.Equals(id));
        //}

        //public static T Find<T>(this IDbSet<T> source, Func<T, object> func, object id) where T : class
        //{
        //    return source.FirstOrDefault(o => func(o).Equals(id));
        //}

        //public static bool Has<T>(this IDbSet<T> source, Func<T, object> func, object id) where T : class
        //{
        //    return source.Any(o => func(o) == id);
        //}
    }
}