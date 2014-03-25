using System;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EventFeedback.Domain.Identity
{
    public class UserLogin : IdentityUserLogin<Guid> { }
}