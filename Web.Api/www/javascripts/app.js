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
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
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
var Application, Resource, config, settings, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/marionette-renderer');

require('lib/view-helper');

config = require('config');

settings = require('settings');

vent = require('vent');

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
    this.resources.fetch({
      data: {
        language: 'de-DE'
      }
    }).done(function(resources) {
      return vent.trigger('resources:loaded');
    });
    settings.set('last-visit', moment());
    return this.start();
  };

  Application.prototype.checkauth = function(trigger) {
    return console.log('checkauth', trigger);
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

  Config.prototype.apiroot = '/api/v1';

  Config.prototype.apitimeout = 60000;

  Config.prototype.startuptrigger = 'events:index';

  Config.prototype.signintrigger = 'signin:index';

  Config.prototype.brandtrigger = 'events:index';

  Config.prototype.layout = 'layouts/app-layout';

  Config.prototype.sidebarglyphicon = 'minus';

  Config.prototype.spinneractive = false;

  Config.prototype.modules = {
    'header': 'modules/header/router',
    'common': 'modules/common/router',
    'event': 'modules/event/router',
    'admin': 'modules/admin/router'
  };

  return Config;

})();

module.exports = new Config();
});

;require.register("initialize", function(exports, require, module) {
var app, config;

app = require('application');

config = require('config');

$(function() {
  $.ajaxSetup({
    timeout: config.apitimeout
  });
  $.blockUI.defaults.fadeIn = 50;
  $.blockUI.defaults.fadeOut = 150;
  FastClick.attach(document.body);
  return app.initialize();
});
});

;require.register("layouts/app-layout", function(exports, require, module) {
var AppLayout, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

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
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"wrapper\">\r\n\r\n  <div id=\"header\" class=\"container\"></div>\r\n  <div class=\"page-content inset\">\r\n    <div id=\"content\" class=\"container\"></div>\r\n  </div>\r\n  <div id=\"messagebox\"></div>\r\n  <hr/>\r\n  <div id=\"footer\" class=\"container\"></div>\r\n\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("lib/base/collection", function(exports, require, module) {
var Collection, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Collection.prototype.initialize = function(attributes, options) {
    return this.bind("error", this.errorHandler);
  };

  Collection.prototype.errorHandler = function(model, error) {
    if (error.status === 404) {
      console.warn('NOTFOUND', error);
      vent.trigger('sync:fail:notfound', error);
    }
    if (error.status === 500) {
      console.warn('SERVERERROR', error);
      return vent.trigger('sync:fail:servererror', error);
    } else if (error.status === 401 || error.status === 403) {
      console.warn('UNAUTHORIZED', error);
      return vent.trigger('sync:fail:unauthorized', error);
    } else {
      console.warn('UNKNOWN', error);
      return vent.trigger('sync:fail:unknown', error);
    }
  };

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

  Collection.prototype.fetch = function(options) {
    console.log('fetch:start', this.constructor.name);
    this.trigger('fetch:start');
    vent.trigger('fetch:start');
    return Collection.__super__.fetch.call(this, options).done(function(collection, response, options) {
      this.trigger('fetch:done');
      vent.trigger('fetch:done');
      return console.log('fetch:off', this.constructor.name, collection, response, options);
    }).fail(function(collection, response, options) {
      vent.trigger('fetch:fail');
      return console.warn('fetch:fail', this.constructor.name, collection, response, options);
    });
  };

  return Collection;

})(Backbone.Collection);
});

;require.register("lib/base/item-view", function(exports, require, module) {
var ItemView, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

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
var Model, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Model.prototype.initialize = function(attributes, options) {
    return this.bind("error", this.errorHandler);
  };

  Model.prototype.errorHandler = function(model, error) {
    if (error.status === 404) {
      console.warn('NOTFOUND', error);
      vent.trigger('sync:fail:notfound', error);
    }
    if (error.status === 500) {
      console.warn('SERVERERROR', error);
      return vent.trigger('sync:fail:servererror', error);
    } else if (error.status === 401 || error.status === 403) {
      console.warn('UNAUTHORIZED', error);
      return vent.trigger('sync:fail:unauthorized', error);
    } else {
      console.warn('UNKNOWN', error);
      return vent.trigger('sync:fail:unknown', error);
    }
  };

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

Handlebars.registerHelper("dateFormat", function(context, options) {
  var f;
  if (window.moment) {
    f = options.hash.format || "MMM DD, YYYY hh:mm:ss A";
    return moment(context).format(f);
  } else {
    return context;
  }
});

Handlebars.registerHelper("ifCond", function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
});
});

;require.register("models/event", function(exports, require, module) {
var Collection, Event, EventsCollection, Model, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

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

  EventsCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  EventsCollection.prototype.model = module.exports.Model;

  EventsCollection.prototype.comparator = 'title';

  return EventsCollection;

})(Collection);
});

