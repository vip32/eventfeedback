using System.Text.RegularExpressions;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static bool Match(this string value, string pattern)
        {
            var regex = new Regex(pattern);
            return regex.IsMatch(value);
        }
    }
}
