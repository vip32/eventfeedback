using System;
using System.Collections.Generic;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static void ForEach<T>(this IEnumerable<T> enumeration, Action<T> action)
        {
            if (enumeration == null) throw new ArgumentNullException("enumeration");
            foreach (T item in enumeration)
            {
                if (action != null) action(item);
            }
        }
    }
}
