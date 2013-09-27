using System.Diagnostics;
using System.Reflection;
using System.Web.Http;
using Newtonsoft.Json.Serialization;
//using ServiceStack.Text;
//using ITraceWriter = System.Web.Http.Tracing.ITraceWriter;
using EventFeedback.Common;

namespace EventFeedback.Web
{
    public static class WebApiConfig
    {
        private static readonly TraceSource TraceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "EventsApi",
                routeTemplate: "api/events/{id}",
                defaults: new { controller = "events", id = RouteParameter.Optional }
                //constraints: new { id = @"^\d+$" }
                );

            config.Routes.MapHttpRoute(
                name: "EventSessionsApi",
                routeTemplate: "api/events/{eventId}/sessions/{id}",
                defaults: new { controller = "sessions", id = RouteParameter.Optional }
                //constraints: new { id = @"^\d+$"}
                );

            config.Routes.MapHttpRoute(
                name: "SessionFeedbacksApi",
                routeTemplate: "api/events/{eventId}/sessions/{sessionId}/feedbacks/{id}",
                defaults: new { controller = "feedbacks", id = RouteParameter.Optional }
                //constraints: new { id = @"^\d+$"}
                );

            config.Routes.MapHttpRoute(
                name: "AdminApi",
                routeTemplate: "api/admin/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional },
                constraints: new
                {
                    controller = new FromValuesListConstraint("eventstatus", "userprofiles", "users")
                    //id = @"^\d+$"
                }
            );

            config.EnableSystemDiagnosticsTracing();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Default; // Default=use the ASP.NET customErrors setting (On/Off/RemoteOnly)
            //config.Services.Replace(typeof(ITraceWriter), new TraceSourceWriter());
            //TraceSource.TraceData(TraceEventType.Information, 0, config.Routes.Dump());
            config.Filters.Add(new ActivityTraceFilterAttribute());
            config.Filters.Add(new ExceptionHandlingAttribute());
            config.Filters.Add(new NullFilter());

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
