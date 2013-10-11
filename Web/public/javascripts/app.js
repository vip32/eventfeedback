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
var Application, Resource, config, settings, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/marionette-renderer');

require('lib/view-helper');

config = require('config');

settings = require('settings');

Resource = require('../../models/resource');

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
      return _this.on('start', function() {
        return _this.trigger(config.startuptrigger);
      });
    });
    this.addInitializer(function(options) {
      _this.layout = new (require(config.layout));
      return _this.layout.render();
    });
    this.resources = new Resource.Collection();
    return this.resources.fetch({
      data: {
        language: 'de-DE'
      }
    }).done(function(resources) {
      settings.set('last-visit', moment());
      settings.set('username', 'admin');
      settings.set('password', 'admin');
      return _this.start();
    });
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

  Config.prototype.apptitle = 'Event|Feedback';

  Config.prototype.appcontainer = 'content';

  Config.prototype.approot = '/';

  Config.prototype.apiroot = '/api';

  Config.prototype.startuptrigger = 'events:index';

  Config.prototype.brandtrigger = 'events:index';

  Config.prototype.layout = 'layouts/app-layout';

  Config.prototype.sidebarglyphicon = 'minus';

  Config.prototype.modules = {
    'header': 'modules/header/router',
    'common': 'modules/common/router',
    'event': 'modules/event/router'
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

  AppLayout.prototype.initialize = function() {
    application.on('sidebar:toggle', this.onSidebarToggle);
    return application.on('sidebar:hide', this.onSidebarHide);
  };

  AppLayout.prototype.events = {
    'click .page-content': 'onSidebarHide',
    'click div #sidebar-wrapper': 'onSidebarHide'
  };

  AppLayout.prototype.onSidebarToggle = function() {
    return $('#wrapper').toggleClass('active');
  };

  AppLayout.prototype.onSidebarHide = function() {
    return $('#wrapper').removeClass('active');
  };

  return AppLayout;

})(Backbone.Marionette.Layout);

});

;require.register("layouts/templates/app-layout", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"wrapper\">\r\n\r\n  <div id=\"header\" class=\"container\"></div>\r\n  <div class=\"page-content inset\">\r\n    <div id=\"content\" class=\"container\"></div>\r\n  </div>\r\n\r\n  <hr/>\r\n  <div id=\"footer\" class=\"container\"></div>\r\n\r\n</div>";
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

Handlebars.registerHelper("dateFormat", function(context, block) {
  var f;
  if (window.moment) {
    f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
    return moment(context).format(f);
  } else {
    return context;
  }
});

});

;require.register("models/event", function(exports, require, module) {
var Collection, Event, EventsCollection, Model, config, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

module.exports.Model = Event = (function(_super) {
  __extends(Event, _super);

  function Event() {
    _ref = Event.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Event;

})(Model);

module.exports.Collection = EventsCollection = (function(_super) {
  __extends(EventsCollection, _super);

  function EventsCollection() {
    _ref1 = EventsCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  EventsCollection.prototype.url = "" + config.apiroot + "/events";

  EventsCollection.prototype.credentials = {
    username: 'admin',
    password: 'admin'
  };

  EventsCollection.prototype.model = module.exports.Model;

  EventsCollection.prototype.comparator = 'title';

  return EventsCollection;

})(Collection);

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

  HeadersCollection.prototype.url = 'headers';

  HeadersCollection.prototype.model = module.exports.Model;

  HeadersCollection.prototype.comparator = 'order';

  return HeadersCollection;

})(Collection);

module.exports.TestData = TestData = (function() {
  function TestData() {}

  TestData.prototype.addTo = function(collection) {
    if (collection.size() === 0) {
      return collection.reset(this.data);
    }
  };

  TestData.prototype.data = [
    {
      id: "511b8984-8958-663d-4707-9378aa71776b",
      visible: false,
      resource: 'Title_Home',
      glyphicon: 'home',
      title: "Home",
      trigger: "home:index",
      intern: true,
      order: 0
    }, {
      id: "ce82ceb6-1104-aaa6-4fab-a4656694de17",
      title: "About",
      resource: 'Title_About',
      trigger: "about:index",
      intern: true,
      order: 3
    }, {
      id: "1cf247f4-4c76-d453-bbec-1c40080e32e4",
      title: "Events",
      resource: 'Title_Events',
      glyphicon: 'bookmark',
      trigger: "events:index",
      intern: true,
      order: 1
    }, {
      id: "1cf247f4-4c76-d453-bbec-1c40080e32e1",
      title: "Sessions",
      resource: 'Title_Sessions',
      glyphicon: 'comment',
      trigger: "sessions:index",
      intern: true,
      order: 2
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5",
      title: "Sign-in",
      resource: 'Title_SignIn',
      glyphicon: 'user',
      trigger: "signin:index",
      intern: true,
      order: 4
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4",
      title: "Debug",
      resource: 'Title_Debug',
      glyphicon: 'cog',
      trigger: "debug:index",
      intern: true,
      order: 5
    }
  ];

  return TestData;

})();

});

