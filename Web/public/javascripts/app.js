(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, config, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/marionette-renderer');

require('lib/view-helper');

config = require('config');

Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    this.initialize = __bind(this.initialize, this);
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.routers = {};

  Application.prototype.initialize = function() {
    var _this = this;
    console.log('application init');
    this.on("initialize:after", function(options) {
      var module, name, router, _ref1;
      console.log('application init after');
      _ref1 = config.modules;
      for (name in _ref1) {
        module = _ref1[name];
        console.log('module', name);
        router = new (require(module));
        _this.routers[name] = router;
      }
      Backbone.history.start();
      console.log('current route', _this.getCurrentRoute());
      if (_this.getCurrentRoute() === '') {
        return _this.trigger(config.startuptrigger);
      }
    });
    this.addInitializer(function(options) {
      _this.layout = new (require(config.layout));
      return _this.layout.render();
    });
    return this.start();
  };

  Application.prototype.navigate = function(route, options) {
    console.log('navigate', route);
    options = options || {};
    return Backbone.history.navigate(route, options);
  };

  Application.prototype.getCurrentRoute = function() {
    return Backbone.history.fragment;
  };

  Application.prototype.startModule = function(name, options) {
    var currentModule;
    console.log('startmodule', route);
    currentModule = name || this.module(name) || null;
    if (ContactManager.currentModule === currentModule) {
      return;
    }
    if (this.currentModule != null) {
      this.currentModule.stop();
    }
    this.currentModule = currentModule;
    if (currentModule) {
      return currentModule.start(options);
    }
  };

  return Application;

})(Backbone.Marionette.Application);

module.exports = new Application();

});

;require.register("config", function(exports, require, module) {
var Config;

Config = (function() {
  function Config() {}

  Config.prototype.appcontainer = 'content';

  Config.prototype.approot = '/';

  Config.prototype.apiroot = '/api/v1';

  Config.prototype.startuptrigger = 'home:index';

  Config.prototype.brandtrigger = 'home:index';

  Config.prototype.layout = 'layouts/app-layout';

  Config.prototype.modules = {
    'common': 'modules/common/router',
    'header': 'modules/header/router',
    'contact': 'modules/contact/router'
  };

  return Config;

})();

module.exports = new Config();

});

;require.register("initialize", function(exports, require, module) {
var app;

app = require('application');

$(function() {
  FastClick.attach(document.body);
  return app.initialize();
});

});

;require.register("layouts/app-layout", function(exports, require, module) {
var AppLayout, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = AppLayout = (function(_super) {
  __extends(AppLayout, _super);

  function AppLayout() {
    _ref = AppLayout.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AppLayout.prototype.template = 'layouts/templates/app-layout';

  AppLayout.prototype.el = "body";

  AppLayout.prototype.regions = {
    header: '#header',
    content: "#content",
    footer: "#footer"
  };

  return AppLayout;

})(Backbone.Marionette.Layout);

});

;require.register("layouts/templates/app-layout", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"header\" class=\"container\"></div>\r\n<div id=\"content\" class=\"container\"></div>\r\n<hr/>\r\n<div id=\"footer\" class=\"container\"></div>\r\n";
  });
});

;require.register("lib/base/collection", function(exports, require, module) {
var Collection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Collection.prototype.destroyAll = function() {
    var promises;
    promises = [];
    while (this.models.length > 0) {
      promises.push(this.models[0].destroy());
    }
    return $.when(promises).fail(function(response) {
      return this.trigger('syncError', response);
    });
  };

  return Collection;

})(Backbone.Collection);

});

;require.register("lib/base/item-view", function(exports, require, module) {
var ItemView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ItemView = (function(_super) {
  __extends(ItemView, _super);

  function ItemView() {
    _ref = ItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ItemView.prototype.onShow = function() {
    var attr, _results;
    if (this.tagAttrs != null) {
      _results = [];
      for (attr in this.tagAttrs) {
        _results.push(this.$el.attr(attr, this.tagAttrs[attr](this.model)));
      }
      return _results;
    }
  };

  return ItemView;

})(Backbone.Marionette.ItemView);

});

;require.register("lib/base/model", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Backbone.Model);

});

;require.register("lib/marionette-renderer", function(exports, require, module) {
Backbone.Marionette.Renderer.render = function(templateName, data) {
  var template;
  if (_.isFunction(templateName)) {
    template = templateName;
  } else {
    template = require(templateName);
  }
  return template(data);
};

});

;require.register("lib/view-helper", function(exports, require, module) {
Handlebars.registerHelper('pick', function(val, options) {
  return options.hash[val];
});

});

