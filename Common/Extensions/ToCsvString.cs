using System.Text;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        /// <summary>
        /// Converts the value to a CSV valid value
        /// http://www.creativyst.com/Doc/Articles/CSV/CSV01.htm
        /// </summary>
        /// <param name="value">The value to convert.</param>
        /// <returns>a csv valid value</returns>
        public static string ToCsvString(this string value)
        {
            
            if (value.IndexOfAny(",\n".ToCharArray()) < 0 && value.Trim() == value)
                return value;

            var sb = new StringBuilder();
            sb.Append('"');
            foreach (var c in value)
            {
                sb.Append(c);
                if (c == '"')
                    sb.Append(c);
            }
            sb.Append('"');
            return sb.ToString();
        }
    }
}
