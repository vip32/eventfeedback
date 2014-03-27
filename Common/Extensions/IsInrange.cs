using System;

namespace EventFeedback.Common
{
    public static class IsInrange
    {
        public static bool IsInRange(this DateTime currentDate, DateTime? beginDate, DateTime? endDate)
        {
            if (beginDate == null) beginDate = DateTime.MinValue;
            if (endDate == null) endDate = DateTime.MaxValue;

            return (currentDate >= beginDate && currentDate <= endDate);
        }
    }
}
