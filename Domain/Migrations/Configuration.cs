using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Reflection;
using EventFeedback.Domain.Membership;
using System.Linq;

namespace EventFeedback.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<DataContext>
    {
        private readonly TraceSource _traceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            AutomaticMigrationDataLossAllowed = false;
        }

        /// <summary>
        /// Seeds the specified context.
        /// This method will be called after migrating to the latest version.
        /// </summary>
        /// <param name="context">The context.</param>
        protected override void Seed(DataContext context)
        {
            _traceSource.TraceInformation("seeding database");

            context.UserProfiles.AddOrUpdate(
                p => p.UserName,
                new UserProfile
                    {
                        UserName = "admin", // 1
                        Active = true
                    },
                new UserProfile
                    {
                        UserName = "user", // 2
                        Active = true
                    });
            context.Users.AddOrUpdate(
                p => p.Id,
                new User
                    {
                        Id = 1, // admin
                        CreateDate = DateTime.Now,
                        Password = "AFnDVLa9SaoEG+1HlylxQqpoWJ0Jm3cAfvkYnPONo34UMd/n4C/WV/u6zBqrCh5SCQ==", // admin
                        IsConfirmed = true,
                        PasswordFailuresSinceLastSuccess = 0,
                        Roles = new Collection<Role>
                            {
                                new Role
                                    {
                                        Active = true,
                                        RoleName = "Administrator"
                                    }
                            }
                    },
                new User
                    {
                        Id = 2, // user
                        CreateDate = DateTime.Now,
                        Password = "AFnDVLa9SaoEG+1HlylxQqpoWJ0Jm3cAfvkYnPONo34UMd/n4C/WV/u6zBqrCh5SCQ==", // admin
                        IsConfirmed = true,
                        PasswordFailuresSinceLastSuccess = 0
                    });
            context.UserRoles.AddOrUpdate(p => p.UserId, new UserRole{UserId = 1, RoleId = 1}); // admin Administrator role

            if(!context.ResourceTexts.Any())
            {
                context.ResourceTexts.AddOrUpdate(
                    p => p.Key,
                    new ResourceText {Key = "TestKey1", Value = "Value1", Language = "en-US"},
                    new ResourceText {Key = "TestKey2", Value = "Value2", Language = "en-US"},
                    new ResourceText {Key = "Title_Home", Value = "Home", Language = "en-US"},
                    new ResourceText {Key = "Title_About", Value = "About", Language = "en-US"},
                    new ResourceText {Key = "Title_Events", Value = "Events", Language = "en-US"},
                    new ResourceText {Key = "Title_Sessions", Value = "Sessions", Language = "en-US"},
                    new ResourceText {Key = "Title_SignIn", Value = "Sign-in", Language = "en-US"},
                    new ResourceText {Key = "Title_Debug", Value = "Debug", Language = "en-US"},
                    new ResourceText {Key = "Title_Home", Value = "Heim", Language = "de-DE"},
                    new ResourceText {Key = "Title_About", Value = "Über", Language = "de-DE"},
                    new ResourceText {Key = "Title_Events", Value = "Veranstaltungen", Language = "de-DE"},
                    new ResourceText {Key = "Title_Sessions", Value = "Sessionen", Language = "de-DE"},
                    new ResourceText {Key = "Title_SignIn", Value = "Einloggen", Language = "de-DE"},
                    new ResourceText { Key = "Title_Debug", Value = "Debug", Language = "de-DE" },
                    new ResourceText { Key = "Question1_Title", Value = "Vortragsstil", Language = "de-DE" },
                    new ResourceText { Key = "Question1_Description", Value = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten", Language = "de-DE" },
                    new ResourceText { Key = "Question2_Title", Value = "Folien", Language = "de-DE" },
                    new ResourceText { Key = "Question2_Description", Value = "Dein Kommentar zu den Folien", Language = "de-DE" },
                    new ResourceText { Key = "Question3_Title", Value = "Transport von Inhalten", Language = "de-DE" },
                    new ResourceText {Key = "Question3_Description", Value = "", Language = "de-DE"},

                    new ResourceText { Key = "Question4_Title", Value = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten", Language = "de-DE" },
                    new ResourceText { Key = "Question5_Title", Value = "Dein Kommentar zu den Folien", Language = "de-DE" },
                    new ResourceText { Key = "Question6_Title", Value = "Dein Kommentar zum Thema", Language = "de-DE" }
                    );
            }

            context.Events.AddOrUpdate(
                p => p.Title,
                new Event
                    {
                        Title = "2013 ET 1",
                        StartDate = new DateTime(2013, 2, 18),
                        EndDate = new DateTime(2013, 2, 18),
                        Location = "Mannheim",
                        Sessions =
                            new Collection<Session>
                                {
                                    new Session
                                        {
                                            Title = "Keynote ET1",
                                            StartDate = new DateTime(2013, 2, 18, 9, 0, 0),
                                            EndDate = new DateTime(2013, 2, 18, 11, 30, 0),
                                            TagList = "C#;Java",
                                            SpeakerList = "Speaker1;Speaker2",
                                            Feedback = new Collection<SessionFeedback>
                                                {
                                                    new SessionFeedback {UserId = 1},
                                                    new SessionFeedback {UserId = 2},
                                                }
                                        },
                                    new Session
                                        {
                                            Title = "Session1 ET1",
                                            StartDate = new DateTime(2013, 2, 18, 11, 30, 0),
                                            EndDate = new DateTime(2013, 2, 18, 12, 30, 0),
                                            TagList = "C#",
                                            SpeakerList = "Speaker1",
                                        },
                                    new Session
                                        {
                                            Title = "Session2 ET1",
                                            StartDate = new DateTime(2013, 2, 18, 13, 0, 0),
                                            EndDate = new DateTime(2013, 2, 18, 14, 30, 0),
                                            TagList = "Java",
                                            SpeakerList = "Speaker1",
                                        }
                                }
                    },
                new Event
                    {
                        Title = "2013 ET 2",
                        StartDate = new DateTime(2013, 5, 10),
                        EndDate = new DateTime(2013, 5, 10),
                        Location = "Mannheim",
                        Sessions =
                            new Collection<Session>
                                {
                                    new Session
                                        {
                                            Title = "Keynote",
                                            StartDate = new DateTime(2013, 5, 10, 9, 0, 0),
                                            EndDate = new DateTime(2013, 5, 10, 11, 30, 0),
                                            TagList = "C#;Java",
                                            SpeakerList = "Speaker1;Speaker2",
                                        },
                                    new Session
                                        {
                                            Title = "Session1 ET2",
                                            StartDate = new DateTime(2013, 5, 10, 11, 30, 0),
                                            EndDate = new DateTime(2013, 5, 10, 12, 30, 0),
                                            TagList = "C#",
                                            SpeakerList = "Speaker1",
                                        },
                                    new Session
                                        {
                                            Title = "Session2 ET2",
                                            StartDate = new DateTime(2013, 5, 10, 13, 0, 0),
                                            EndDate = new DateTime(2013, 5, 10, 14, 30, 0),
                                            TagList = "Java",
                                            SpeakerList = "Speaker1",
                                        }
                                }
                    },
                new Event
                    {
                        Title = "2013 ET 3",
                        StartDate = new DateTime(2013, 7, 1),
                        EndDate = new DateTime(2013, 7, 1),
                        Location = "Mannheim",
                        Sessions =
                            new Collection<Session>
                                {
                                    new Session
                                        {
                                            Title = "Keynote ET3",
                                            StartDate = new DateTime(2013, 7, 1, 9, 0, 0),
                                            EndDate = new DateTime(2013, 7, 1, 11, 30, 0),
                                            TagList = "C#;Java",
                                            SpeakerList = "Speaker1;Speaker2",
                                        },
                                    new Session
                                        {
                                            Title = "Session1 ET3",
                                            StartDate = new DateTime(2013, 7, 1, 11, 30, 0),
                                            EndDate = new DateTime(2013, 7, 1, 12, 30, 0),
                                            TagList = "C#",
                                            SpeakerList = "Speaker1",
                                        },
                                    new Session
                                        {
                                            Title = "Session2 ET3",
                                            StartDate = new DateTime(2013, 7, 1, 13, 0, 0),
                                            EndDate = new DateTime(2013, 7, 1, 14, 30, 0),
                                            TagList = "Java",
                                            SpeakerList = "Speaker1",
                                        }
                                }
                    },
                new Event
                    {
                        Title = "2013 ET 4",
                        StartDate = new DateTime(2013, 10, 09),
                        EndDate = new DateTime(2013, 10, 09),
                        Location = "Mannheim",
                        Sessions =
                            new Collection<Session>
                                {
                                    new Session
                                        {
                                            Title = "Keynote ET4",
                                            StartDate = new DateTime(2013, 10, 24, 9, 0, 0),
                                            EndDate = new DateTime(2013, 10, 24, 11, 30, 0),
                                            TagList = "C#;Java",
                                            SpeakerList = "Speaker1;Speaker2",
                                        },
                                    new Session
                                        {
                                            Title = "Session1 ET4",
                                            StartDate = new DateTime(2013, 10, 23, 11, 30, 0),
                                            EndDate = new DateTime(2013, 10, 23, 12, 30, 0),
                                            TagList = "C#",
                                            SpeakerList = "Speaker1",
                                        },
                                    new Session
                                        {
                                            Title = "Session2 ET4",
                                            StartDate = new DateTime(2013, 10, 23, 13, 0, 0),
                                            EndDate = new DateTime(2013, 10, 23, 14, 30, 0),
                                            TagList = "Java",
                                            SpeakerList = "Speaker1",
                                        }
                                }
                    }
                );
        }
    }
}
