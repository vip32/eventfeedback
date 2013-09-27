using System;
using System.Globalization;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        /// <summary>
        /// Converts an object safely to string or assigns an empty string
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToStringSafe(this Object obj)
        {
            try
            {
                return Convert.ToString(obj, CultureInfo.CurrentCulture);
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Converts an object safely to integer or assigns 0
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static int ToInt(this Object obj)
        {
            if (obj == null) return 0;
            try
            {
                if (obj.GetType() == typeof (int?)) return ((int?) obj).Value;
                if (obj.GetType() == typeof (DBNull)) return 0;
                return Convert.ToInt32(obj, CultureInfo.CurrentCulture);
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// Converts an object safely to bool or assigns false
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static bool ToBool(this Object obj)
        {
            if (obj == null) return false;
            try
            {
                if (obj.GetType() == typeof (bool?)) return ((bool?) obj).Value;
                if (obj.GetType() == typeof (DBNull)) return false;

                if (obj.Equals("0")) return false;
                if (obj.Equals("1")) return true;

                return Convert.ToBoolean(obj, CultureInfo.CurrentCulture);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Converts an object safely to datetime or assigns null
        /// </summary>
        /// <param name="obj">The obj.</param>
        /// <returns></returns>
        public static DateTime? ToDateTime(this Object obj)
        {
            if (obj == null) return null;
            try
            {
                return DateTime.Parse(obj.ToString(), CultureInfo.CurrentCulture);
            }
            catch
            {
                return null;
            }
        }
    }
}
