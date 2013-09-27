using System.Collections.Generic;
using System.Text;

namespace EventFeedback.Common
{
    public  static partial class Extensions
    {

        /// <summary>
        /// Concatenates a specified separator String between each element of a specified enumeration, yielding a single concatenated string.
        /// </summary>
        /// <typeparam name="T">any object</typeparam>
        /// <param name="list">The enumeration</param>
        /// <param name="separator">A String</param>
        /// <returns>A String consisting of the elements of value interspersed with the separator string.</returns>
        public static string ToString<T>(this IEnumerable<T> list, string separator)
        {
            var sb = new StringBuilder();
            foreach (var obj in list)
            {
                if (sb.Length > 0)
                {
                    sb.Append(separator);
                }
                sb.Append(obj);
            }
            return sb.ToString();
        }
    }
}
