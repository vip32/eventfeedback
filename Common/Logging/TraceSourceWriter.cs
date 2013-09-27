using System;
using System.Diagnostics;
using System.Net.Http;
using System.Reflection;
using System.Web.Http.Tracing;
using TraceLevel = System.Web.Http.Tracing.TraceLevel;

namespace EventFeedback.Common
{
    public class TraceSourceWriter : ITraceWriter
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public void Trace(HttpRequestMessage request, string category, TraceLevel level, Action<TraceRecord> traceAction)
        {
            var rec = new TraceRecord(request, category, level);
            traceAction(rec);
            WriteTrace(rec);
        }

        protected void WriteTrace(TraceRecord record)
        {
            var message = string.Format("{0};{1};{2}", record.Operator, record.Operation, record.Message);
            //System.Diagnostics.Trace.WriteLine(message, record.Category);
            System.Diagnostics.Trace.WriteLine(message, record.Category);

            switch (record.Level)
            {
                case TraceLevel.Error:
                    _traceSource.TraceEvent(TraceEventType.Error, 0, message);
                    break;
                case TraceLevel.Fatal:
                    _traceSource.TraceEvent(TraceEventType.Critical, 0, message);
                    break;
                case TraceLevel.Warn:
                    _traceSource.TraceEvent(TraceEventType.Warning, 0, message);
                    break;
                default:
                    _traceSource.TraceEvent(TraceEventType.Information, 0, message); //record.Request
                    break;
            }
        }
    }
}

