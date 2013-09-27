namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static string ToSafeSqlString(this string value)
        {
            if (!string.IsNullOrEmpty(value)) 
                return value.Replace("'", "").Replace("--", "").Replace(";", "");
            return value;
        }
    }
}
