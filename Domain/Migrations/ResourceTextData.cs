using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Reflection;

namespace EventFeedback.Domain
{
    public static class ResourceTextData
    {
        private static readonly TraceSource TraceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        /// <summary>
        /// Seeds the specified context.
        /// </summary>
        /// <param name="context">The context.</param>
        public static void Seed(DataContext context)
        {
            TraceSource.TraceInformation("seeding database");

            if (!context.ResourceTexts.Any())
            {
                context.ResourceTexts.AddOrUpdate(
                    p => p.Key,
                    new ResourceText { Key = "Feedback_Saved_Success", Value = "Feedback saved", Language = "en-US" },
                    new ResourceText { Key = "Feedback_Saved_Failed", Value = "Feedback NOT saved", Language = "en-US" },
                    new ResourceText { Key = "Title_Home", Value = "Home", Language = "en-US" },
                    new ResourceText { Key = "Title_About", Value = "About", Language = "en-US" },
                    new ResourceText { Key = "Title_Events", Value = "Events", Language = "en-US" },
                    new ResourceText { Key = "Title_Admin_Users", Value = "Users", Language = "en-US" },
                    new ResourceText { Key = "Title_Sessions", Value = "Sessions", Language = "en-US" },
                    new ResourceText { Key = "Title_SignIn", Value = "Sign-in", Language = "en-US" },
                    new ResourceText { Key = "Title_SignOut", Value = "Sign-out", Language = "en-US" },
                    new ResourceText { Key = "Title_Debug", Value = "Debug", Language = "en-US" },
                    new ResourceText { Key = "Text_Save", Value = "Save", Language = "en-US" },
                    new ResourceText { Key = "Text_Remove", Value = "Remove", Language = "en-US" },
                    new ResourceText { Key = "Text_Report", Value = "Report", Language = "en-US" },
                    new ResourceText { Key = "Text_Edit", Value = "Edit", Language = "en-US" },
                    new ResourceText { Key = "Text_New", Value = "New", Language = "en-US" },
                    new ResourceText { Key = "Home_Text", Value = "Home_Text", Language = "en-US" },

                    new ResourceText { Key = "Feedback_Saved_Success", Value = "Feedback gespeichert", Language = "de-DE" },
                    new ResourceText { Key = "Feedback_Saved_Failed", Value = "Feedback NICHT gespeichert", Language = "de-DE" },
                    new ResourceText { Key = "Title_Home", Value = "Home", Language = "de-DE" },
                    new ResourceText { Key = "Title_About", Value = "Über", Language = "de-DE" },
                    new ResourceText { Key = "Title_Events", Value = "Veranstaltungen", Language = "de-DE" },
                    new ResourceText { Key = "Title_Admin_Users", Value = "Benutzer", Language = "de-DE" },
                    new ResourceText { Key = "Title_Sessions", Value = "Sessions", Language = "de-DE" },
                    new ResourceText { Key = "Title_SignIn", Value = "Einloggen", Language = "de-DE" },
                    new ResourceText { Key = "Title_SignOut", Value = "Ausloggen", Language = "de-DE" },
                    new ResourceText { Key = "Title_Debug", Value = "Debug", Language = "de-DE" },
                    new ResourceText { Key = "Text_Save", Value = "Speichern", Language = "de-DE" },
                    new ResourceText { Key = "Text_Remove", Value = "Löschen", Language = "de-DE" },
                    new ResourceText { Key = "Text_Report", Value = "Report", Language = "de-DE" },
                    new ResourceText { Key = "Text_Edit", Value = "Editieren", Language = "de-DE" },
                    new ResourceText { Key = "Text_New", Value = "Neu", Language = "de-DE" },
                    new ResourceText { Key = "Home_Text", Value = "Die Event|Feedback App ist der Platz für dein Feedback zu unseren Entwicklertagen. Hier kannst du die von dir besuchten Sessions einfach und zeitnah bewerten und so den Speakern wertvolles Feedback liefern. Ein kurzer Kommentar macht deine Bewertung für die Speaker einfacher nachvollziehbar und sehr viel hilfreicher.", Language = "de-DE" }
                    );
            }

            context.SaveChanges();
        }
    }
}
