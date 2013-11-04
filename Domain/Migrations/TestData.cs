using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain
{
    public static class TestData
    {
        private static readonly TraceSource TraceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name); 

        public static async void Seed(DataContext context)
        {
            TraceSource.TraceInformation("seeding database");

            if (!context.Users.Any())
            {
                var userService = new UserService(context);
                userService.CreateUser(
                    new User
                    {
                        UserName = "admin",
                        Organization = "acme",
                        Email = "admin@acme.com"
                    }, " adminadmin");
                userService.CreateUser(
                    new User
                    {
                        UserName = "user1",
                        Organization = "acme",
                        Email = "user1@acme.com"
                    }, " user1user1");
                userService.CreateUser(
                    new User
                    {
                        UserName = "user2",
                        Organization = "acme",
                        Email = "user2@acme.com"
                    }, " user2user2");
            }

            //userManager.AddToRoleAsync(adminUser.Id, "Administrator");
            //if (!result.Succeeded)
            //{
            //    throw new ApplicationException(result.Errors.First());
            //}
            //var userProfiles = new List<UserProfile>
            //{
            //    new UserProfile
            //    {
            //        UserName = "admin", // 1
            //        Active = true
            //    },
            //    new UserProfile
            //    {
            //        UserName = "user1", // 2
            //        Active = true
            //    },
            //    new UserProfile
            //    {
            //        UserName = "user2", // 3
            //        Active = true
            //    }
            //};

            //context.UserProfiles.AddOrUpdate(
            //    p => p.UserName,
            //    userProfiles.ToArray()
            //    );

            //var roles = new List<Role>
            //{
            //    new Role
            //    {
            //        Active = true,
            //        RoleName = "Administrator"
            //    }
            //};
            //context.Roles.AddOrUpdate(
            //    p => p.RoleName,
            //    roles.ToArray()
            //    );
            //context.SaveChanges();
            //context.Users.AddOrUpdate(
            //    p => p.Id,
            //    new User
            //    {
            //        Id = context.Entry(userProfiles.First()).Entity.Id, // admin
            //        CreateDate = DateTime.Now,
            //        Password = "AFnDVLa9SaoEG+1HlylxQqpoWJ0Jm3cAfvkYnPONo34UMd/n4C/WV/u6zBqrCh5SCQ==", // admin
            //        IsConfirmed = true,
            //        PasswordFailuresSinceLastSuccess = 0,
            //    },
            //    new User
            //    {
            //        Id = context.Entry(userProfiles.Skip(1).Take(1).First()).Entity.Id, // user
            //        CreateDate = DateTime.Now,
            //        Password = "AFnDVLa9SaoEG+1HlylxQqpoWJ0Jm3cAfvkYnPONo34UMd/n4C/WV/u6zBqrCh5SCQ==", // admin
            //        IsConfirmed = true,
            //        PasswordFailuresSinceLastSuccess = 0
            //    }
            //    );
            //if (!context.UserRoles.Any())
            //{
            //    context.UserRoles.AddOrUpdate(p => p.UserId,
            //        new UserRole
            //        {
            //            UserId = context.Entry(userProfiles.First()).Entity.Id, // admin
            //            RoleId = context.Entry(roles.First()).Entity.Id, // Administrator
            //        }); // admin Administrator role
            //}

            if (!context.ResourceTexts.Any())
            {
                context.ResourceTexts.AddOrUpdate(
                    p => p.Key,
                    new ResourceText { Key = "Title_Home", Value = "Home", Language = "en-US" },
                    new ResourceText { Key = "Title_About", Value = "About", Language = "en-US" },
                    new ResourceText { Key = "Title_Events", Value = "Events", Language = "en-US" },
                    new ResourceText { Key = "Title_Sessions", Value = "Sessions", Language = "en-US" },
                    new ResourceText { Key = "Title_SignIn", Value = "Sign-in", Language = "en-US" },
                    new ResourceText { Key = "Title_Debug", Value = "Debug", Language = "en-US" },
                    new ResourceText { Key = "Title_Home", Value = "Home", Language = "de-DE" },
                    new ResourceText { Key = "Title_About", Value = "Über", Language = "de-DE" },
                    new ResourceText { Key = "Title_Events", Value = "Veranstaltungen", Language = "de-DE" },
                    new ResourceText { Key = "Title_Sessions", Value = "Sessions", Language = "de-DE" },
                    new ResourceText { Key = "Title_SignIn", Value = "Einloggen", Language = "de-DE" },
                    new ResourceText { Key = "Title_Debug", Value = "Debug", Language = "de-DE" },
                    new ResourceText { Key = "Question1_Title", Value = "Vortragsstil", Language = "de-DE" },
                    new ResourceText
                    {
                        Key = "Question1_Description",
                        Value = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten",
                        Language = "de-DE"
                    },
                    new ResourceText { Key = "Question2_Title", Value = "Folien", Language = "de-DE" },
                    new ResourceText
                    {
                        Key = "Question2_Description",
                        Value = "Dein Kommentar zu den Folien",
                        Language = "de-DE"
                    },
                    new ResourceText { Key = "Question3_Title", Value = "Transport von Inhalten", Language = "de-DE" },
                    new ResourceText { Key = "Question3_Description", Value = "", Language = "de-DE" },
                    new ResourceText { Key = "Question4_Title", Value = "Business-Relevanz", Language = "de-DE" },
                    new ResourceText
                    {
                        Key = "Question4_Description",
                        Value = "Dein Kommentar zum Business-Relevanz",
                        Language = "de-DE"
                    },
                    new ResourceText
                    {
                        Key = "Question5_Title",
                        Value = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten",
                        Language = "de-DE"
                    },
                    new ResourceText
                    {
                        Key = "Question6_Title",
                        Value = "Dein Kommentar zu den Folien",
                        Language = "de-DE"
                    },
                    new ResourceText { Key = "Question7_Title", Value = "Dein Kommentar zum Thema", Language = "de-DE" }
                    );
            }

            var events = new List<Event>
            {
                new Event
                {
                    Title = "2013 ET 1",
                    StartDate = new DateTime(2013, 2, 18),
                    EndDate = new DateTime(2013, 2, 18),
                    Location = "Mannheim",
                    Description =
                        "Hast Du Ideen für neue Themen? Unter http://www/portfolio/Segmente/Loesungen/ Entwicklertag kannst du diese erfassen und gleich angeben, ob du das Thema selbst präsentieren möchtest.",
                    //Feedbacks = new Collection<Feedback>
                    //                        {
                    //                            new Feedback {UserId = 1, Description0 = "event feedback1"},
                    //                            new Feedback {UserId = 2, Description0 = "event feedback2"}
                    //                        },
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
                                //Feedbacks = new Collection<Feedback>
                                //    {
                                //        new Feedback {UserId = 1},
                                //        new Feedback {UserId = 2},
                                //    }
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
                    Description =
                        "Hast Du Ideen für neue Themen? Unter http://www/portfolio/Segmente/Loesungen/ Entwicklertag kannst du diese erfassen und gleich angeben, ob du das Thema selbst präsentieren möchtest.",
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
                    Description =
                        "Hast Du Ideen für neue Themen? Unter http://www/portfolio/Segmente/Loesungen/ Entwicklertag kannst du diese erfassen und gleich angeben, ob du das Thema selbst präsentieren möchtest.",
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
                    Description =
                        "Hast Du Ideen für neue Themen? Unter http://www/portfolio/Segmente/Loesungen/ Entwicklertag kannst du diese erfassen und gleich angeben, ob du das Thema selbst präsentieren möchtest.",
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
            };

            context.Events.AddOrUpdate(
                p => p.Title,
                events.ToArray()
                );


            //if (!context.UserRoles.Any())
            //{
            //    context.SaveChanges();

            //    var eventFeedbacks = new List<Feedback>
            //    {
            //        new Feedback
            //        {
            //            EventId = context.Entry(events.First()).Entity.Id,
            //            UserId = context.Entry(userProfiles.First()).Entity.Id
            //        }
            //    };

            //    //context.Feedbacks.AddOrUpdate(
            //    //    p => p.Title,
            //    //        events.ToArray()
            //    //    );
            //}
        }
    }
}
