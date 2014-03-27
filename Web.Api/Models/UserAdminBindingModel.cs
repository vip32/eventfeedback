using System;

namespace EventFeedback.Web.Api.Models
{
    public class UserAdminBindingModel
    {
        public string UserName { get; set; }
        public string Organization { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public string Roles { get; set; }
        public string Password { get; set; }
        public DateTime? ActiveFrom { get; set; }
        public DateTime? ActiveTill { get; set; }
        public string Id { get; set; }
    }
}