;require.register("models/resource", function(exports, require, module) {
var Collection, Model, Resource, ResourceCollection, config, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

module.exports.Model = Resource = (function(_super) {
  __extends(Resource, _super);

  function Resource() {
    _ref = Resource.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Resource;

})(Model);

module.exports.Collection = ResourceCollection = (function(_super) {
  __extends(ResourceCollection, _super);

  function ResourceCollection() {
    _ref1 = ResourceCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  ResourceCollection.prototype.url = "" + config.apiroot + "/resources";

  ResourceCollection.prototype.credentials = {
    username: 'admin',
    password: 'admin'
  };

  ResourceCollection.prototype.model = module.exports.Model;

  ResourceCollection.prototype.comparator = 'key';

  ResourceCollection.prototype.toJSON = function() {
    var result;
    result = {};
    this.each(function(model) {
      return result[model.get('key')] = model.get('value');
    });
    return result;
  };

  return ResourceCollection;

})(Collection);

});

;require.register("models/session", function(exports, require, module) {
var Collection, Contact, Model, SessionsCollection, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

module.exports.Model = Contact = (function(_super) {
  __extends(Contact, _super);

  function Contact() {
    _ref = Contact.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Contact;

})(Model);

module.exports.Collection = SessionsCollection = (function(_super) {
  __extends(SessionsCollection, _super);

  function SessionsCollection() {
    _ref1 = SessionsCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  SessionsCollection.prototype.url = function() {
    return "" + config.apiroot + "/events/" + (settings.get('active-event')) + "/sessions";
  };

  SessionsCollection.prototype.credentials = {
    username: 'admin',
    password: 'admin'
  };

  SessionsCollection.prototype.model = module.exports.Model;

  SessionsCollection.prototype.comparator = 'title';

  return SessionsCollection;

})(Collection);

});

;require.register("models/store", function(exports, require, module) {
var Collection, StoreCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Collection = require('../lib/base/collection');

module.exports.Collection = StoreCollection = (function(_super) {
  __extends(StoreCollection, _super);

  function StoreCollection() {
    _ref = StoreCollection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  StoreCollection.prototype.url = 'store';

  StoreCollection.prototype.localStorage = new Backbone.LocalStorage('store');

  StoreCollection.prototype.initialize = function(options) {
    return this.name = options != null ? options.name : void 0;
  };

  StoreCollection.prototype.setValue = function(id, value) {
    /*
      add or opdate an item in the collection with the specified id and value.
      if the item exists the value will be updated
    */

    var item;
    item = this.get("" + this.name + "-" + id);
    if (item != null) {
      this.remove(item);
      return this.create({
        id: "" + this.name + "-" + id,
        value: value
      });
    } else {
      return this.create({
        id: "" + this.name + "-" + id,
        value: value
      });
    }
  };

  StoreCollection.prototype.getValue = function(id) {
    /* get the value attribute for an item*/

    return this.getValueOrDefault(id, '');
  };

  StoreCollection.prototype.getValueOrDefault = function(id, val) {
    /* get the value attribute for an item*/

    var item;
    item = this.get("" + this.name + "-" + id);
    if (item != null) {
      return item.get('value');
    } else {
      return val;
    }
  };

  StoreCollection.prototype.has = function(id) {
    /* looks through the collection for the specified id*/

    var item;
    item = this.get("" + this.name + "-" + id);
    return (item != null) === true;
  };

  StoreCollection.prototype.clear = function(options) {
    var _this = this;
    return this.fetch({
      success: function(collection, response) {
        return _this.each(function(item) {
          return item.destroy({
            wait: true
          });
        });
      }
    });
  };

  return StoreCollection;

})(Collection);

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
    var View, view;
    application.trigger('set:active:header', 'Home');
    View = require('./views/home-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showSignin = function() {
    var View, view;
    application.trigger('set:active:header', 'Sign-in');
    View = require('./views/signin-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showAbout = function() {
    var View, view;
    application.trigger('set:active:header', 'About');
    View = require('./views/about-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showDebug = function() {
    var View, view;
    application.trigger('set:active:header', 'Debug');
    View = require('./views/debug-view');
    view = new View({
      resources: application.resources
    });
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
    'home': 'showHome',
    'about': 'showAbout',
    'debug': 'showDebug',
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

  DebugView.prototype.initialize = function(options) {
    return this.resources = options != null ? options.resources : void 0;
  };

  DebugView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0
    };
  };

  DebugView.prototype.onTriggerEvent = function(e) {
    var model;
    model = Backbone.Syphon.serialize(this);
    console.log('onTriggerEvent', model);
    application.trigger(model.event);
    return e.preventDefault();
  };

  DebugView.prototype.onShow = function() {
    console.log('resources', this.resources);
    return $('input.rating[type=number]').rating();
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
var HomeView, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

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
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>About</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    <p>\r\n      <a class=\"btn btn-lg btn-primary\" href=\"#\">More &raquo;</a>\r\n    </p>\r\n  </div>\r\n  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n</div>";
  });
});

;require.register("modules/common/views/templates/debug", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3>Debug</h3>\r\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n    <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    <form>\r\n      <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"your_awesome_parameter1\" id=\"some_id1\" class=\"rating\" value=\"2\" />\r\n      <textarea></textarea>\r\n\r\n      <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"your_awesome_parameter2\" id=\"some_id2\" class=\"rating\" value=\"1\" />\r\n      <textarea></textarea>\r\n      <br/>\r\n      <input type=\"text\" name=\"event\" placeholder=\"event\"/>\r\n      <button class=\"js-triggerevent\">trigger</button>\r\n      resources: "
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.TestKey1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n    </form>\r\n  </div>\r\n</div>";
  return buffer;
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
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <h3></h3>\r\n    <p></p>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/common/views/templates/signin", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <form class=\"form-signin\">\r\n      <input type=\"text\" class=\"form-control\" placeholder=\"username\" autofocus>\r\n      <input type=\"password\" class=\"form-control\" placeholder=\"password\">\r\n      <div class=\"form-group\">\r\n        <label for=\"notification1\">Remember me</label>\r\n        <div class=\"make-switch\" data-animated=\"false\" data-on-label=\"yes\" data-off-label=\"no\" data-on=\"success\">\r\n          <input type=\"radio\" id=\"notification1\">\r\n        </div>\r\n      </div>\r\n      <button class=\"btn btn-lg btn-success btn-block js-signin\">Sign in</button>\r\n    </form>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/event/controller", function(exports, require, module) {
var Controller, Event, Session, application, settings,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

settings = require('settings');

Event = require('../../models/event');

Session = require('../../models/session');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('event controller init');
    application.addInitializer(function(options) {
      _this.events = new Event.Collection();
      return _this.sessions = new Session.Collection();
    });
  }

  Controller.prototype.showEventsIndex = function() {
    return this.events.fetch({
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      var View, view;
      application.trigger('set:active:header', 'Events');
      View = require('./views/events-index-view');
      view = new View({
        collection: models,
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.showEventDetails = function(id) {
    var _this = this;
    return this.events.fetch({
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      application.trigger('set:active:header', 'Sessions');
      settings.set('active-event', id);
      return _this.sessions.fetch({
        reload: true
      }).done(function(sessions) {
        var View, view;
        View = require('./views/event-details-view');
        view = new View({
          model: models.get(id),
          collection: sessions,
          resources: application.resources
        });
        return application.layout.content.show(view);
      });
    });
  };

  Controller.prototype.showSessionDetails = function(id) {
    return this.sessions.fetch().done(function(models) {
      var View, view;
      application.trigger('set:active:header', 'Sessions');
      settings.set('active-session', id);
      View = require('./views/session-details-view');
      view = new View({
        model: models.get(id),
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.onClose = function() {
    return console.log('event controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);

});

;require.register("modules/event/router", function(exports, require, module) {
var Controller, Router, application, settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

settings = require('settings');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.appRoutes = {
    'events': 'showEventsIndex',
    'events/:id': 'showEventDetails',
    'sessions/:id': 'showSessionDetails'
  };

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('event router init');
    return application.addInitializer(function(options) {
      application.on('events:index', function() {
        application.navigate('events');
        return _this.controller.showEventsIndex();
      });
      application.on('event:details', function(id) {
        application.navigate('events/' + id);
        return _this.controller.showEventDetails(id);
      });
      return application.on('session:details', function(id) {
        application.navigate('sessions/' + id);
        return _this.controller.showSessionDetails(id);
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);

});

;require.register("modules/event/views/event-details-view", function(exports, require, module) {
var EventDetailsView, application, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = EventDetailsView = (function(_super) {
  __extends(EventDetailsView, _super);

  function EventDetailsView() {
    this.onBack = __bind(this.onBack, this);
    _ref = EventDetailsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventDetailsView.prototype.id = 'event-details-view';

  EventDetailsView.prototype.template = require('./templates/event-details');

  EventDetailsView.prototype.itemView = require('./session-item-view');

  EventDetailsView.prototype.itemViewContainer = '.js-sessions';

  EventDetailsView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return application.on('navigation:back', this.onBack);
  };

  EventDetailsView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON()
    };
  };

  EventDetailsView.prototype.itemViewOptions = function() {
    return {
      resources: this.resources
    };
  };

  EventDetailsView.prototype.onBack = function() {
    console.log('back from event-details');
    return application.trigger('events:index');
  };

  EventDetailsView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('events-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.CompositeView);

});

;require.register("modules/event/views/event-item-view", function(exports, require, module) {
var EventItemView, ItemView, application, settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = EventItemView = (function(_super) {
  __extends(EventItemView, _super);

  function EventItemView() {
    _ref = EventItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventItemView.prototype.id = 'event-item-view';

  EventItemView.prototype.template = require('./templates/event-item');

  EventItemView.prototype.tagName = 'div';

  EventItemView.prototype.className = 'list-group-item';

  EventItemView.prototype.events = {
    'click': 'onClick'
  };

  EventItemView.prototype.onClick = function(e) {
    e.preventDefault();
    this.$el.addClass('active');
    settings.set('active-event', this.model.get('id'));
    return application.trigger('event:details', this.model.get('id'));
  };

  return EventItemView;

})(ItemView);

});

;require.register("modules/event/views/events-index-view", function(exports, require, module) {
var Event, EventIndexView, application, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Event = require('../../../models/event');

module.exports = EventIndexView = (function(_super) {
  __extends(EventIndexView, _super);

  function EventIndexView() {
    _ref = EventIndexView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventIndexView.prototype.id = 'event-index-view';

  EventIndexView.prototype.template = require('./templates/events-index');

  EventIndexView.prototype.itemView = require('./event-item-view');

  EventIndexView.prototype.itemViewContainer = '.js-events';

  EventIndexView.prototype.initialize = function(options) {
    return application.on('navigation:back', this.onBack);
  };

  EventIndexView.prototype.onBack = function() {
    return console.log('back from events-index');
  };

  EventIndexView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('events-index view close');
  };

  return EventIndexView;

})(Backbone.Marionette.CompositeView);

});

;require.register("modules/event/views/session-details-view", function(exports, require, module) {
var EventDetailsView, application, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = EventDetailsView = (function(_super) {
  __extends(EventDetailsView, _super);

  function EventDetailsView() {
    this.onBack = __bind(this.onBack, this);
    _ref = EventDetailsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventDetailsView.prototype.id = 'session-details-view';

  EventDetailsView.prototype.template = require('./templates/session-details');

  EventDetailsView.prototype.initialize = function(options) {
    console.log('session id', options);
    this.resources = options != null ? options.resources : void 0;
    return application.on('navigation:back', this.onBack);
  };

  EventDetailsView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON()
    };
  };

  EventDetailsView.prototype.onBack = function() {
    console.log('back from session-details');
    return application.trigger('event:details', this.model.get('eventId'));
  };

  EventDetailsView.prototype.onShow = function() {
    $('input.rating[type=number]').rating();
    return $('textarea').autosize();
  };

  EventDetailsView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('session-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.ItemView);

});

;require.register("modules/event/views/session-item-view", function(exports, require, module) {
var ItemView, SessionItemView, application, settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = SessionItemView = (function(_super) {
  __extends(SessionItemView, _super);

  function SessionItemView() {
    _ref = SessionItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SessionItemView.prototype.id = 'session-item-view';

  SessionItemView.prototype.template = require('./templates/session-item');

  SessionItemView.prototype.tagName = 'div';

  SessionItemView.prototype.className = 'list-group-item';

  SessionItemView.prototype.events = {
    'click': 'onClick'
  };

  SessionItemView.prototype.initialize = function(options) {
    return this.resources = options != null ? options.resources : void 0;
  };

  SessionItemView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON()
    };
  };

  SessionItemView.prototype.onClick = function(e) {
    e.preventDefault();
    this.$el.addClass('active');
    settings.set('active-session', this.model.get('id'));
    return application.trigger('session:details', this.model.get('id'));
  };

  return SessionItemView;

})(ItemView);

});

;require.register("modules/event/views/templates/event-details", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-7\"><h3>Event: "
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3></div>\r\n      <div class=\"col-xs-5\">\r\n        <div class=\"btn-group pull-right\">\r\n          <button type=\"button\" class=\"btn btn-default active badge\">All</button>\r\n          <button type=\"button\" class=\"btn btn-default badge\">C#</button>\r\n          <button type=\"button\" class=\"btn btn-default badge\">Java</button>\r\n          <button type=\"button\" class=\"btn btn-default badge\">SAP</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"list-group js-sessions\">\r\n      <!-- sessions -->\r\n    </div>\r\n    <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n  </div>\r\n</div>";
  return buffer;
  });
});

;require.register("modules/event/views/templates/event-item", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div><strong>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong></div>\r\n<div class=\"glyphicon glyphicon-time\">\r\n  ";
  options = {hash:{
    'format': ("DD.MM.YYYY")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.startDate, options) : helperMissing.call(depth0, "dateFormat", depth0.startDate, options)))
    + "\r\n</div>";
  return buffer;
  });
});

;require.register("modules/event/views/templates/events-index", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"jumbotron\">\r\n    <div class=\"list-group js-events\">\r\n      <!-- events -->\r\n    </div>\r\n  </div>\r\n</div>";
  });
});

;require.register("modules/event/views/templates/session-details", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-9\"><h3>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3></div>\r\n      <div class=\"col-xs-3\">&nbsp;\r\n      </div>\r\n    </div>\r\n\r\n    <form>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question1_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n        <div class=\"col-md-9\">\r\n          <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n               name=\"rate1\" id=\"rate1\" class=\"rating\" value=\"0\" />\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question2_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n        <div class=\"col-md-9\">\r\n          <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n               name=\"rate2\" id=\"rate2\" class=\"rating\" value=\"0\" />\r\n        </div>\r\n      </div>\r\n\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question3_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n        <div class=\"col-md-9\">\r\n          <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n               name=\"rate3\" id=\"rate3\" class=\"rating\" value=\"0\" />\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question4_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n          <div class=\"col-md-9\">\r\n            <textarea name=\"question4\"></textarea>\r\n          </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question5_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n          <div class=\"col-md-9\">\r\n            <textarea name=\"question5\"></textarea>\r\n          </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.Question6_Title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n          <div class=\"col-md-9\">\r\n            <textarea name=\"question6\"></textarea>\r\n          </div>\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <div class=\"col-xs-7\">&nbsp;</div>\r\n        <div class=\"col-xs-5\"><button class=\"btn btn-primary btn-lg pull-right js-submit\">Save</button>\r\n      </div>\r\n    </form>\r\n\r\n</div>";
  return buffer;
  });
});

;require.register("modules/event/views/templates/session-item", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "<span class=\"badge pull-right\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "";
  buffer += escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + " ";
  return buffer;
  }

  buffer += "<div><strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong></div>\r\n";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n<div class=\"glyphicon glyphicon-time\">\r\n  ";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options)))
    + "-";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options)))
    + "\r\n</div>\r\n<div class=\"glyphicon glyphicon-user\">\r\n  ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.speakers), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n";
  return buffer;
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
      return new Header.TestData().addTo(_this.headers);
    });
  }

  Controller.prototype.showHeader = function() {
    var View, view;
    View = require('./views/header-view');
    view = new View.Header({
      collection: this.headers,
      resources: application.resources
    });
    return application.layout.header.show(view);
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
var ItemView, View, application, config, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

config = require('config');

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

  ItemView.prototype.initialize = function(options) {
    var _this = this;
    this.resources = options != null ? options.resources : void 0;
    return application.on('set:active:header', function(title) {
      if (title === _this.model.get('title')) {
        return _this.setActive();
      } else {
        return _this.setInactive();
      }
    });
  };

  ItemView.prototype.serializeData = function() {
    var _ref1, _ref2, _ref3,
      _this = this;
    return {
      title: (_ref1 = (_ref2 = this.resources.find((function(resource) {
        return resource.get('key') === _this.model.get('resource');
      }))) != null ? _ref2.get('value') : void 0) != null ? _ref1 : '-',
      href: this.model.get('href'),
      icon: (_ref3 = this.model.get('glyphicon')) != null ? _ref3 : config.sidebarglyphicon
    };
  };

  ItemView.prototype.onClick = function(e) {
    e.preventDefault();
    application.trigger('sidebar:hide');
    return application.trigger(this.model.get('trigger'));
  };

  ItemView.prototype.setActive = function() {
    return this.$el.addClass('active');
  };

  ItemView.prototype.setInactive = function() {
    return this.$el.removeClass('active');
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

  View.prototype.events = {
    'click #menu-toggle': 'onSidebarToggle',
    'click #menu-back': 'onBack'
  };

  View.prototype.initialize = function(options) {
    var _this = this;
    this.resources = options != null ? options.resources : void 0;
    return application.on('set:active:header', function(title) {
      return _this.setSubHeader(title);
    });
  };

  View.prototype.serializeData = function() {
    var _ref2;
    return {
      resources: (_ref2 = this.resources) != null ? _ref2.toJSON() : void 0
    };
  };

  View.prototype.itemViewOptions = function() {
    return {
      resources: this.resources
    };
  };

  View.prototype.onShow = function() {
    return this.$('.js-apptitle').text(config.apptitle);
  };

  View.prototype.onSidebarToggle = function(e) {
    e.preventDefault();
    return application.trigger('sidebar:toggle');
  };

  View.prototype.onBack = function(e) {
    e.preventDefault();
    return application.trigger('navigation:back');
  };

  View.prototype.setSubHeader = function(title) {
    return this.$('.js-subtitle').text(title);
  };

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
    + "\">\r\n  <span class=\"glyphicon glyphicon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></span>\r\n  &nbsp;";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n</a>";
  return buffer;
  });
});

