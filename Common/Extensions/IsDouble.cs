namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static bool IsDouble(this string value)
        {
            double result;
            return double.TryParse(value, out result);
        }
    }
}