;require.register("models/eventreport", function(exports, require, module) {
var Collection, EventReport, EventReportsCollection, Model, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

module.exports.Model = EventReport = (function(_super) {
  __extends(EventReport, _super);

  function EventReport() {
    _ref = EventReport.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return EventReport;

})(Model);

module.exports.Collection = EventReportsCollection = (function(_super) {
  __extends(EventReportsCollection, _super);

  function EventReportsCollection() {
    _ref1 = EventReportsCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  EventReportsCollection.prototype.url = function() {
    return "" + config.apiroot + "/events/" + (settings.get('active-event')) + "/report";
  };

  EventReportsCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  EventReportsCollection.prototype.model = module.exports.Model;

  EventReportsCollection.prototype.comparator = 'title';

  return EventReportsCollection;

})(Collection);
});

;require.register("models/feedback", function(exports, require, module) {
var Collection, Feedback, FeedbacksCollection, Model, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = Feedback = (function(_super) {
  __extends(Feedback, _super);

  function Feedback() {
    _ref = Feedback.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Feedback;

})(Model);

module.exports.Collection = FeedbacksCollection = (function(_super) {
  __extends(FeedbacksCollection, _super);

  function FeedbacksCollection() {
    _ref1 = FeedbacksCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  FeedbacksCollection.prototype.url = "" + config.apiroot + "/feedbacks";

  FeedbacksCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  FeedbacksCollection.prototype.model = module.exports.Model;

  return FeedbacksCollection;

})(Collection);
});

;require.register("models/feedbackdefinition", function(exports, require, module) {
var Collection, FeedbackDefinition, FeedbackDefinitionsCollection, Model, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = FeedbackDefinition = (function(_super) {
  __extends(FeedbackDefinition, _super);

  function FeedbackDefinition() {
    _ref = FeedbackDefinition.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return FeedbackDefinition;

})(Model);

module.exports.Collection = FeedbackDefinitionsCollection = (function(_super) {
  __extends(FeedbackDefinitionsCollection, _super);

  function FeedbackDefinitionsCollection() {
    _ref1 = FeedbackDefinitionsCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  FeedbackDefinitionsCollection.prototype.url = "" + config.apiroot + "/feedbackdefinitions";

  FeedbackDefinitionsCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  FeedbackDefinitionsCollection.prototype.model = module.exports.Model;

  FeedbackDefinitionsCollection.prototype.comparator = 'title';

  return FeedbackDefinitionsCollection;

})(Collection);
});

;require.register("models/header", function(exports, require, module) {
var Collection, Header, HeadersCollection, Model, TestData, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

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

  HeadersCollection.prototype.active = function(roles) {
    var filtered,
      _this = this;
    filtered = this.filter(function(item) {
      var visible, _ref2;
      console.log('---->', item.get('title'), item.get('roles'), '>', roles);
      visible = (_ref2 = item.get('visible')) != null ? _ref2 : true;
      if (visible && _.isEmpty(item.get('roles'))) {
        return true;
      }
      if (visible && !_.isEmpty(roles) && _.intersection(roles, item.get('roles')).length > 0) {
        return true;
      }
    });
    console.log('=============>', filtered);
    return new HeadersCollection(filtered);
  };

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
      visible: true,
      authenticated: false,
      resource: 'Title_Home',
      glyphicon: 'home',
      title: "Home",
      trigger: "home:index",
      intern: true,
      order: 0
    }, {
      id: "ce82ceb6-1104-aaa6-4fab-a4656694de17",
      title: "About",
      authenticated: false,
      resource: 'Title_About',
      glyphicon: 'info-sign',
      trigger: "about:index",
      intern: true,
      order: 3
    }, {
      id: "1cf247f4-4c76-d453-bbec-1c40080e32e4",
      title: "Events",
      authenticated: true,
      roles: ['User', 'Administrator'],
      resource: 'Title_Events',
      glyphicon: 'bookmark',
      trigger: "events:index",
      intern: true,
      order: 1
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5",
      title: "Sign-in",
      authenticated: false,
      resource: 'Title_SignIn',
      glyphicon: 'user',
      trigger: "signin:index",
      intern: true,
      order: 4
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4",
      title: "Debug",
      authenticated: false,
      resource: 'Title_Debug',
      glyphicon: 'cog',
      trigger: "debug:index",
      intern: true,
      order: 5
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b890",
      title: "-",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: '',
      trigger: "-",
      intern: true,
      order: 10
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f6",
      title: "Admin - Events",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: 'bookmark',
      trigger: "admin:events:edit",
      intern: true,
      order: 11
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f7",
      title: "Admin - Settings",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: 'cog',
      trigger: "admin:settings:index",
      intern: true,
      order: 12
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f9",
      title: "Admin - Users",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: 'user',
      trigger: "admin:users:edit",
      intern: true,
      order: 14
    }
  ];

  return TestData;

})();
});

;require.register("models/resource", function(exports, require, module) {
var Collection, Model, Resource, ResourceCollection, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

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

  ResourceCollection.prototype.model = module.exports.Model;

  ResourceCollection.prototype.comparator = 'key';

  ResourceCollection.prototype.key = function(key) {
    var result, _ref2,
      _this = this;
    result = this.find(function(model) {
      console.log(model.get('key'), key);
      return model.get('key') === key;
    });
    return (_ref2 = result != null ? result.get('value') : void 0) != null ? _ref2 : '';
  };

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

;require.register("models/role", function(exports, require, module) {
var Collection, Model, Role, RolesCollection, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = Role = (function(_super) {
  __extends(Role, _super);

  function Role() {
    _ref = Role.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Role;

})(Model);

module.exports.Collection = RolesCollection = (function(_super) {
  __extends(RolesCollection, _super);

  function RolesCollection() {
    _ref1 = RolesCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  RolesCollection.prototype.url = "" + config.apiroot + "/admin/roles";

  RolesCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  RolesCollection.prototype.model = module.exports.Model;

  RolesCollection.prototype.comparator = 'name';

  RolesCollection.prototype.toArray = function() {
    var roles,
      _this = this;
    roles = [["", ""]];
    this.each(function(role) {
      return roles.push([role.get('name'), role.get('name')]);
    });
    return roles;
  };

  return RolesCollection;

})(Collection);
});

;require.register("models/session", function(exports, require, module) {
var Collection, Model, Session, SessionsCollection, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

module.exports.Model = Session = (function(_super) {
  __extends(Session, _super);

  function Session() {
    _ref = Session.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Session;

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

  SessionsCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
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

;require.register("models/user", function(exports, require, module) {
var Collection, Model, User, UsersCollection, config, settings, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return User;

})(Model);

module.exports.Collection = UsersCollection = (function(_super) {
  __extends(UsersCollection, _super);

  function UsersCollection() {
    _ref1 = UsersCollection.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  UsersCollection.prototype.url = "" + config.apiroot + "/admin/users";

  UsersCollection.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  UsersCollection.prototype.model = module.exports.Model;

  UsersCollection.prototype.comparator = 'name';

  return UsersCollection;

})(Collection);
});

;require.register("models/userprofile", function(exports, require, module) {
var Model, UserProfile, config, settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

settings = require('../settings');

module.exports.Model = UserProfile = (function(_super) {
  __extends(UserProfile, _super);

  function UserProfile() {
    _ref = UserProfile.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UserProfile.prototype.urlRoot = function() {
    return "" + config.apiroot + "/user/profile";
  };

  UserProfile.prototype.credentials = function() {
    return {
      token: settings.get('api_token')
    };
  };

  return UserProfile;

})(Model);
});

;require.register("models/usertoken", function(exports, require, module) {
var Model, UserToken, config, settings, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

settings = require('../settings');

module.exports.Model = UserToken = (function(_super) {
  __extends(UserToken, _super);

  function UserToken() {
    _ref = UserToken.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UserToken.prototype.urlRoot = function() {
    return "" + config.apiroot + "/user/token";
  };

  return UserToken;

})(Model);
});

;require.register("modules/admin/controller", function(exports, require, module) {
var Controller, Event, Role, Session, User, application, settings, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

Event = require('../../models/event');

Session = require('../../models/session');

User = require('../../models/user');

Role = require('../../models/role');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    this.onSaveUsers = __bind(this.onSaveUsers, this);
    this.showUsersGenerator = __bind(this.showUsersGenerator, this);
    this.showUsersEdit = __bind(this.showUsersEdit, this);
    var _this = this;
    console.log('admin controller init');
    application.addInitializer(function(options) {
      _this.events = new Event.Collection();
      _this.sessions = new Session.Collection();
      _this.users = new User.Collection();
      _this.roles = new Role.Collection();
      return vent.on('save:users', function() {
        return _this.onSaveUsers();
      });
    });
  }

  Controller.prototype.showEventsEdit = function() {
    return this.events.fetch({
      reload: true,
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      var View, view;
      vent.trigger('set:active:header', 'admin:events:edit', application.resources.key('Title_Events'), 'bookmark');
      View = require('./views/events-edit-view');
      view = new View({
        collection: models,
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.showSessionsEdit = function(id) {
    var _this = this;
    return this.events.fetch({
      data: {
        filter: 'all'
      }
    }).done(function(events) {
      settings.set('active-event', id);
      return _this.sessions.fetch({
        reload: true
      }).done(function(sessions) {
        var View, view;
        vent.trigger('set:active:header', 'admin:events:edit', application.resources.key('Title_Sessions'), 'comment');
        View = require('./views/sessions-edit-view');
        view = new View({
          model: events.get(id),
          collection: sessions,
          resources: application.resources
        });
        return application.layout.content.show(view);
      });
    });
  };

  Controller.prototype.showUsersEdit = function() {
    var _this = this;
    this.users.reset();
    return this.roles.fetch({
      reload: true
    }).done(function(roles) {
      return _this.users.fetch({
        reload: true,
        data: {
          filter: 'all'
        }
      }).done(function(users) {
        var View, view;
        vent.trigger('set:active:header', 'admin:users:edit', application.resources.key('Title_Admin_Users'), 'user');
        users.on('change', function(model) {
          console.log('user change:', model);
          model.credentials = users.credentials;
          return model.set('dirty', true, {
            silent: true
          });
        });
        View = require('./views/users-edit-view');
        view = new View({
          collection: users,
          roles: roles,
          resources: application.resources
        });
        return application.layout.content.show(view);
      });
    });
  };

  Controller.prototype.showUsersGenerator = function() {
    var _this = this;
    this.users.reset();
    return this.roles.fetch({
      reload: true
    }).done(function(roles) {
      var View, view;
      _this.users.on('add', function(model) {
        console.log('user add:', model);
        model.credentials = _this.users.credentials;
        return model.set('dirty', true, {
          silent: true
        });
      });
      View = require('./views/users-generator-view');
      view = new View({
        collection: _this.users,
        roles: roles,
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.onSaveUsers = function() {
    return this.users.each(function(model) {
      if (model.get('dirty') && model.get('userName') !== '') {
        return model.save(null, {
          success: function(model, response, options) {
            return model.set('dirty', false, {
              silent: true
            });
          },
          error: function(model, xhr, options) {
            return console.warn('user save error', model);
          }
        });
      }
    });
  };

  Controller.prototype.onClose = function() {
    return console.log('admin controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);
});

;require.register("modules/admin/router", function(exports, require, module) {
var Controller, Router, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.appRoutes = {
    'admin/events': 'showEventsEdit',
    'admin/events/:id': 'showSessionsEdit',
    'admin/users': 'showUsersEdit',
    'admin/usersgenerator': 'showUsersGenerator'
  };

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('admin router init');
    return application.addInitializer(function(options) {
      application.on('admin:events:edit', function() {
        application.navigate('admin/events');
        return _this.controller.showEventsEdit();
      });
      application.on('admin:sessions:edit', function(id) {
        application.navigate('admin/events/' + id);
        return _this.controller.showSessionsEdit(id);
      });
      application.on('admin:users:edit', function() {
        application.navigate('admin/users');
        return _this.controller.showUsersEdit();
      });
      return application.on('admin:users:generator', function() {
        application.navigate('admin/usersgenerator');
        return _this.controller.showUsersGenerator();
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/admin/views/events-edit-view", function(exports, require, module) {
var EventsEditView, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = EventsEditView = (function(_super) {
  __extends(EventsEditView, _super);

  function EventsEditView() {
    _ref = EventsEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventsEditView.prototype.id = 'events-edit-view';

  EventsEditView.prototype.template = require('./templates/events-edit');

  EventsEditView.prototype.initialize = function(options) {
    return this.resources = options != null ? options.resources : void 0;
  };

  EventsEditView.prototype.onShow = function() {
    var columns, grid;
    columns = [
      {
        name: "id",
        label: "ID",
        editable: false,
        cell: 'string'
      }, {
        name: "title",
        label: "Title",
        cell: "string"
      }, {
        name: "description",
        label: "Description",
        cell: "string"
      }
    ];
    grid = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
    });
    return $("#js-table").append(grid.render().$el);
  };

  return EventsEditView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/admin/views/sessions-edit-view", function(exports, require, module) {
var SessionsEditView, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = SessionsEditView = (function(_super) {
  __extends(SessionsEditView, _super);

  function SessionsEditView() {
    _ref = SessionsEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SessionsEditView.prototype.id = 'sessions-edit-view';

  SessionsEditView.prototype.template = require('./templates/sessions-edit');

  SessionsEditView.prototype.initialize = function(options) {
    return this.resources = options != null ? options.resources : void 0;
  };

  SessionsEditView.prototype.onShow = function() {
    var columns, grid;
    columns = [
      {
        name: "id",
        label: "ID",
        editable: false,
        cell: 'string'
      }, {
        name: "title",
        label: "Title",
        cell: "string"
      }, {
        name: "description",
        label: "Description",
        cell: "string"
      }
    ];
    grid = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
    });
    return $("#js-table").append(grid.render().$el);
  };

  return SessionsEditView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/admin/views/templates/events-edit", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\" id=\"js-table\">\r\n  EVENTS EDIT\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/admin/views/templates/sessions-edit", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\" id=\"js-table\">\r\n  SESSIONS EDIT\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/admin/views/templates/users-edit", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>\r\n  <button type=\"button\" id=\"js-add\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-plus\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-refresh\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-refresh\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-generate\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-user\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-save\" class=\"btn btn-success btn-lg\">\r\n    <span class=\"glyphicon glyphicon-save\"></span>\r\n  </button>\r\n</p>\r\n\r\n<p>\r\n  <div class=\"container\" id=\"js-table\">\r\n    <!-- table here -->\r\n  </div>\r\n</p>\r\n\r\n<p>\r\n  <button type=\"button\" id=\"js-add\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-plus\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-refresh\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-refresh\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-generate\" class=\"btn btn-default btn-lg\">\r\n    <span class=\"glyphicon glyphicon-user\"></span>\r\n  </button>\r\n  <button type=\"button\" id=\"js-save\" class=\"btn btn-success btn-lg\">\r\n    <span class=\"glyphicon glyphicon-save\"></span>\r\n  </button>\r\n</p>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/admin/views/templates/users-generator-item", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "﻿<div>\r\n  <!--<div class=\"glyphicon glyphicon-user\"></div>-->\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-xs-6\">\r\n      <h3 style=\"color: #000000;\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.userName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "&emsp;/&emsp;"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.password)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\r\n    </div>\r\n    <div class=\"col-xs-6\">\r\n      <img class=\"qr\" height=\"88\" width=\"88\"/>\r\n    </div>\r\n    <div class=\"col-xs-6\"></div>\r\n  </div>\r\n  <a href=\"https://eventfeedback.azurewebsites.net\">https://eventfeedback.azurewebsites.net</a>\r\n</div>\r\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/admin/views/templates/users-generator", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n          <option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n          ";
  return buffer;
  }

  buffer += "﻿<div class=\"container\">\r\n  <form class=\"form-horizontal noprint\" role=\"form\">\r\n    <div class=\"form-group\">\r\n      <label for=\"amount\" class=\"col-sm-4 control-label\">Amount</label>\r\n      <div class=\"col-sm-8\">\r\n        <select name=\"amount\" id=\"amount\" class=\"form-control\">\r\n          <option value=\"1\">1</option>\r\n          <option value=\"10\">10</option>\r\n          <option value=\"25\">25</option>\r\n          <option value=\"50\">50</option>\r\n          <option value=\"100\">100</option>\r\n        </select>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"prefix\" class=\"col-sm-4 control-label\">Prefix</label>\r\n      <div class=\"col-sm-8\">\r\n        <input type=\"text\" class=\"form-control\" name=\"prefix\" id=\"prefix\" placeholder=\"\"></input>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"roles\" class=\"col-sm-4 control-label\">Role</label>\r\n      <div class=\"col-sm-8\">\r\n        <select name=\"roles\" id=\"roles\" class=\"form-control\">\r\n          <option value=\"\"></option>\r\n          ";
  stack1 = helpers.each.call(depth0, depth0.roles, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </select>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <button type=\"button\" id=\"js-generate\" class=\"btn btn-success btn-lg\">\r\n          <span class=\"glyphicon glyphicon-user\"></span>&emsp;Generate</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n  \r\n  <div class=\"list-group js-users\" style=\"margin-top:39px;\">\r\n    <!-- users -->\r\n  </div>\r\n</div>\r\n\r\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/admin/views/users-edit-view", function(exports, require, module) {
var UsersEditView, application, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = UsersEditView = (function(_super) {
  __extends(UsersEditView, _super);

  function UsersEditView() {
    this.onBack = __bind(this.onBack, this);
    _ref = UsersEditView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UsersEditView.prototype.id = 'users-edit-view';

  UsersEditView.prototype.template = require('./templates/users-edit');

  UsersEditView.prototype.events = {
    'click #js-add': 'onAdd',
    'click #js-save': 'onSave',
    'click #js-generate': 'onGenerate'
  };

  UsersEditView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    this.roles = options != null ? options.roles : void 0;
    application.trigger('navigation:back:on');
    return application.on('navigation:back', this.onBack);
  };

  UsersEditView.prototype.onShow = function() {
    var columns, grid, _ref1;
    columns = [
      {
        name: "active",
        label: "Active",
        cell: "boolean"
      }, {
        name: "userName",
        label: "userName",
        editable: true,
        cell: "string"
      }, {
        name: "password",
        label: "Password",
        editable: true,
        cell: "string"
      }, {
        name: "roles",
        label: "Role",
        cell: Backgrid.SelectCell.extend({
          optionValues: (_ref1 = this.roles) != null ? _ref1.toArray() : void 0
        })
      }, {
        name: "organization",
        label: "Organization",
        cell: "string"
      }, {
        name: "email",
        label: "Email",
        cell: "string"
      }
    ];
    grid = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
    });
    return $("#js-table").append(grid.render().$el);
  };

  UsersEditView.prototype.onAdd = function() {
    return this.collection.add({
      dirty: true,
      silent: true
    });
  };

  UsersEditView.prototype.onSave = function() {
    return vent.trigger('save:users');
  };

  UsersEditView.prototype.onGenerate = function() {
    return application.trigger('admin:users:generator');
  };

  UsersEditView.prototype.onBack = function() {
    return application.trigger('admin:users:edit');
  };

  return UsersEditView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/admin/views/users-generator-item-view", function(exports, require, module) {
var ItemView, UsersGeneratorItemView, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = UsersGeneratorItemView = (function(_super) {
  __extends(UsersGeneratorItemView, _super);

  function UsersGeneratorItemView() {
    _ref = UsersGeneratorItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UsersGeneratorItemView.prototype.id = 'users-generator-item-view';

  UsersGeneratorItemView.prototype.template = require('./templates/users-generator-item');

  UsersGeneratorItemView.prototype.tagName = 'div';

  UsersGeneratorItemView.prototype.className = 'list-group-item';

  UsersGeneratorItemView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return console.log('--------', options);
  };

  UsersGeneratorItemView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON()
    };
  };

  return UsersGeneratorItemView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/admin/views/users-generator-view", function(exports, require, module) {
var UsersGeneratorView, application, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = UsersGeneratorView = (function(_super) {
  __extends(UsersGeneratorView, _super);

  function UsersGeneratorView() {
    this.onBack = __bind(this.onBack, this);
    _ref = UsersGeneratorView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UsersGeneratorView.prototype.id = 'users-generator-view';

  UsersGeneratorView.prototype.template = require('./templates/users-generator');

  UsersGeneratorView.prototype.itemView = require('./users-generator-item-view');

  UsersGeneratorView.prototype.itemViewContainer = '.js-users';

  application.trigger('navigation:back:on');

  application.on('navigation:back', UsersGeneratorView.onBack);

  UsersGeneratorView.prototype.events = {
    'click #js-generate': 'onGenerate'
  };

  UsersGeneratorView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return this.roles = options != null ? options.roles : void 0;
  };

  UsersGeneratorView.prototype.serializeData = function() {
    var _ref1, _ref2;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      roles: (_ref2 = this.roles) != null ? _ref2.pluck('name') : void 0
    };
  };

  UsersGeneratorView.prototype.itemViewOptions = function() {
    return {
      resources: this.resources
    };
  };

  UsersGeneratorView.prototype.onGenerate = function(e) {
    var data, i, _i, _ref1;
    e.preventDefault();
    this.collection.reset();
    data = Backbone.Syphon.serialize(this);
    for (i = _i = 1, _ref1 = data.amount; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
      this.collection.add({
        userName: data.prefix + this.makeid() + i,
        password: this.makeid(),
        roles: data.roles,
        active: true,
        dirty: true
      });
    }
    console.log('new users', this.collection);
    return vent.trigger('save:users');
  };

  UsersGeneratorView.prototype.makeid = function() {
    var i, possible, text;
    text = '';
    possible = 'abcdefghjkmnpqrstuvwxy23456789';
    i = 0;
    while (i < 5) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      i++;
    }
    return text;
  };

  UsersGeneratorView.prototype.onSave = function() {
    return vent.trigger('save:users');
  };

  UsersGeneratorView.prototype.onBack = function() {
    return application.trigger('admin:users:edit');
  };

  return UsersGeneratorView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/common/controller", function(exports, require, module) {
var Controller, UserProfile, UserToken, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

UserProfile = require('../../models/userprofile');

UserToken = require('../../models/usertoken');

vent = require('vent');

settings = require('settings');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('about controller init');
    application.addInitializer(function(options) {
      vent.on('view:signin:do', function(data) {
        if (!_.isEmpty(data.username) && !_.isEmpty(data.password)) {
          settings.set('api_token', '');
          settings.set('api_token_expires', '');
          settings.set('api_authenticated', false);
          settings.set('api_username', data.username);
          settings.set('api_remember', data.remember === 'on');
          settings.set('api_userroles', []);
          return _this.doSignin(data.username, data.password);
        }
      });
      vent.on('message:success:show', function(data) {
        return _this.showMessage(data, 'success');
      });
      return vent.on('message:error:show', function(data) {
        return _this.showMessage(data, 'danger');
      });
    });
  }

  Controller.prototype.showMessage = function(data, type) {
    $('#messagebox').append('<div id="currentmessage" class="alert alert-' + type + '"><a class="close" data-dismiss="alert">×</a><span>' + data + '</span></div>');
    return setTimeout(function() {
      return $("#currentmessage").remove();
    }, 3000);
  };

  Controller.prototype.showHome = function() {
    var View, view;
    vent.trigger('set:active:header', 'home:index', '', 'home');
    View = require('./views/home-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showSignin = function() {
    var View, view;
    vent.trigger('set:active:header', 'signin:index', application.resources.key('Title_SignIn'), 'user');
    View = require('./views/signin-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showAbout = function() {
    var View, view;
    vent.trigger('set:active:header', 'about:index', application.resources.key('Title_About'), 'info-sign');
    View = require('./views/about-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showDebug = function() {
    var View, view;
    vent.trigger('set:active:header', 'debug:index', application.resources.key('Title_Debug'), 'cog');
    View = require('./views/debug-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.doSignin = function(username, password) {
    var userToken,
      _this = this;
    vent.trigger('fetch:start');
    userToken = new UserToken.Model({
      userName: username,
      password: password
    });
    return userToken.save(null, {
      success: function(model, response, options) {
        var profile;
        settings.set('api_token', userToken.get('accessToken'));
        settings.set('api_token_expires', userToken.get('expires'));
        settings.set('api_authenticated', true);
        profile = new UserProfile.Model();
        return profile.fetch({
          success: function(model, response, options) {
            settings.set('api_userroles', _.map(model.get('profile').roles, function(role) {
              return role.role.name;
            }));
            vent.trigger('message:success:show', 'signed in ' + username);
            return vent.trigger('navigation:signin');
          },
          error: function(model, xhr, options) {
            return vent.trigger('navigation:signout');
          }
        });
      },
      error: function(model, xhr, options) {
        vent.trigger('message:error:show', 'sign in failed');
        vent.trigger('navigation:signout');
        return vent.trigger('fetch:fail');
      }
    });
  };

  return Controller;

})(Backbone.Marionette.Controller);
});

;require.register("modules/common/router", function(exports, require, module) {
var Controller, Router, application, config, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

Controller = require('./controller');

config = require('config');

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
      vent.on('sync:fail:unauthorized', function() {
        return application.trigger(config.signintrigger);
      });
      vent.on('sync:fail:servererror', function() {
        return console.warn('sync:server error');
      });
      vent.on('sync:fail:unknown', function() {
        return console.warn('sync:unknown error');
      });
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
var AboutView, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = AboutView = (function(_super) {
  __extends(AboutView, _super);

  function AboutView() {
    _ref = AboutView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AboutView.prototype.id = 'about-view';

  AboutView.prototype.template = require('./templates/about');

  AboutView.prototype.initialize = function(options) {
    return application.trigger('navigation:back:off');
  };

  AboutView.prototype.onClose = function() {
    return console.log('about view close');
  };

  return AboutView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/debug-view", function(exports, require, module) {
var DebugView, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

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
    this.resources = options != null ? options.resources : void 0;
    return application.trigger('navigation:back:off');
  };

  DebugView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      user: settings.get('api_username'),
      roles: settings.get('api_userroles')
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
    return console.log('resources', this.resources);
  };

  DebugView.prototype.onClose = function() {
    return console.log('debug view close');
  };

  return DebugView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/footer-view", function(exports, require, module) {
var FooterView, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

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
var HomeView, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = require('./templates/home');

  HomeView.prototype.initialize = function(options) {
    return application.trigger('navigation:back:off');
  };

  HomeView.prototype.onClose = function() {
    return console.log('home view close');
  };

  return HomeView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/signin-view", function(exports, require, module) {
var SigninView, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

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

  SigninView.prototype.initialize = function(options) {
    return application.trigger('navigation:back:off');
  };

  SigninView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      username: settings.get('api_remember') ? settings.get('api_username') : void 0,
      remember: settings.get('api_remember') ? settings.get('api_remember') : void 0
    };
  };

  SigninView.prototype.onSignin = function(e) {
    var data;
    e.preventDefault();
    data = Backbone.Syphon.serialize(this);
    return vent.trigger('view:signin:do', data);
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
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>App</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-primary\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.App\" target=\"_blank\">sources</a>\r\n      </p>\r\n      <ul>\r\n        <li>Backbone 1.1.0</li>\r\n        <li>Underscore 1.5.2</li>\r\n        <li>Twitter Bootstrap 3.0.0</li>\r\n        <li>MarionetteJS 1.2.2</li>\r\n        <li>MomentJS 2.2.1</li>\r\n        <li>jQuery 2.0.3</li>\r\n        <li>JQuery RateIt 1.0.19</li>\r\n        <li>Fastclick 0.6.10</li>\r\n        <li>Pace 0.4.15</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <h3>Api</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-primary\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.Api\" target=\"_blank\">sources</a>\r\n      </p>\r\n      <ul>\r\n        <li>C#</li>\r\n        <li>Microsoft Web Api 2</li>\r\n        <li>Microsoft Entity Framework 6.0</li>\r\n        <li>Microsoft AspNet Identity 6.0</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>Dev</h3>\r\n      <ul>\r\n        <li>\r\n          <a href=\"https://github.com/joyent/node\" target=\"_blank\">Node.js</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/brunch/brunch\" target=\"_blank\">Brunch</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/jashkenas/coffee-script\" target=\"_blank\">Coffeescript</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/bower/bower\" target=\"_blank\">Bower</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <h3>&nbsp;</h3>\r\n      <!--<img src=\"http://qrfree.kaywa.com/?l=1&s=8&d=https%3A%2F%2Feventfeedback.azurewebsites.net\" alt=\"QRCode\"/>-->\r\n      <img class=\"qr\" height=\"88\" width=\"88\"/>\r\n    </div>\r\n  </div>\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/common/views/templates/debug", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n  <h3>Debug</h3>\r\n  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n  <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n  <form>\r\n    <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n           name=\"your_awesome_parameter1\" id=\"some_id1\" class=\"rating\" value=\"2\" />\r\n    <textarea></textarea>\r\n\r\n    <input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n           name=\"your_awesome_parameter2\" id=\"some_id2\" class=\"rating\" value=\"1\" />\r\n    <textarea></textarea>\r\n    <br/>\r\n    <input type=\"text\" name=\"event\" placeholder=\"event\"/>\r\n    <button class=\"js-triggerevent\">trigger</button>\r\n    <br/>user: ";
  if (stack1 = helpers.user) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.user; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n    <br/>roles: ";
  if (stack1 = helpers.roles) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.roles; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n    <br/>resources: "
    + escapeExpression(((stack1 = ((stack1 = depth0.resources),stack1 == null || stack1 === false ? stack1 : stack1.TestKey1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n  </form>\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/common/views/templates/footer", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/common/views/templates/home", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <h3>Home</h3>\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/common/views/templates/signin", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "checked";
  }

  buffer += "<div class=\"container\">\r\n  <form class=\"form-signin\">\r\n    <input type=\"text\" class=\"form-control\" placeholder=\"username\" name=\"username\" autofocus value=\"";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    <input type=\"password\" class=\"form-control\" placeholder=\"password\" name=\"password\">\r\n    <div class=\"form-group\">\r\n      <label for=\"notification1\">Remember me</label>\r\n      <div class=\"make-switch\" data-animated=\"false\" data-on-label=\"yes\" data-off-label=\"no\" data-on=\"success\">\r\n        <input type=\"radio\" id=\"notification1\" name=\"remember\" ";
  stack1 = helpers['if'].call(depth0, depth0.remember, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n      </div>\r\n    </div>\r\n    <button class=\"btn btn-lg btn-success btn-block js-signin\">Sign in</button>\r\n  </form>\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/controller", function(exports, require, module) {
var Controller, Event, EventReport, Feedback, Session, application, config, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

config = require('config');

vent = require('vent');

settings = require('settings');

Event = require('../../models/event');

Feedback = require('../../models/feedback');

Session = require('../../models/session');

EventReport = require('../../models/eventreport');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('event controller init');
    application.addInitializer(function(options) {
      _this.events = new Event.Collection();
      _this.feedbacks = new Feedback.Collection();
      _this.sessions = new Session.Collection();
      _this.eventreports = new EventReport.Collection();
      return vent.on('feedback:save', function(feedback) {
        return _this.saveFeedback(feedback);
      });
    });
  }

  Controller.prototype.showEventsIndex = function() {
    var _this = this;
    return this.events.fetch({
      reload: true
    }).done(function(models) {
      return _this.feedbacks.fetch().done(function(feedbacks) {
        var View, view;
        vent.trigger('set:active:header', 'events:index', application.resources.key('Title_Events'), 'bookmark');
        View = require('./views/events-index-view');
        view = new View({
          collection: models,
          resources: application.resources
        });
        return application.layout.content.show(view);
      });
    });
  };

  Controller.prototype.showEventDetails = function(id) {
    var _this = this;
    return this.events.fetch({
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      var event;
      event = models.get(id);
      if (event == null) {
        return vent.trigger('message:error:show', 'event not found');
      } else {
        vent.trigger('set:active:header', 'events:index', event.get('title'), 'bookmark');
        settings.set('active-event', id);
        return _this.sessions.fetch({
          reload: true
        }).done(function(sessions) {
          var View, view;
          View = require('./views/event-details-view');
          view = new View({
            model: event,
            collection: sessions,
            resources: application.resources
          });
          return application.layout.content.show(view);
        });
      }
    });
  };

  Controller.prototype.showEventReport = function(id) {
    var _this = this;
    settings.set('active-event', id);
    return this.eventreports.fetch({
      reload: true,
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      var View, event, view;
      event = models.first();
      if (event == null) {
        vent.trigger('message:error:show', 'event not found');
      } else {
        vent.trigger('set:active:header', 'events:index', event.get('title'), 'bookmark');
      }
      View = require('./views/event-report-view');
      view = new View({
        model: event,
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.showSessionDetails = function(id) {
    var _this = this;
    return this.sessions.fetch().done(function(models) {
      var View, feedback, session, view;
      session = models.get(id);
      if (session == null) {
        return vent.trigger('message:error:show', 'session not found');
      } else {
        vent.trigger('set:active:header', 'events:index', session.get('title'), 'comment');
        settings.set('active-session', id);
        feedback = _this.feedbacks.find(function(item) {
          return item.get('sessionId') === id;
        });
        if (feedback == null) {
          feedback = new Feedback.Model({
            sessionId: id,
            feedbackDefinitionId: session.get('feedbackDefinitionId')
          });
          _this.feedbacks.add(feedback);
        }
        View = require('./views/session-details-view');
        view = new View({
          model: session,
          feedback: feedback,
          resources: application.resources
        });
        return application.layout.content.show(view);
      }
    });
  };

  Controller.prototype.saveFeedback = function(feedback) {
    var _this = this;
    feedback.credentials = this.feedbacks.credentials;
    vent.trigger('fetch:start');
    return feedback.save(null, {
      success: function(model, response, options) {
        vent.trigger('message:success:show', application.resources.key('Feedback_Saved_Success'));
        vent.trigger('fetch:done');
        return application.trigger('event:details', settings.get('active-event'));
      },
      error: function(model, xhr, options) {
        vent.trigger('message:error:show', application.resources.key('Feedback_Saved_Failed'));
        return vent.trigger('fetch:fail');
      }
    });
  };

  Controller.prototype.onClose = function() {
    return console.log('event controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);
});

;require.register("modules/event/router", function(exports, require, module) {
var Controller, Router, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

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
    'sessions/:id': 'showSessionDetails',
    'eventreport/:id': 'showEventReport'
  };

  Router.prototype.initialize = function(options) {
    var _this = this;
    console.log('event router init');
    return application.addInitializer(function(options) {
      vent.on('navigation:signin', function() {
        application.navigate('events');
        return _this.controller.showEventsIndex();
      });
      application.on('events:index', function() {
        application.navigate('events');
        return _this.controller.showEventsIndex();
      });
      application.on('event:details', function(id) {
        application.navigate('events/' + id);
        return _this.controller.showEventDetails(id);
      });
      application.on('session:details', function(id) {
        application.navigate('sessions/' + id);
        return _this.controller.showSessionDetails(id);
      });
      return application.on('event:report', function(id) {
        application.navigate('eventreport/' + id);
        return _this.controller.showEventReport(id);
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/event/views/event-details-view", function(exports, require, module) {
var EventDetailsView, application, settings, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

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

  EventDetailsView.prototype.events = {
    'click .js-report': 'onReport'
  };

  EventDetailsView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    application.trigger('navigation:back:on');
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

  EventDetailsView.prototype.onShow = function() {
    var roles, _ref1;
    roles = (_ref1 = settings.get('api_userroles')) != null ? _ref1 : [];
    if (!_.contains(roles, 'Administrator')) {
      return $('.js-report').hide();
    }
  };

  EventDetailsView.prototype.onBack = function() {
    console.log('back from event-details');
    return application.trigger('events:index');
  };

  EventDetailsView.prototype.onReport = function(e) {
    e.preventDefault();
    return application.trigger('event:report', settings.get('active-event'));
  };

  EventDetailsView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('events-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/event/views/event-item-view", function(exports, require, module) {
var EventItemView, ItemView, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

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

;require.register("modules/event/views/event-report-view", function(exports, require, module) {
var EventReportView, application, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = EventReportView = (function(_super) {
  __extends(EventReportView, _super);

  function EventReportView() {
    this.onBack = __bind(this.onBack, this);
    _ref = EventReportView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventReportView.prototype.id = 'event-report-view';

  EventReportView.prototype.template = require('./templates/event-report');

  EventReportView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    application.trigger('navigation:back:on');
    return application.on('navigation:back', this.onBack);
  };

  EventReportView.prototype.serializeData = function() {
    var _ref1;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON(),
      json: JSON.stringify(this.model, null, 4)
    };
  };

  EventReportView.prototype.onBack = function() {
    var _ref1;
    console.log('back from event-report');
    return application.trigger('event:details', (_ref1 = this.model) != null ? _ref1.id : void 0);
  };

  EventReportView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('event-report view close');
  };

  return EventReportView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/event/views/events-index-view", function(exports, require, module) {
var Event, EventIndexView, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

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
    return application.trigger('navigation:back:off');
  };

  EventIndexView.prototype.onClose = function() {
    return console.log('events-index view close');
  };

  return EventIndexView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/event/views/session-details-view", function(exports, require, module) {
var EventDetailsView, application, vent, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = EventDetailsView = (function(_super) {
  __extends(EventDetailsView, _super);

  function EventDetailsView() {
    this.onBack = __bind(this.onBack, this);
    _ref = EventDetailsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  EventDetailsView.prototype.id = 'session-details-view';

  EventDetailsView.prototype.template = require('./templates/session-details');

  EventDetailsView.prototype.events = {
    'click .js-submit': 'onSubmit'
  };

  EventDetailsView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    this.feedback = options != null ? options.feedback : void 0;
    application.trigger('navigation:back:on');
    return application.on('navigation:back', this.onBack);
  };

  EventDetailsView.prototype.serializeData = function() {
    var _ref1, _ref2;
    return {
      resources: (_ref1 = this.resources) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON(),
      feedback: (_ref2 = this.feedback) != null ? _ref2.toJSON() : void 0,
      feedbackdefinition: this.model.get('feedbackDefinition')
    };
  };

  EventDetailsView.prototype.onBack = function() {
    console.log('back from session-details');
    return application.trigger('event:details', this.model.get('eventId'));
  };

  EventDetailsView.prototype.onShow = function() {
    var id, _i;
    for (id = _i = 0; _i <= 9; id = ++_i) {
      $("#rateit" + id).rateit();
    }
    return $('textarea').autosize();
  };

  EventDetailsView.prototype.onSubmit = function(e) {
    var data;
    e.preventDefault();
    data = Backbone.Syphon.serialize(this);
    this.feedback.set('answer0', data.answer0);
    this.feedback.set('answer1', data.answer1);
    this.feedback.set('answer2', data.answer2);
    this.feedback.set('answer3', data.answer3);
    this.feedback.set('answer4', data.answer4);
    this.feedback.set('answer5', data.answer5);
    this.feedback.set('answer6', data.answer6);
    this.feedback.set('answer7', data.answer7);
    this.feedback.set('answer8', data.answer8);
    this.feedback.set('answer9', data.answer9);
    return vent.trigger('feedback:save', this.feedback);
  };

  EventDetailsView.prototype.onClose = function() {
    application.off('navigation:back', this.onBack);
    return console.log('session-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/event/views/session-item-view", function(exports, require, module) {
var ItemView, SessionItemView, application, settings, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

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
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n      <div class=\"btn-group pull-right\">\r\n        <button type=\"button\" class=\"btn btn-default active badge\">All</button>\r\n        <button type=\"button\" class=\"btn btn-default badge\">C#</button>\r\n        <button type=\"button\" class=\"btn btn-default badge\">Java</button>\r\n        <button type=\"button\" class=\"btn btn-default badge\">SAP</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"list-group js-sessions\">\r\n    <!-- sessions -->\r\n  </div>\r\n  <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n  \r\n  <div class=\"row\">\r\n    <div class=\"col-xs-7\">&nbsp;</div>\r\n    <div class=\"col-xs-5\">\r\n      <a class=\"btn btn-lg btn-primary js-report\" href=\"#\">\r\n        <span class=\"glyphicon glyphicon-list\"></span>&emsp;Report\r\n      </a>\r\n    </div>\r\n  </div>\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/views/templates/event-item", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div>\r\n  <div class=\"glyphicon glyphicon-bookmark\"></div>\r\n    &emsp;&emsp;<strong>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</strong>\r\n</div>\r\n<div class=\"glyphicon glyphicon-time\">\r\n  &emsp;";
  options = {hash:{
    'format': ("DD.MM.YYYY")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.startDate, options) : helperMissing.call(depth0, "dateFormat", depth0.startDate, options)))
    + "\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/views/templates/event-report", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"list-group-item\" style=\"page-break-after: always;\">\r\n    <div>\r\n      <strong>\r\n        &emsp;<div class=\"glyphicon glyphicon-bookmark\"></div>&emsp;&emsp;"
    + escapeExpression(((stack1 = ((stack1 = depth1.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <br/>&emsp;<div class=\"glyphicon glyphicon-comment\"></div>&emsp;&emsp; "
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n      </strong>&emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRate),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n    </div>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    &emsp;<div class=\"glyphicon glyphicon-time\">\r\n      &emsp;";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.startDate, options) : helperMissing.call(depth0, "dateFormat", depth0.startDate, options)))
    + "-";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, depth0.endDate, options) : helperMissing.call(depth0, "dateFormat", depth0.endDate, options)))
    + "\r\n    </div>\r\n    &emsp;&emsp;<div class=\"glyphicon glyphicon-user\">\r\n      &emsp;";
  stack2 = helpers.each.call(depth0, depth0.speakers, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    <div>\r\n      <hr/>\r\n      <ol>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle0),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer0),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle1),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer1),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle2),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer2),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle3),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer3),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle4),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer4),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle5),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer5),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle6),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer6),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle7),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer7),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle8),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer8),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(((stack1 = depth0.quesstionTitle9),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRateAnswer9),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n        </li>\r\n      </ol>\r\n    </div>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.feedbacks, {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += "<span class=\"badge pull-right\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "";
  buffer += escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + " ";
  return buffer;
  }

function program6(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <div>\r\n      <h4>\r\n        <span class=\"label label-default\">\r\n          Feedback on "
    + escapeExpression(((stack1 = depth0.createDate),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n        &emsp;<span class=\"badge\">"
    + escapeExpression(((stack1 = depth0.averageRate),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n      </h4>\r\n      <ol>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle0),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer0),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle1),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer1),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle2),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer2),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle3),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer3),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle4),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer4),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle5),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer5),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle6),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer6),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle7),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer7),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle8),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer8),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(((stack1 = depth1.quesstionTitle9),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = depth0.answer9),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </li>\r\n      </ol>\r\n    </div>\r\n    ";
  return buffer;
  }

  buffer += "﻿<div class=\"container\">\r\n  ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.sessions), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n  <textarea>\r\n    ";
  if (stack2 = helpers.json) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.json; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n  </textarea>\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/views/templates/events-index", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"container\">\r\n  <div class=\"list-group js-events\" style=\"margin-top:39px;\">\r\n    <!-- events -->\r\n  </div>\r\n</div>";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/views/templates/session-details", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType0), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " </div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer0\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer0\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer0)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(25, program25, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType1), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer1\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer1\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program21(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program23(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program25(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program27(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(28, program28, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(30, program30, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(32, program32, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(34, program34, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(36, program36, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType2), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program28(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer2\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program30(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer2\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program32(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program34(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program36(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer2)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program38(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(39, program39, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(41, program41, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(43, program43, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(45, program45, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(47, program47, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType3), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program39(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program41(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer3\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program43(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program45(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program47(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer3)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program49(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(50, program50, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(52, program52, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(54, program54, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(56, program56, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(58, program58, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType4), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program50(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer4\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program52(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer4\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program54(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program56(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program58(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer4)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program60(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(61, program61, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(63, program63, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(65, program65, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(67, program67, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(69, program69, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType5), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program61(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer5\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program63(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer5\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program65(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program67(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program69(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer5)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program71(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(72, program72, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(74, program74, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(76, program76, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(78, program78, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(80, program80, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType6), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program72(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer6\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program74(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer6\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program76(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program78(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program80(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer6)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program82(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(83, program83, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(85, program85, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(87, program87, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(89, program89, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(91, program91, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType7), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program83(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer7\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program85(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer7\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program87(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program89(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program91(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer7)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program93(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(94, program94, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(96, program96, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(98, program98, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(100, program100, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(102, program102, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType8), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program94(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer8\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program96(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer8\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program98(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program100(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program102(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer8)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program104(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"row\">\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(105, program105, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 0, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(107, program107, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 1, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(109, program109, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 10, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 10, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(111, program111, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 11, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 11, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(113, program113, data),data:data};
  stack2 = ((stack1 = helpers.ifCond || depth0.ifCond),stack1 ? stack1.call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 12, options) : helperMissing.call(depth0, "ifCond", ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.questionType9), 12, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n    ";
  return buffer;
  }
function program105(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer9\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\r\n      </div>\r\n      ";
  return buffer;
  }

function program107(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer9\" maxlength=\"2048\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"/>\r\n      </div>\r\n      ";
  return buffer;
  }

function program109(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"3\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program111(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"5\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

function program113(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.title9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"10\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.feedback),stack1 == null || stack1 === false ? stack1 : stack1.answer9)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n      ";
  return buffer;
  }

  buffer += "<div class=\"container\">\r\n\r\n  <div class=\"list-group\" style=\"margin-top:39px;\">\r\n    <div id=\"session-item-view\" class=\"list-group-item\">\r\n      <div>\r\n        <div class=\"glyphicon glyphicon-comment\"></div>\r\n        &emsp;&emsp;<strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong>\r\n      </div>\r\n      ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      <div class=\"glyphicon glyphicon-time\">\r\n        &emsp;";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options)))
    + "-";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options)))
    + "\r\n      </div>\r\n      &emsp;&emsp;<div class=\"glyphicon glyphicon-user\">\r\n        &emsp;";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.speakers), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n      <br/><br/>\r\n      <p>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n    </div>\r\n  </div>\r\n\r\n  <form>\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active0), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active1), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active2), {hash:{},inverse:self.noop,fn:self.program(27, program27, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active3), {hash:{},inverse:self.noop,fn:self.program(38, program38, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active4), {hash:{},inverse:self.noop,fn:self.program(49, program49, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active5), {hash:{},inverse:self.noop,fn:self.program(60, program60, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active6), {hash:{},inverse:self.noop,fn:self.program(71, program71, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active7), {hash:{},inverse:self.noop,fn:self.program(82, program82, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active8), {hash:{},inverse:self.noop,fn:self.program(93, program93, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.feedbackdefinition),stack1 == null || stack1 === false ? stack1 : stack1.active9), {hash:{},inverse:self.noop,fn:self.program(104, program104, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-7\">&nbsp;</div>\r\n      <div class=\"col-xs-5\">\r\n        <button class=\"btn btn-primary btn-lg pull-right js-submit\">\r\n          <span class=\"glyphicon glyphicon-save\"></span>&emsp;Save\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n\r\n</div>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/event/views/templates/session-item", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

  buffer += "<div>\r\n  <div class=\"glyphicon glyphicon-comment\"></div>\r\n  &emsp;&emsp;<strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong>\r\n</div>\r\n";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n<div class=\"glyphicon glyphicon-time\">\r\n  &emsp;";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.startDate), options)))
    + "-";
  options = {hash:{
    'format': ("HH:mm")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat || depth0.dateFormat),stack1 ? stack1.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options) : helperMissing.call(depth0, "dateFormat", ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.endDate), options)))
    + "\r\n</div>\r\n&emsp;&emsp;<div class=\"glyphicon glyphicon-user\">\r\n  &emsp;";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.model),stack1 == null || stack1 === false ? stack1 : stack1.speakers), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/header/controller", function(exports, require, module) {
var Controller, Header, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Header = require('../../models/header');

vent = require('vent');

settings = require('settings');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    var _this = this;
    console.log('about controller init');
    application.addInitializer(function(options) {
      _this.headers = new Header.Collection();
      new Header.TestData().addTo(_this.headers);
      return vent.on('resources:loaded', function() {
        return _this.showHeader();
      });
    });
  }

  Controller.prototype.showHeader = function() {
    var View, view;
    View = require('./views/header-view');
    view = new View.Header({
      collection: this.headers.active(settings.get('api_userroles')),
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
var Controller, Router, application, vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('./controller');

vent = require('vent');

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
      application.on('start', function() {
        return _this.controller.showHeader();
      });
      vent.on('navigation:signin', function() {
        return _this.controller.showHeader();
      });
      return vent.on('navigation:signout', function() {
        return _this.controller.showHeader();
      });
    });
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/header/views/header-view", function(exports, require, module) {
var ItemView, View, application, config, vent, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

config = require('config');

vent = require('vent');

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
    return vent.on('set:active:header', function(trigger, title, glyphicon) {
      if (trigger === _this.model.get('trigger')) {
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
      }))) != null ? _ref2.get('value') : void 0) != null ? _ref1 : this.model.get('title'),
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
    vent.on('set:active:header', function(trigger, title, glyphicon) {
      return _this.setSubHeader(title, glyphicon);
    });
    vent.on('fetch:start', function(title) {
      $('#wrapper').block({
        message: null
      });
      if (config.spinneractive) {
        return $('#spinner').spin({
          lines: 5,
          length: 8,
          width: 5,
          radius: 4,
          corners: 0,
          rotate: 56,
          trail: 40,
          speed: 1.5,
          direction: 1,
          color: '#64b92a'
        });
      }
    });
    vent.on('fetch:done', function() {
      if (config.spinneractive) {
        $('#spinner').spin(false);
      }
      return $('#wrapper').unblock();
    });
    vent.on('fetch:fail', function() {
      if (config.spinneractive) {
        $('#spinner').spin(false);
      }
      return $('#wrapper').unblock();
    });
    application.on('navigation:back:on', function() {
      return $('#menu-back').show();
    });
    return application.on('navigation:back:off', function() {
      return $('#menu-back').hide();
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
    $('#menu-back').hide();
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

  View.prototype.setSubHeader = function(title, glyphicon) {
    this.$('#js-subtitle').text(title);
    this.$('#js-subtitle-glyph').removeClass();
    return this.$('#js-subtitle-glyph').addClass("glyphicon glyphicon-" + glyphicon);
  };

  return View;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/header/views/templates/header-item", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
    + "\"></span>\r\n  &nbsp;&nbsp;&nbsp;";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n</a>";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("modules/header/views/templates/header", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <!-- Sidebar -->\r\n  <div id=\"sidebar-wrapper\">\r\n    <ul class=\"sidebar-nav js-headers\">\r\n      <!-- <li class=\"sidebar-brand\">\r\n        <a id=\"menu-toggle\" href=\"#\">&nbsp;&nbsp;&nbsp;&nbsp; -->\r\n          <!-- <span class=\"glyphicon glyphicon-align-justify\"></span> -->\r\n        <!-- </a>\r\n      </li> -->\r\n      <!-- headers -->\r\n    </ul>\r\n  </div>\r\n\r\n  <!-- Page header -->\r\n  <div id=\"page-content-wrapper\">\r\n    <div class=\"content-header row\">\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-toggle\" href=\"#\" class=\"btn btn-primary pull-left\">\r\n           <span class=\"glyphicon glyphicon-align-justify\"></span>\r\n        </a>\r\n      </div>\r\n      <div class=\"col-xs-7 col-md-9\">\r\n        <div>\r\n          <div class=\"content-header-title js-apptitle\"></div>\r\n          <div class=\"content-header-subtitle\">\r\n            <span class=\"\" id=\"js-subtitle-glyph\">\r\n              <span id=\"js-subtitle\"></span>\r\n            </span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-xs-1 col-md-1\" style=\"margin-top:27px\">\r\n        <span id=\"spinner\"></span>\r\n      </div>\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-back\" href=\"#\" class=\"btn btn-default pull-right\">\r\n          <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n        </a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!--\r\n  <div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <div class=\"container\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"http://brunch.io\">Brunch</a>\r\n    </div>\r\n    <div class=\"navbar-collapse collapse no-transition\">\r\n      <ul class=\"nav navbar-nav\">\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div> -->";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
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

;require.register("vent", function(exports, require, module) {
var Vent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Vent = (function(_super) {
  __extends(Vent, _super);

  function Vent() {
    _ref = Vent.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Vent;

})(Backbone.Events);
});

;
//# sourceMappingURL=app.js.map