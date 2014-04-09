using System.Web.Script.Serialization;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        /// <summary>
        /// Serializes the object to JSON.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <returns></returns>
        public static string ToJSON(this object obj)
        {
            if (obj == null) return null;
            var serializer = new JavaScriptSerializer();
            return serializer.Serialize(obj);
        }
    }
}
