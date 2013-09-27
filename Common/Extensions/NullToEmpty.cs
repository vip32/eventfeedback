using System.Collections.Generic;
using System.Linq;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        /// <summary>
        /// Converts an null list to an empty list. avoids null ref exceptions
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public static IEnumerable<TSource> NullToEmpty<TSource>(this IEnumerable<TSource> source)
        {
            return source ?? Enumerable.Empty<TSource>();
        }

        public static string NullToEmpty(this string source)
        {
            if (source == null) return string.Empty;
            return source;
        }

        public static IEnumerable<TSource> NullToSingle<TSource>(this IEnumerable<TSource> source, TSource nullObject) where TSource : class
        {
            return source ?? new List<TSource> { nullObject };
        }

    }
}
