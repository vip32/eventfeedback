using System;
using System.Collections.Generic;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static IEnumerable<T> Each<T>(this IEnumerable<T> array, Action<T> act)
        {
            foreach (var i in array)
                act(i);
            return array;
        }
    }
}
