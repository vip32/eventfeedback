using System;
using System.Diagnostics;

namespace EventFeedback.Common
{
    /// <summary>
    /// Represents a Trace Start/Stop where the Start and Stop are called automatically
    /// </summary>
    public class TraceLogicalScope : IDisposable
    {
        /// <summary>
        /// The source that we are tracing through as part of this scope
        /// </summary>
        private readonly TraceSource _traceSource;

        /// <summary>
        /// The name of the logical block that this scope represents
        /// </summary>
        private readonly string _logicalName;

        /// <summary>
        /// Constructor used to initialize the class
        /// </summary>
        /// <param name="traceSource">The source that we are tracing through as part of this scope</param>
        /// <param name="logicalName">The name of the logical block that this scope represents</param>
        public TraceLogicalScope(TraceSource traceSource, string logicalName)
        {
            if (traceSource == null)
            {
                throw new ArgumentNullException("traceSource");
            }

            if (string.IsNullOrEmpty(logicalName))
            {
                throw new ArgumentNullException("logicalName");
            }

            _traceSource = traceSource;
            _logicalName = logicalName;

            //if (Trace.CorrelationManager.ActivityId.Equals(Guid.Empty))
            //    Trace.CorrelationManager.ActivityId = Guid.NewGuid();

            _traceSource.TraceEvent(TraceEventType.Start, 0, "Starting {0}", _logicalName);
        }

        /// <summary>
        /// Called when the object is cleaned up, to close the scope
        /// </summary>
        public void Dispose()
        {
            _traceSource.TraceEvent(TraceEventType.Stop, 0, "Finished {0}", _logicalName);
        }
    }

}
