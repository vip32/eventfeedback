using System;

namespace EventFeedback.Common
{
    /// <summary>
    /// Utility methods to guard method parameters and local variables.
    /// </summary>
    public class Guard
    {
        /// <summary>
        /// Throws an exception of type <typeparamref name="TException"/> with the specified message
        /// when the assertion statement is true.
        /// </summary> 
        /// <typeparam name="TException">The type of exception to throw.</typeparam>
        /// <param name="assertion">The assertion to evaluate. If true then the <typeparamref name="TException"/> exception is thrown.</param>
        /// <param name="message">string. The exception message to throw.</param>
        public static void Against<TException>(bool assertion, string message) where TException : Exception
        {
            if (assertion) 
            {
                throw (TException)Activator.CreateInstance(typeof(TException), message);  
            }
        }

        /// <summary>
        /// Throws an exception of type <typeparamref name="TException"/> with the specified message
        /// when the assertion
        /// </summary>
        /// <typeparam name="TException"></typeparam>
        /// <param name="assertion"></param>
        /// <param name="message"></param>
        public static void Against<TException>(Func<bool> assertion, string message) where TException : Exception
        {
            Against<TException>(assertion(), message);
        }
    }
}
