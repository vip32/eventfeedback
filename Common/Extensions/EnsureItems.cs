using System.Collections.Generic;
using System.Linq;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static ICollection<TSource> EnsureItems<TSource>(this ICollection<TSource> source, int count)
        {
            if (source != null)
            {
                for (var i = source.Count(); i <= count; i++)
                {
                    source.Add(default(TSource));
                }
            }
            return source;
        }
    }
}