;require.register("modules/header/views/templates/header", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <!-- Sidebar -->\r\n  <div id=\"sidebar-wrapper\">\r\n    <ul class=\"sidebar-nav js-headers\">\r\n      <!-- <li class=\"sidebar-brand\">\r\n        <a id=\"menu-toggle\" href=\"#\">&nbsp;&nbsp;&nbsp;&nbsp; -->\r\n          <!-- <span class=\"glyphicon glyphicon-align-justify\"></span> -->\r\n        <!-- </a>\r\n      </li> -->\r\n      <!-- headers -->\r\n    </ul>\r\n  </div>\r\n\r\n  <!-- Page header -->\r\n  <div id=\"page-content-wrapper\">\r\n    <div class=\"content-header row\">\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-toggle\" href=\"#\" class=\"btn btn-primary pull-left\">\r\n           <span class=\"glyphicon glyphicon-align-justify\"></span>\r\n        </a>\r\n      </div>\r\n      <div class=\"col-xs-8 col-md-10\">\r\n        <div>\r\n          <div class=\"content-header-title js-apptitle\"></div>\r\n          <div class=\"content-header-subtitle js-subtitle\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-back\" href=\"#\" class=\"btn btn-default pull-right\">\r\n          <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n        </a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!--\r\n  <div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <div class=\"container\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"http://brunch.io\">Brunch</a>\r\n    </div>\r\n    <div class=\"navbar-collapse collapse no-transition\">\r\n      <ul class=\"nav navbar-nav\">\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div> -->";
  });
});

;require.register("settings", function(exports, require, module) {
var Settings, Store;

Store = require('models/store');

Settings = (function() {
  /*
    encapsulates local storage (persistent)
  */

  function Settings() {
    /* initializes this instance*/

    console.log('settings store init');
    this.store = new Store.Collection({
      name: 'settings'
    });
    _.extend(this, Backbone.Events);
    this.store.fetch({
      async: false
    });
  }

  Settings.prototype.set = function(id, value) {
    /*
      add or opdate an item in the collection with the specified id and value.
      if the item exists the value will be updated
    */

    return this.store.setValue(id, value);
  };

  Settings.prototype.get = function(id) {
    /* get the value attribute for an item*/

    return this.store.getValue(id);
  };

  Settings.prototype.getValueOrDefault = function(id, val) {
    /* get the value attribute for an item*/

    return this.store.getValueOrDefault(id, val);
  };

  Settings.prototype.has = function(id) {
    /* looks through the collection for the specified id*/

    return this.store.has(id);
  };

  Settings.prototype.clear = function(options) {
    return this.store.clear(options);
  };

  return Settings;

})();

module.exports = new Settings();

});

;
//@ sourceMappingURL=app.js.map