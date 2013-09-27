using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EventFeedback.Common
{
    /// <summary>
    /// Extensions class.
    /// </summary>
    public static partial class Extensions
    {
        /// <summary>
        /// Gets the first element of a sequence and performs the function on it to return TResult
        /// </summary>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <typeparam name="TResult">The type of the result.</typeparam>
        /// <param name="sources">The sources.</param>
        /// <param name="func">The func.</param>
        /// <returns></returns>
//        public static TResult FirstOrDefaultValue<TSource, TResult>(this IEnumerable<TSource> sources,
//                                                                    Func<TSource, TResult> func) where TSource : class
//        {
//            var source = sources.NullToEmpty().FirstOrDefault();
//            return source != null
//                       ? func(source)
//                       : default(TResult);
//        }

        public static TResult FirstOrDefaultValue<TSource, TResult>(this IEnumerable<TSource> sources,
                                                                    Func<TSource, bool> func,
                                                                    TResult val) where TSource : class
        {
            var source = sources.NullToEmpty().FirstOrDefault(func);
            return source == null ? val
                       : default(TResult);
        }
    }
}
