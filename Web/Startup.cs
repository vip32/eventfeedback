﻿using System;
using EventFeedback.Common;
using Owin;

namespace EventFeedback.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            SystemTime.Now = () => new DateTime(2013, 10, 9);

            //ConfigureResolver(app);
            ConfigureAuth(app);
            ConfigureWebApi(app);
        }
    }
}