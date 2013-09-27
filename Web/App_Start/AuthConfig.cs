using System;
using System.Diagnostics;
using System.Reflection;
using System.Web.Http;
using EventFeedback.Common;

namespace EventFeedback.Web
{
    public static class AuthConfig
    {
        private static readonly TraceSource TraceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public static void Register(HttpConfiguration config)
        {
            Guard.Against<ArgumentNullException>(config == null, "config");

            var handler = (BasicAuthenticationHandler)config.DependencyResolver.GetService(typeof(BasicAuthenticationHandler));
            if (handler == null) throw new ArgumentNullException("handler");
            config.MessageHandlers.Add(handler);
        }
    }
}