;require.register("models/contact", function(exports, require, module) {
var Collection, Contact, ContactsCollection, Model, TestData, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

module.exports.Model = Contact = (function(_super) {
  __extends(Contact, _super);

  function Contact() {
    _ref = Contact.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Contact.prototype.urlRoot = "contacts";

  Contact.prototype.defaults = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  Contact.prototype.validate = function(attrs, options) {
    var errors;
    errors = {};
    if (_.isEmpty(attrs.firstName)) {
      errors.firstName = "can't be blank";
    }
    if (_.isEmpty(attrs.lastName)) {
      errors.lastName = "can't be blank";
    } else {
      if (attrs.lastName.length < 2) {
        errors.lastName = "is too short";
      }
    }
    if (!_.isEmpty(errors)) {
      return errors;
    }
  };

  return Contact;

})(Model);

module.exports.Collection = ContactsCollection = (function(_super) {
  __extends(ContactsCollection, _super);

  function ContactsCollection() {
    _ref1 = ContactsCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  ContactsCollection.prototype.localStorage = new Backbone.LocalStorage("contacts");

  ContactsCollection.prototype.model = module.exports.Model;

  ContactsCollection.prototype.comparator = 'firstName';

  return ContactsCollection;

})(Collection);

module.exports.TestData = TestData = (function() {
  function TestData() {}

  TestData.prototype.addTo = function(collection) {
    if (collection.size() === 0) {
      collection.reset(this.data);
      return collection.forEach(function(model) {
        return model.save();
      });
    }
  };

  TestData.prototype.data = [
    {
      id: "ce82ceb6-1104-aaa6-4fab-a4656694de17",
      firstName: "Alice",
      lastName: "Arten",
      phoneNumber: "555-0184"
    }, {
      id: "9cf247f4-4c76-d453-bbec-1c40080e32e5",
      firstName: "Bob",
      lastName: "Brigham",
      phoneNumber: "555-0163"
    }, {
      id: "511b8984-8958-663d-4707-9378aa71776b",
      firstName: "Charlie",
      lastName: "Campbell",
      phoneNumber: "555-0129"
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5",
      firstName: "Amy",
      lastName: "Campbell",
      phoneNumber: "555-0130"
    }
  ];

  return TestData;

})();

});

;require.register("models/header", function(exports, require, module) {
var Collection, Header, HeadersCollection, Model, TestData, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

module.exports.Model = Header = (function(_super) {
  __extends(Header, _super);

  function Header() {
    _ref = Header.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Header.prototype.urlRoot = "headers";

  Header.prototype.defaults = {
    title: '',
    href: '',
    intern: true
  };

  return Header;

})(Model);

module.exports.Collection = HeadersCollection = (function(_super) {
  __extends(HeadersCollection, _super);

  function HeadersCollection() {
    _ref1 = HeadersCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  HeadersCollection.prototype.localStorage = new Backbone.LocalStorage("headers");

  HeadersCollection.prototype.model = module.exports.Model;

  HeadersCollection.prototype.comparator = 'order';

  return HeadersCollection;

})(Collection);

module.exports.TestData = TestData = (function() {
  function TestData() {}

  TestData.prototype.addTo = function(collection) {
    if (collection.size() === 0) {
      collection.reset(this.data);
      return collection.forEach(function(model) {
        return model.save();
      });
    }
  };

  TestData.prototype.data = [
    {
      id: "511b8984-8958-663d-4707-9378aa71776b",
      title: "Home",
      trigger: "home:index",
      intern: true,
      order: 0
    }, {
      id: "ce82ceb6-1104-aaa6-4fab-a4656694de17",
      title: "About",
      trigger: "about:index",
      intern: true,
      order: 2
    }, {
      id: "9cf247f4-4c76-d453-bbec-1c40080e32e5",
      title: "Contacts",
      trigger: "contacts:index",
      intern: true,
      order: 1
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5",
      title: "Sign in",
      trigger: "signin:index",
      intern: true,
      order: 3
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4",
      title: "Debug",
      trigger: "debug:index",
      intern: true,
      order: 4
    }
  ];

  return TestData;

})();

});

;require.register("modules/common/controller", function(exports, require, module) {
var Controller, application,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    console.log('about controller init');
  }

  Controller.prototype.showHome = function() {
    var view;
    view = new (require('./views/home-view'));
    return application.layout.content.show(view);
  };

  Controller.prototype.showSignin = function() {
    var view;
    view = new (require('./views/signin-view'));
    return application.layout.content.show(view);
  };

  Controller.prototype.showAbout = function() {
    var view;
    view = new (require('./views/about-view'));
    return application.layout.content.show(view);
  };

  Controller.prototype.showDebug = function() {
    var view;
    view = new (require('./views/debug-view'));
    return application.layout.content.show(view);
  };

  Controller.prototype.onClose = function() {
    return console.log('about controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);

});

;require.register("modules/common/router", function(exports, require, module) {
var Controller, Router, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.appRoutes = {
    'about': 'showAbout',
    'debug': 'showDebug',
    'home': 'showHome',
    'signin': 'showSignin'
  };

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('about router init');
    return application.addInitializer(function(options) {
      application.on('home:index', function() {
        application.navigate('home');
        return _this.controller.showHome();
      });
      application.on('signin:index', function() {
        application.navigate('signin');
        return _this.controller.showSignin();
      });
      application.on('about:index', function() {
        application.navigate('about');
        return _this.controller.showAbout();
      });
      return application.on('debug:index', function() {
        application.navigate('debug');
        return _this.controller.showDebug();
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);

});

;require.register("modules/common/views/about-view", function(exports, require, module) {
var AboutView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = AboutView = (function(_super) {
  __extends(AboutView, _super);

  function AboutView() {
    _ref = AboutView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AboutView.prototype.id = 'about-view';

  AboutView.prototype.template = require('./templates/about');

  AboutView.prototype.onClose = function() {
    return console.log('about view close');
  };

  return AboutView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/common/views/debug-view", function(exports, require, module) {
var DebugView, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = DebugView = (function(_super) {
  __extends(DebugView, _super);

  function DebugView() {
    _ref = DebugView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DebugView.prototype.id = 'debug-view';

  DebugView.prototype.template = require('./templates/debug');

  DebugView.prototype.events = {
    'click .js-triggerevent': 'onTriggerEvent'
  };

  DebugView.prototype.onTriggerEvent = function(e) {
    var model;
    model = Backbone.Syphon.serialize(this);
    console.log('onTriggerEvent', model);
    application.trigger(model.event);
    return e.preventDefault();
  };

  DebugView.prototype.onClose = function() {
    return console.log('debug view close');
  };

  return DebugView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/common/views/footer-view", function(exports, require, module) {
var FooterView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = FooterView = (function(_super) {
  __extends(FooterView, _super);

  function FooterView() {
    _ref = FooterView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FooterView.prototype.id = 'footer-view';

  FooterView.prototype.template = require('./templates/footer');

  return FooterView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/common/views/home-view", function(exports, require, module) {
var HomeView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = require('./templates/home');

  HomeView.prototype.onClose = function() {
    return console.log('home view close');
  };

  return HomeView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/common/views/signin-view", function(exports, require, module) {
var SigninView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = SigninView = (function(_super) {
  __extends(SigninView, _super);

  function SigninView() {
    _ref = SigninView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SigninView.prototype.id = 'signin-view';

  SigninView.prototype.template = require('./templates/signin');

  SigninView.prototype.events = {
    'click .js-signin': 'onSignin'
  };

  SigninView.prototype.onSignin = function(e) {
    console.log('ssssssssssssss');
    return e.preventDefault();
  };

  SigninView.prototype.onShow = function() {
    return $('.make-switch').bootstrapSwitch();
  };

  SigninView.prototype.onClose = function() {
    return console.log('signin view close');
  };

  return SigninView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/common/views/templates/about", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>About</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    <p>\r\n      <a class=\"btn btn-lg btn-primary\" href=\"#\">More &raquo;</a>\r\n    </p>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/common/views/templates/debug", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>Debug</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    <form>\r\n      <input type=\"text\" name=\"event\" placeholder=\"event\"/>\r\n      <button class=\"js-triggerevent\">trigger</button>\r\n    </form>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/common/views/templates/footer", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p>© Company 2013 - ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " [";
  if (stack1 = helpers.time) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.time; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "]</p>";
  return buffer;
  });
});

;require.register("modules/common/views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>Brunch with Marionette</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    <p>\r\n      <a class=\"btn btn-lg btn-primary\" href=\"#\">More &raquo;</a>\r\n    </p>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/common/views/templates/signin", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <form class=\"form-signin\">\r\n      <h3 class=\"form-signin-heading\">Please sign in</h3>\r\n      <input type=\"text\" class=\"form-control\" placeholder=\"username\" autofocus>\r\n      <input type=\"password\" class=\"form-control\" placeholder=\"password\">\r\n      <div class=\"form-group\">\r\n        <label for=\"notification1\">Remember me</label>\r\n        <div class=\"make-switch\" data-animated=\"false\" data-on-label=\"yes\" data-off-label=\"no\" data-on=\"success\">\r\n          <input type=\"radio\" id=\"notification1\">\r\n        </div>\r\n      </div>\r\n      <button class=\"btn btn-lg btn-success btn-block js-signin\">Sign in</button>\r\n    </form>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/contact/controller", function(exports, require, module) {
var Contact, Controller, application,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Contact = require('../../models/contact');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('contact controller init');
    application.addInitializer(function(options) {
      application.on('contacts:index', function() {
        return application.navigate('contacts');
      });
      application.on('contact:details', function(id) {
        return application.navigate('contacts/' + id);
      });
      application.on('contact:add', function(data) {
        return _this.addContact(data);
      });
      application.on('contact:reset', function(data) {
        return _this.contacts.destroyAll();
      });
      _this.contacts = new Contact.Collection();
      return _this.contacts.fetch().done(function() {
        return new Contact.TestData().addTo(_this.contacts);
      });
    });
  }

  Controller.prototype.showContactsIndex = function() {
    return this.contacts.fetch().done(function(models) {
      var View, view;
      View = require('./views/contacts-index-view');
      view = new View({
        collection: models
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.addContact = function(model) {
    var itemView, _ref;
    console.log('controller:addNewContact', model);
    if (model.isValid()) {
      this.contacts.add(model);
      model.save();
      application.layout.content.currentView.render();
      itemView = (_ref = application.layout.content.currentView.children) != null ? _ref.findByModel(model) : void 0;
      return itemView != null ? itemView.flash('success') : void 0;
    } else {
      return console.warn(model.validationError);
    }
  };

  Controller.prototype.showContactDetails = function(id) {
    return this.contacts.fetch().done(function(models) {
      var View, view;
      View = require('./views/contact-details-view');
      view = new View({
        model: models.get(id)
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.onClose = function() {
    return console.log('contact controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);

});

;require.register("modules/contact/router", function(exports, require, module) {
var Controller, Router, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.appRoutes = {
    'contacts': 'showContactsIndex',
    'contacts/:id': 'showContactDetails'
  };

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('contact router init');
    return application.addInitializer(function(options) {
      application.on('contacts:index', function() {
        application.navigate('contacts');
        return _this.controller.showContactsIndex();
      });
      return application.on('contact:details', function(id) {
        application.navigate('contact', id);
        return _this.controller.showContactDetails(id);
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);

});

;require.register("modules/contact/views/contact-details-view", function(exports, require, module) {
var ContactDetailsView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = ContactDetailsView = (function(_super) {
  __extends(ContactDetailsView, _super);

  function ContactDetailsView() {
    _ref = ContactDetailsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ContactDetailsView.prototype.id = 'contact-details-view';

  ContactDetailsView.prototype.template = require('./templates/contact-details');

  ContactDetailsView.prototype.initialize = function(options) {
    return console.log('contact id', options);
  };

  return ContactDetailsView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/contact/views/contact-item-view", function(exports, require, module) {
var ContactItemView, ItemView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ItemView = require('../../../../lib/base/item-view');

module.exports = ContactItemView = (function(_super) {
  __extends(ContactItemView, _super);

  function ContactItemView() {
    _ref = ContactItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ContactItemView.prototype.id = 'contact-item-view';

  ContactItemView.prototype.template = require('./templates/contact-item');

  ContactItemView.prototype.tagName = 'a';

  ContactItemView.prototype.className = 'list-group-item';

  ContactItemView.prototype.tagAttrs = {
    'href': function(model) {
      return '#contacts/' + model.get('id');
    }
  };

  ContactItemView.prototype.flash = function(cssClass) {
    var $view;
    $view = this.$el;
    return $view.hide().toggleClass(cssClass).fadeIn(500, function() {
      return setTimeout(function() {
        return $view.toggleClass(cssClass);
      }, 500);
    });
  };

  return ContactItemView;

})(ItemView);

});

;require.register("modules/contact/views/contacts-index-view", function(exports, require, module) {
var Contact, ContactIndexView, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Contact = require('../../../models/contact');

module.exports = ContactIndexView = (function(_super) {
  __extends(ContactIndexView, _super);

  function ContactIndexView() {
    _ref = ContactIndexView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ContactIndexView.prototype.id = 'contact-index-view';

  ContactIndexView.prototype.template = require('./templates/contacts-index');

  ContactIndexView.prototype.itemView = require('./contact-item-view');

  ContactIndexView.prototype.itemViewContainer = '.js-contacts';

  ContactIndexView.prototype.events = {
    'click .js-add': 'onAdd',
    'click .js-reset': 'onReset'
  };

  ContactIndexView.prototype.onAdd = function(e) {
    application.trigger('contact:add', new Contact.Model(Backbone.Syphon.serialize(this)));
    this.$el.find('input[type=text]').val('');
    return e.preventDefault();
  };

  ContactIndexView.prototype.onReset = function(e) {
    if (confirm('Reset?')) {
      application.trigger('contact:reset');
    }
    return e.preventDefault();
  };

  ContactIndexView.prototype.onClose = function() {
    return console.log('contacts-index view close');
  };

  return ContactIndexView;

})(Backbone.Marionette.CompositeView);

});

;require.register("modules/contact/views/templates/contact-details", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>";
  if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\r\n    <h3>";
  if (stack1 = helpers.phoneNumber) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.phoneNumber; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>\r\n      <a class=\"btn btn-lg btn-primary\" href=\"#contacts\">&laquo; Back</a>\r\n    </p>\r\n  </div>\r\n</div>";
  return buffer;
  });
});

;require.register("modules/contact/views/templates/contact-item", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });
});

;require.register("modules/contact/views/templates/contacts-index", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>Contacts</h3>\r\n    <div class=\"list-group js-contacts\">\r\n      <!-- contacts -->\r\n    </div>\r\n\r\n    <form class=\"form-contact\" role=\"form\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-0 col-md-4\"></div>\r\n          <div class=\"col-xs-12 col-md-5\">\r\n            <input type=\"text\" class=\"form-control\" name=\"firstName\" placeholder=\"Enter firstname\">\r\n            <input type=\"text\" class=\"form-control\" name=\"lastName\" placeholder=\"Enter lastname\">\r\n          </div>\r\n          <div class=\"col-xs-0 col-md-3\"></div>\r\n        </div>\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-0 col-md-4\"></div>\r\n          <div class=\"col-xs-7 col-md-3\">\r\n            <button class=\"btn btn-lg btn-success btn-block js-add\">Add</button>\r\n          </div>\r\n          <div class=\"col-xs-5 col-md-2\">\r\n            <button class=\"btn btn-lg btn-danger btn-block js-reset\">Reset</button>\r\n          </div>\r\n          <div class=\"col-xs-0 col-md-3\"></div>\r\n        </div>\r\n    </form>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/header/controller", function(exports, require, module) {
var Controller, Header, application,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Header = require('../../models/header');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('about controller init');
    application.addInitializer(function(options) {
      _this.headers = new Header.Collection();
      return _this.headers.fetch().done(function() {
        return new Header.TestData().addTo(_this.headers);
      });
    });
  }

  Controller.prototype.showHeader = function() {
    return this.headers.fetch().done(function(models) {
      var View, view;
      View = require('./views/header-view');
      view = new View.Header({
        collection: models
      });
      return application.layout.header.show(view);
    });
  };

  Controller.prototype.onClose = function() {
    return console.log('header controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);

});

;require.register("modules/header/router", function(exports, require, module) {
var Controller, Router, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('header router init');
    return application.addInitializer(function(options) {
      return application.on('start', function() {
        return _this.controller.showHeader();
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);

});

;require.register("modules/header/views/header-view", function(exports, require, module) {
var ItemView, View, application, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports.HeaderItem = ItemView = (function(_super) {
  __extends(ItemView, _super);

  function ItemView() {
    _ref = ItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ItemView.prototype.id = 'header-item-view';

  ItemView.prototype.template = require('./templates/header-item');

  ItemView.prototype.tagName = 'li';

  ItemView.prototype.events = {
    'click': 'onClick'
  };

  ItemView.prototype.onClick = function(e) {
    $('.navbar-collapse').collapse('hide');
    application.trigger(this.model.get('trigger'));
    return e.preventDefault();
  };

  return ItemView;

})(Backbone.Marionette.ItemView);

module.exports.Header = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref1 = View.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  View.prototype.id = 'header-view';

  View.prototype.template = require('./templates/header');

  View.prototype.itemView = module.exports.HeaderItem;

  View.prototype.itemViewContainer = '.js-headers';

  return View;

})(Backbone.Marionette.CompositeView);

});

;require.register("modules/header/views/templates/header-item", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"#";
  if (stack1 = helpers.href) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>";
  return buffer;
  });
});

;require.register("modules/header/views/templates/header", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <div class=\"container\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"http://brunch.io\">Brunch</a>\r\n    </div>\r\n    <div class=\"navbar-collapse collapse no-transition\">\r\n      <ul class=\"nav navbar-nav js-headers\">\r\n        <!-- headers-->\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>";
  });
});

;
//@ sourceMappingURL=app.js.map