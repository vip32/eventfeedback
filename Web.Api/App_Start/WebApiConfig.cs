using System.Web.Http;
using EventFeedback.Common;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;

namespace EventFeedback.Web.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Initialize the dependency resolver
            config.DependencyResolver =
                new Unity.WebApi.UnityDependencyResolver(ContainerBuilder.Build());

            config.EnableCors();
            config.EnableSystemDiagnosticsTracing();

            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(new OAuthBearerAuthenticationOptions().AuthenticationType));

            //config.Filters.Add(new HandleErrorAttribute());

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "EventFeedbacksApi",
                routeTemplate: "api/v1/events/{eventId}/feedbacks/{id}",
                defaults: new { controller = "feedbacks", id = RouteParameter.Optional }
                //constraints: new { id = @"^\d+$"}
                );

            config.Routes.MapHttpRoute(
                name: "SessionFeedbacksApi",
                routeTemplate: "api/v1/events/{eventId}/sessions/{sessionId}/feedbacks/{id}",
                defaults: new { controller = "feedbacks", id = RouteParameter.Optional }
                //constraints: new { id = @"^\d+$"}
                );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

            //config.EnableSystemDiagnosticsTracing();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Default; // Default=use the ASP.NET customErrors setting (On/Off/RemoteOnly)
            //config.Services.Replace(typeof(ITraceWriter), new TraceSourceWriter());
            //TraceSource.TraceData(TraceEventType.Information, 0, config.Routes.Dump());
            config.MessageHandlers.Add(new RequireHttpsHandler());

            config.Filters.Add(new ValidationActionFilter());
            config.Filters.Add(new ActivityTraceFilterAttribute());
            config.Filters.Add(new ExceptionHandlingAttribute());
            config.Filters.Add(new NullFilter());

            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

        }
    }
}