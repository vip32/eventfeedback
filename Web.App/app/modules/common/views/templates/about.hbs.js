var about = Handlebars.template({
  "compiler": [6, ">= 2.0.0-beta.1"],
  "main": function (depth0, helpers, partials, data) {
    var helper, functionType = "function",
      helperMissing = helpers.helperMissing,
      escapeExpression = this.escapeExpression;
    return "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>App</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.App\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li>Backbone 1.1.0</li>\r\n        <li>Underscore 1.5.2</li>\r\n        <li>Twitter Bootstrap 3.0.0</li>\r\n        <li>MarionetteJS 1.2.2</li>\r\n        <!--<li>MomentJS 2.2.1</li>-->\r\n        <li>jQuery 2.0.3</li>\r\n        <li>JQuery RateIt 1.0.19</li>\r\n        <li>Fastclick 0.6.10</li>\r\n        <li>Pace 0.4.15</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <h3>Api</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.Api\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li><a href=\"" +
      escapeExpression(((helper = (helper = helpers.apiinfo || (depth0 != null ? depth0.apiinfo : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "apiinfo",
        "hash": {},
        "data": data
      }) : helper))) +
      "\">ApiInfo</a></li>\r\n        <li><a href=\"" +
      escapeExpression(((helper = (helper = helpers.help || (depth0 != null ? depth0.help : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "help",
        "hash": {},
        "data": data
      }) : helper))) +
      "\">Documentation</a></li>\r\n        <li><a href=\"" +
      escapeExpression(((helper = (helper = helpers.swagger || (depth0 != null ? depth0.swagger : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "swagger",
        "hash": {},
        "data": data
      }) : helper))) +
      "\">Swagger</a></li>\r\n        <li>Microsoft .Net 4.5, C#</li>\r\n        <li>Microsoft ASP.NET Web API 2</li>\r\n        <li>Microsoft Entity Framework 6.0</li>\r\n        <li>Microsoft ASP.NET Identity 1.0</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>Dev</h3>\r\n      <ul>\r\n        <li>\r\n          <a href=\"https://github.com/WindowsAzure\" target=\"_blank\">Windows Azure</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/joyent/node\" target=\"_blank\">Node.js</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/brunch/brunch\" target=\"_blank\">Brunch</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/jashkenas/coffee-script\" target=\"_blank\">Coffeescript</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/bower/bower\" target=\"_blank\">Bower</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      &nbsp;\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <p>\r\n        <a href=\"/\">\r\n          <img class=\"qrimage\" height=\"88\" width=\"88\"/>\r\n        </a>\r\n        <a href=\"/\">\r\n          <img class=\"logoimage\" height=\"88\" width=\"88\" />\r\n        </a>\r\n      </p>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-signout\" href=\"#\">\r\n          <i class=\"icon-user\"></i>\r\n          &emsp;Signout\r\n        </a>\r\n      </p>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-reset\" href=\"#\">\r\n          <i class=\"icon-bomb\"></i>\r\n          &emsp;Reset</a>\r\n      </p>\r\n      <p>\r\n        <span class=\"glyphicon glyphicon-user\">&emsp;user: " +
      escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "user",
        "hash": {},
        "data": data
      }) : helper))) +
      "/ role: " +
      escapeExpression(((helper = (helper = helpers.roles || (depth0 != null ? depth0.roles : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "roles",
        "hash": {},
        "data": data
      }) : helper))) +
      "/ admin: " +
      escapeExpression(((helper = (helper = helpers.admin || (depth0 != null ? depth0.admin : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "admin",
        "hash": {},
        "data": data
      }) : helper))) +
      "/ auth: " +
      escapeExpression(((helper = (helper = helpers.auth || (depth0 != null ? depth0.auth : depth0)) != null ? helper : helperMissing), (typeof helper === functionType ? helper.call(depth0, {
        "name": "auth",
        "hash": {},
        "data": data
      }) : helper))) +
      "</span>\r\n      </p>\r\n    </div>\r\n  </div>\r\n</div>";
  },
  "useData": true
});