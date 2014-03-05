using System;
using System.Diagnostics;
using System.Globalization;

namespace EventFeedback.Common
{
    /// <summary>
    /// Represents a Trace Transfer scope within which tracing Transfers to and from another Activity
    /// </summary>
    public class TraceTransferScope : IDisposable
    {
        /// <summary>
        /// The activity ID that we stitched away from when this scope was started
        /// </summary>
        private readonly Guid _oldActivityId;

        /// <summary>
        /// The activity ID that we stitched to when this scope was started
        /// </summary>
        private readonly Guid _newActivityId;

        /// <summary>
        /// The source that we are tracing through as part of this scope
        /// </summary>
        private readonly TraceSource _traceSource;

        /// <summary>
        /// The name of the activity that this scope represents
        /// </summary>
        private readonly string _activityName;

        /// <summary>
        /// Constructor used to initialize the class
        /// </summary>
        /// <param name="traceSource">The source that we are tracing through as part of this scope</param>
        /// <param name="activityName">The name of the activity that this scope represents</param>
        public TraceTransferScope(TraceSource traceSource, string activityName)
        {
            if (traceSource == null)
            {
                throw new ArgumentNullException("traceSource");
            }

            if (string.IsNullOrEmpty(activityName))
            {
                throw new ArgumentNullException("activityName");
            }

            _traceSource = traceSource;
            _oldActivityId = Trace.CorrelationManager.ActivityId;
            _activityName = activityName;

            _newActivityId = Guid.NewGuid();

            if (_oldActivityId != Guid.Empty)
            {
                // transfer to activity
                _traceSource.TraceTransfer(0, string.Format(CultureInfo.CurrentCulture, "TRANSFER ==> {0} ===", _activityName), _newActivityId);
            }
            Trace.CorrelationManager.ActivityId = _newActivityId;

            _traceSource.Start(_activityName);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Called when the object is cleaned up, to close the scope
        /// </summary>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposing) return;
            if (_oldActivityId != Guid.Empty)
            {
                // transfer back from activity
                _traceSource.TraceTransfer(0, 
                    string.Format(CultureInfo.CurrentCulture, "TRANSFER <== {0} ===", _activityName), _oldActivityId);
            }

            _traceSource.Stop(_activityName);

            Trace.CorrelationManager.ActivityId = _oldActivityId;
        }
    }
}
