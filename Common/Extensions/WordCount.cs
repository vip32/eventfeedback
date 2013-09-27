using System.Text;
using System.Text.RegularExpressions;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        /// <summary>
        /// Count all words in a given string
        /// </summary>
        /// <param name="str">string to begin with</param>
        /// <returns>int</returns>
        public static int WordCount(this string str)
        {
            var count = 0;
            // Exclude whitespaces, Tabs and line breaks
            var re = new Regex(@"[^\s]+");
            var matches = re.Matches(str);
            count = matches.Count;
            return count;
        }
    }
}
