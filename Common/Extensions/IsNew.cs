using System;

namespace EventFeedback.Common
{
    public static partial class Extensions
    {
        public static bool IsNew(this Guid source)
        {
            return source.Equals(Guid.NewGuid());
        }
    }
}
