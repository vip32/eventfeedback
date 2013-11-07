using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Reflection;

namespace EventFeedback.Domain
{
    public static class TestData
    {
        private static readonly TraceSource TraceSource = new TraceSource(Assembly.GetExecutingAssembly().GetName().Name);
        private const string Lorem1 = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
        private static readonly Random Random = new Random();

        public static void Seed(DataContext context)
        {
            TraceSource.TraceInformation("seeding database");

            var users = new List<User>
            {
                new User
                {
                    UserName = "admin",
                    Organization = "acme",
                    Email = "admin@acme.com"
                },
                new User
                {
                    UserName = "user1",
                    Organization = "acme",
                    Email = "user1@acme.com"
                },
                new User
                {
                    UserName = "user2",
                    Organization = "acme",
                    Email = "user2@acme.com"
                },
                new User
                {
                    UserName = "guest1",
                    Organization = "acme",
                    Email = "guest1@acme.com"
                }
            };
            for (var i = 0; i < 100; i++)
            {
                var no = Random.Next(1000, 9999);
                users.Add(new User
                {
                    UserName = "acmeuser" + no,
                    Organization = "acme",
                    Email = string.Format("user{0}@acme.com", no)
                });
            }

            if (!context.Users.Any())
            {
                var userService = new UserService(context);

                userService.CreateRole(new Role { Name = "Administrator"});
                userService.CreateRole(new Role { Name = "User" });
                userService.CreateRole(new Role { Name = "Guest" });

                var user1 = users.FirstOrDefault(u => u.UserName.Equals("admin"));
                userService.CreateUser(user1, "admin");
                var user2 = users.FirstOrDefault(u => u.UserName.Equals("user1"));
                userService.CreateUser(user2, "user");
                var user3 = users.FirstOrDefault(u => u.UserName.Equals("user2"));
                userService.CreateUser(user3, "user");
                var user4 = users.FirstOrDefault(u => u.UserName.Equals("guest1"));
                userService.CreateUser(user4, "guest");

                if (user1 != null)
                {
                    userService.AddUserToRole(user1.Id, "Administrator");
                    userService.AddUserToRole(user1.Id, "User");
                }
                if (user2 != null) userService.AddUserToRole(user2.Id, "User");
                if (user3 != null) userService.AddUserToRole(user3.Id, "User");
                if (user4 != null) userService.AddUserToRole(user4.Id, "Guest");

                foreach (var user in users.Where(u => u.UserName.StartsWith("acme")))
                {
                    userService.CreateUser(user, "user");
                }
                context.SaveChanges();
                foreach (var user in users.Where(u => u.UserName.StartsWith("acme")))
                {
                    userService.AddUserToRole(user.Id, "User");
                }
            }

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

            var feedbackDefinitions = new List<FeedbackDefinition>
            {
                new FeedbackDefinition
                {
                    Title = "Acme Event",
                    Active0 = true,
                    QuestionType0 = FeedbackQuestionType.FiveStarRate,
                    Title0 = "Vortragsstil",
                    Active1 = true,
                    QuestionType1 = FeedbackQuestionType.FiveStarRate,
                    Title1 = "Folien",
                    Active2 = true,
                    QuestionType2 = FeedbackQuestionType.FiveStarRate,
                    Title2 = "Transport von Inhalten",
                    Active3 = true,
                    QuestionType3 = FeedbackQuestionType.FiveStarRate,
                    Title3 = "Business-Relevanz",
                    Active4 = true,
                    QuestionType4 = FeedbackQuestionType.Freetext,
                    Title4 = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten",
                    Active5 = true,
                    QuestionType5 = FeedbackQuestionType.Freetext,
                    Title5 = "Dein Kommentar zu den Folien",
                    Active6 = true,
                    QuestionType6 = FeedbackQuestionType.Freetext,
                    Title6 = "Dein Kommentar zum Thema",
                    Active7 = true,
                    QuestionType7 = FeedbackQuestionType.Freetext,
                    Title7 = "Was sollte organisatorisch (Termin, Raum) verbessert werden?",
                    Active8 = true,
                    QuestionType8 = FeedbackQuestionType.Freetext,
                    Title8 = "Feedback zum Auditorium (Hier kannst Du Bemerkungen zu den Zuhörern eingeben.)",
                    Active9 = true,
                    QuestionType9 = FeedbackQuestionType.Freetext,
                    Title9 = "Welche Themen interessieren dich im allgemeinen Teil?"
                },
                new FeedbackDefinition
                {
                    Title = "Acme Session",
                    Active0 = true,
                    QuestionType0 = FeedbackQuestionType.FiveStarRate,
                    Title0 = "Vortragsstil",
                    Active1 = true,
                    QuestionType1 = FeedbackQuestionType.FiveStarRate,
                    Title1 = "Folien",
                    Active2 = true,
                    QuestionType2 = FeedbackQuestionType.FiveStarRate,
                    Title2 = "Transport von Inhalten",
                    Active3 = true,
                    QuestionType3 = FeedbackQuestionType.FiveStarRate,
                    Title3 = "Business-Relevanz",
                    Active4 = true,
                    QuestionType4 = FeedbackQuestionType.Freetext,
                    Title4 = "Dein Kommentar zum Vortragstil und dem Transport von Inhalten",
                    Active5 = true,
                    QuestionType5 = FeedbackQuestionType.Freetext,
                    Title5 = "Dein Kommentar zu den Folien",
                    Active6 = true,
                    QuestionType6 = FeedbackQuestionType.Freetext,
                    Title6 = "Dein Kommentar zum Thema"
                }
            };

            context.FeedbackDefinitions.AddOrUpdate(
                p => p.Title,
                feedbackDefinitions.ToArray()
                );
            context.SaveChanges();

            var events = new List<Event>
            {
                new Event
                {
                    Title = "2013 ET 1",
                    FeedbackDefinitionId = feedbackDefinitions.First().Id,
                    StartDate = new DateTime(2013, 2, 18),
                    EndDate = new DateTime(2013, 2, 18),
                    Location = "Mannheim",
                    Description = Lorem1,
                    Sessions =
                        new Collection<Session>
                        {
                            new Session
                            {
                                Title = "Keynote ET1",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 2, 18, 9, 0, 0),
                                EndDate = new DateTime(2013, 2, 18, 11, 30, 0),
                                TagList = "C#;Java",
                                SpeakerList = "Speaker1;Speaker2",
                            },
                            new Session
                            {
                                Title = "Session1 ET1",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 2, 18, 11, 30, 0),
                                EndDate = new DateTime(2013, 2, 18, 12, 30, 0),
                                TagList = "C#",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session2 ET1",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 2, 18, 13, 0, 0),
                                EndDate = new DateTime(2013, 2, 18, 14, 30, 0),
                                TagList = "Java",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session3 ET1",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 2, 18, 15, 00, 0),
                                EndDate = new DateTime(2013, 2, 18, 16, 30, 0),
                                TagList = "C#",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session4 ET1",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 2, 18, 16, 30, 0),
                                EndDate = new DateTime(2013, 2, 18, 17, 30, 0),
                                TagList = "Java",
                                SpeakerList = "Speaker1",
                            }
                        }
                },
                new Event
                {
                    Title = "2013 ET 2",
                    FeedbackDefinitionId = feedbackDefinitions.First().Id,
                    StartDate = new DateTime(2013, 5, 10),
                    EndDate = new DateTime(2013, 5, 10),
                    Location = "Mannheim",
                    Description = Lorem1,
                    Sessions =
                        new Collection<Session>
                        {
                            new Session
                            {
                                Title = "Keynote",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 5, 10, 9, 0, 0),
                                EndDate = new DateTime(2013, 5, 10, 11, 30, 0),
                                TagList = "C#;Java",
                                SpeakerList = "Speaker1;Speaker2",
                            },
                            new Session
                            {
                                Title = "Session1 ET2",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 5, 10, 11, 30, 0),
                                EndDate = new DateTime(2013, 5, 10, 12, 30, 0),
                                TagList = "C#",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session2 ET2",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
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
                    FeedbackDefinitionId = feedbackDefinitions.First().Id,
                    StartDate = new DateTime(2013, 7, 1),
                    EndDate = new DateTime(2013, 7, 1),
                    Location = "Mannheim",
                    Description = Lorem1,
                    Sessions =
                        new Collection<Session>
                        {
                            new Session
                            {
                                Title = "Keynote ET3",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 7, 1, 9, 0, 0),
                                EndDate = new DateTime(2013, 7, 1, 11, 30, 0),
                                TagList = "C#;Java",
                                SpeakerList = "Speaker1;Speaker2",
                            },
                            new Session
                            {
                                Title = "Session1 ET3",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 7, 1, 11, 30, 0),
                                EndDate = new DateTime(2013, 7, 1, 12, 30, 0),
                                TagList = "C#",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session2 ET3",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
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
                    FeedbackDefinitionId = feedbackDefinitions.First().Id,
                    StartDate = new DateTime(2013, 10, 09),
                    EndDate = new DateTime(2013, 10, 09),
                    Location = "Mannheim",
                    Description = Lorem1,
                    Sessions =
                        new Collection<Session>
                        {
                            new Session
                            {
                                Title = "Keynote ET4",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 10, 24, 9, 0, 0),
                                EndDate = new DateTime(2013, 10, 24, 11, 30, 0),
                                TagList = "C#;Java",
                                SpeakerList = "Speaker1;Speaker2",
                            },
                            new Session
                            {
                                Title = "Session1 ET4",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                StartDate = new DateTime(2013, 10, 23, 11, 30, 0),
                                EndDate = new DateTime(2013, 10, 23, 12, 30, 0),
                                TagList = "C#",
                                SpeakerList = "Speaker1",
                            },
                            new Session
                            {
                                Title = "Session2 ET4",
                                Description = Lorem1,
                                FeedbackDefinitionId = feedbackDefinitions.Last().Id,
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
            context.SaveChanges();

            if (!context.Feedbacks.Any())
            {
                foreach (var user in users)
                {
                    foreach (var e in events)
                    {
                        context.Feedbacks.Add(
                            new Feedback
                            {
                                FeedbackDefinitionId = feedbackDefinitions.First().Id,
                                UserId = user.Id,
                                EventId = e.Id,
                                AverageRate = Random.Next(1, 5),
                                Answer0 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                Answer1 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                Answer2 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                Answer3 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                Answer4 = "event feedback q4 " + Lorem1,
                                Answer5 = "event feedback q5 " + Lorem1,
                                Answer6 = "event feedback q6 " + Lorem1,
                                Answer7 = "event feedback q7 " + Lorem1,
                                Answer8 = "event feedback q8 " + Lorem1,
                                Answer9 = "event feedback q9 " + Lorem1,
                            });

                        foreach (var s in e.Sessions)
                        {
                            context.Feedbacks.Add(
                                new Feedback
                                {
                                    FeedbackDefinitionId = feedbackDefinitions.Last().Id,
                                    UserId = user.Id,
                                    SessionId = s.Id,
                                    AverageRate = Random.Next(1, 5),
                                    Answer0 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                    Answer1 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                    Answer2 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                    Answer3 = Random.Next(1, 5).ToString(CultureInfo.InvariantCulture),
                                    Answer4 = "session feedback q4 " + Lorem1,
                                    Answer5 = "session feedback q5 " + Lorem1,
                                    Answer6 = "session feedback q6 " + Lorem1,
                                });
                        }
                    }
                }
                context.SaveChanges();
            }
        }
    }
}
