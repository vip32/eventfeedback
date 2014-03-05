using System.Diagnostics;

namespace EventFeedback.Common
{
    public static class TraceExtensions
    {
        public static void Info(this TraceSource source, string format, params object[] args)
        {
            source.TraceEvent(TraceEventType.Information, 0, format, args);
        }

        public static void Info(this TraceSource source, params object[] data)
        {
            source.TraceData(TraceEventType.Information, 0, data);
        }

        public static void Verbose(this TraceSource source, string format, params object[] args)
        {
            source.TraceEvent(TraceEventType.Verbose, 0, format, args);
        }

        public static void Verbose(this TraceSource source, params object[] data)
        {
            source.TraceData(TraceEventType.Verbose, 0, data);
        }

        public static void Warn(this TraceSource source, string format, params object[] args)
        {
            source.TraceEvent(TraceEventType.Warning, 0, format, args);
        }

        public static void Warn(this TraceSource source, params object[] data)
        {
            source.TraceData(TraceEventType.Warning, 0, data);
        }

        public static void Error(this TraceSource source, string format, params object[] args)
        {
            source.TraceEvent(TraceEventType.Error, 0, format, args);
        }

        public static void Error(this TraceSource source, params object[] data)
        {
            source.TraceData(TraceEventType.Error, 0, data);
        }
    }
}
