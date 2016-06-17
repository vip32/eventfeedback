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
var Application, Resource, config, settings, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/marionette-renderer');

require('lib/string-helper');

require('lib/view-helper');

config = require('config');

settings = require('settings');

vent = require('vent');

Resource = require('../../models/resource');

Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    this.initialize = __bind(this.initialize, this);
    return Application.__super__.constructor.apply(this, arguments);
  }

  Application.prototype.routers = {};

  Application.prototype.initialize = function() {
    log('application:initialize');
    vent.setup();
    this.hookGlobalEvents();
    this.on("initialize:after", (function(_this) {
      return function(options) {
        var module, name, router, _ref;
        log('application init after');
        _ref = config.modules;
        for (name in _ref) {
          module = _ref[name];
          log('=== module', name);
          router = new (require(module));
          _this.routers[name] = router;
        }
        log('routers:', _this.routers);
        Backbone.history.start();
        return log('current route:', _this.currentRoute());
      };
    })(this));
    this.addInitializer((function(_this) {
      return function(options) {
        _this.layout = new (require(config.layout));
        return _this.layout.render();
      };
    })(this));
    this.resources = new Resource.Collection();
    this.resources.fetch({
      data: {
        language: 'de-DE'
      }
    }).done((function(_this) {
      return function(resources) {
        return vent.trigger('resources:loaded');
      };
    })(this));
    settings.set('last-visit', moment());
    appInsights.trackEvent('event/appStart');
    return this.start();
  };

  Application.prototype.checkauth = function(trigger) {
    return log('checkauth', trigger);
  };

  Application.prototype.navigate = function(route, options) {
    log("==========================| " + route + " |========================");
    log('navigate', route, options);
    appInsights.trackPageView(route);
    options = options || {};
    options.trigger = true;
    if (!_.isEmpty(options != null ? options.returnroute : void 0)) {
      route = "" + route + "?returnroute=" + options.returnroute;
    }
    return Backbone.history.navigate(route, options);
  };

  Application.prototype.currentRoute = function() {
    return Backbone.history.fragment;
  };

  Application.prototype.startModule = function(name, options) {
    var currentModule;
    log('startmodule', route);
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

  Application.prototype.hookGlobalEvents = function() {
    return $(window).error(function(msg, url, line) {
      var message;
      message = "'" + msg.originalEvent.message + "' at " + msg.originalEvent.filename + ":" + msg.originalEvent.lineno;
      log('ERROR:', message);
      appInsights.trackEvent('error', {
        message: message
      });
      if (msg == null) {
        alert(message);
        return vent.trigger('about:index');
      }
    });
  };

  return Application;

})(Backbone.Marionette.Application);

module.exports = new Application();
});

;require.register("application", function(exports, require, module) {
﻿(function() {
  var Application, Resource, config, settings, vent,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('lib/marionette-renderer');

  require('lib/string-helper');

  require('lib/view-helper');

  config = require('config');

  settings = require('settings');

  vent = require('vent');

  Resource = require('../../models/resource');

  Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      this.initialize = __bind(this.initialize, this);
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.routers = {};

    Application.prototype.initialize = function() {
      log('application:initialize');
      vent.setup();
      this.hookGlobalEvents();
      this.on("initialize:after", (function(_this) {
        return function(options) {
          var module, name, router, _ref;
          log('application init after');
          _ref = config.modules;
          for (name in _ref) {
            module = _ref[name];
            log('=== module', name);
            router = new (require(module));
            _this.routers[name] = router;
          }
          log('routers:', _this.routers);
          Backbone.history.start();
          return log('current route:', _this.currentRoute());
        };
      })(this));
      this.addInitializer((function(_this) {
        return function(options) {
          _this.layout = new (require(config.layout));
          return _this.layout.render();
        };
      })(this));
      this.resources = new Resource.Collection();
      this.resources.fetch({
        data: {
          language: 'de-DE'
        }
      }).done((function(_this) {
        return function(resources) {
          return vent.trigger('resources:loaded');
        };
      })(this));
      settings.set('last-visit', moment());
      appInsights.trackEvent('event/appStart');
      return this.start();
    };

    Application.prototype.checkauth = function(trigger) {
      return log('checkauth', trigger);
    };

    Application.prototype.navigate = function(route, options) {
      log("==========================| " + route + " |========================");
      log('navigate', route, options);
      appInsights.trackPageView(route);
      options = options || {};
      options.trigger = true;
      if (!_.isEmpty(options != null ? options.returnroute : void 0)) {
        route = "" + route + "?returnroute=" + options.returnroute;
      }
      return Backbone.history.navigate(route, options);
    };

    Application.prototype.currentRoute = function() {
      return Backbone.history.fragment;
    };

    Application.prototype.startModule = function(name, options) {
      var currentModule;
      log('startmodule', route);
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

    Application.prototype.hookGlobalEvents = function() {
      return $(window).error(function(msg, url, line) {
        var message;
        message = "'" + msg.originalEvent.message + "' at " + msg.originalEvent.filename + ":" + msg.originalEvent.lineno;
        log('ERROR:', message);
        appInsights.trackEvent('error', {
          message: message
        });
        if (msg == null) {
          alert(message);
          return vent.trigger('about:index');
        }
      });
    };

    return Application;

  })(Backbone.Marionette.Application);

  module.exports = new Application();

}).call(this);

//# sourceMappingURL=application.js.map

});

;require.register("application.min", function(exports, require, module) {
﻿(function(){var i,r,t,u,n,f=function(n,t){return function(){return n.apply(t,arguments)}},e={}.hasOwnProperty,o=function(n,t){function r(){this.constructor=n}for(var i in t)e.call(t,i)&&(n[i]=t[i]);return r.prototype=t.prototype,n.prototype=new r,n.__super__=t.prototype,n};require("lib/marionette-renderer");require("lib/string-helper");require("lib/view-helper");t=require("config");u=require("settings");n=require("vent");r=require("../../models/resource");i=function(i){function e(){return this.initialize=f(this.initialize,this),e.__super__.constructor.apply(this,arguments)}return o(e,i),e.prototype.routers={},e.prototype.initialize=function(){log("application:initialize");n.setup();this.hookGlobalEvents();this.on("initialize:after",function(n){return function(){var u,i,f,r;log("application init after");r=t.modules;for(i in r)u=r[i],log("=== module",i),f=new(require(u)),n.routers[i]=f;return log("routers:",n.routers),Backbone.history.start(),log("current route:",n.currentRoute())}}(this));return this.addInitializer(function(n){return function(){return n.layout=new(require(t.layout)),n.layout.render()}}(this)),this.resources=new r.Collection,this.resources.fetch({data:{language:"de-DE"}}).done(function(){return function(){return n.trigger("resources:loaded")}}(this)),u.set("last-visit",moment()),appInsights.trackEvent("event/appStart"),this.start()},e.prototype.checkauth=function(n){return log("checkauth",n)},e.prototype.navigate=function(n,t){return log("==========================| "+n+" |========================"),log("navigate",n,t),appInsights.trackPageView(n),t=t||{},t.trigger=!0,_.isEmpty(t!=null?t.returnroute:void 0)||(n=""+n+"?returnroute="+t.returnroute),Backbone.history.navigate(n,t)},e.prototype.currentRoute=function(){return Backbone.history.fragment},e.prototype.startModule=function(n,t){var i;if(log("startmodule",route),i=n||this.module(n)||null,ContactManager.currentModule!==i)return this.currentModule!=null&&this.currentModule.stop(),this.currentModule=i,i?i.start(t):void 0},e.prototype.hookGlobalEvents=function(){return $(window).error(function(t){var i;return i="'"+t.originalEvent.message+"' at "+t.originalEvent.filename+":"+t.originalEvent.lineno,log("ERROR:",i),appInsights.trackEvent("error",{message:i}),t==null?(alert(i),n.trigger("about:index")):void 0})},e}(Backbone.Marionette.Application);module.exports=new i}).call(this);
//# sourceMappingURL=application.min.js.map

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

  Config.prototype.hometrigger = 'home:index';

  Config.prototype.startuptrigger = 'events:index';

  Config.prototype.signintrigger = 'signin:index';

  Config.prototype.brandtrigger = 'events:index';

  Config.prototype.layout = 'layouts/app-layout';

  Config.prototype.sidebarglyphicon = 'glyphicon-minus';

  Config.prototype.spinneractive = false;

  Config.prototype.url = 'https://eventfeedback.azurewebsites.net';

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
var AppLayout, application, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = AppLayout = (function(_super) {
  __extends(AppLayout, _super);

  function AppLayout() {
    return AppLayout.__super__.constructor.apply(this, arguments);
  }

  AppLayout.prototype.template = 'layouts/templates/app-layout';

  AppLayout.prototype.el = "body";

  AppLayout.prototype.regions = {
    header: '#header',
    content: "#content",
    footer: "#footer"
  };

  AppLayout.prototype.initialize = function() {
    vent.on('sidebar:toggle', this.onSidebarToggle);
    return vent.on('sidebar:hide', this.onSidebarHide);
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
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"wrapper\">\r\n\r\n  <div id=\"header\" class=\"container\"></div>\r\n  <div class=\"page-content inset\">\r\n    <div id=\"content\" class=\"container\"></div>\r\n  </div>\r\n  <div id=\"messagebox\"></div>\r\n  <hr/>\r\n  <div id=\"footer\" class=\"container\"></div>\r\n  <div id=\"preload\">\r\n    <img src=\"/app/v1/images/qr.png\" width=\"1\" height=\"1\" alt=\"qr\" />\r\n    <img src=\"/app/v1/images/star.gif\" width=\"1\" height=\"1\" alt=\"star\" />\r\n    <img src=\"/app/v1/images/delete.gif\" width=\"1\" height=\"1\" alt=\"star\" />\r\n    <img src=\"/app/v1/images/star_full_32.png\" width=\"1\" height=\"1\" alt=\"starfull\" />\r\n    <img src=\"/app/v1/images/star_empty_32.png\" width=\"1\" height=\"1\" alt=\"starempty\" />\r\n  </div>\r\n</div>";
  },"useData":true});
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

;require.register("lib/backbone-form-editors", function(exports, require, module) {

});

;require.register("lib/base/collection", function(exports, require, module) {
var Collection, config, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

config = require('config');

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
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
    log('fetch:start', this.constructor.name);
    this.trigger('fetch:start');
    vent.trigger('fetch:start');
    return Collection.__super__.fetch.call(this, options).done(function(collection, response, options) {
      this.trigger('fetch:done');
      vent.trigger('fetch:done');
      return log('fetch:done', this.constructor.name, collection, response, options);
    }).fail(function(collection, response, options) {
      vent.trigger('fetch:fail');
      return console.warn('fetch:fail', this.constructor.name, collection, response, options);
    });
  };

  return Collection;

})(Backbone.Collection);
});

;require.register("lib/base/controller", function(exports, require, module) {
var Controller,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller() {
    return Controller.__super__.constructor.apply(this, arguments);
  }

  Controller.prototype.parseParams = function(params) {
    var options;
    options = {};
    if (params && params.trim() !== '') {
      params = params.split('&');
      _.each(params, function(param) {
        var values;
        values = param.split('=');
        if (values[1]) {
          return options[values[0]] = values[1];
        }
      });
    }
    return options;
  };

  return Controller;

})(Backbone.Marionette.Controller);
});

;require.register("lib/base/item-view", function(exports, require, module) {
var ItemView, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

module.exports = ItemView = (function(_super) {
  __extends(ItemView, _super);

  function ItemView() {
    return ItemView.__super__.constructor.apply(this, arguments);
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
var Model, config, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

config = require('config');

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
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

;require.register("lib/string-helper", function(exports, require, module) {
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) === str;
  };
}

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function(str) {
    return this.slice(-str.length) === str;
  };
}

if (typeof String.prototype.lpad !== 'function') {
  String.prototype.lpad = function(padString, length) {
    var str;
    str = this;
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  };
}

if (typeof String.prototype.rpad !== 'function') {
  String.prototype.rpad = function(padString, length) {
    var str;
    str = this;
    while (str.length < length) {
      str = str + padString;
    }
    return str;
  };
}

if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
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

Handlebars.registerHelper("unlessCond", function(v1, v2, options) {
  if (v1 !== v2) {
    return options.fn(this);
  }
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

Handlebars.registerHelper("seperatelist", function(text) {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/;/g, ', ');
  return new Handlebars.SafeString(text);
});

Handlebars.registerHelper("zerowhenempty", function(text) {
  if (_.isEmpty(text)) {
    return 0;
  }
  return text;
});
});

;require.register("models/event", function(exports, require, module) {
var Collection, Event, EventsCollection, Model, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

user = require('user');

module.exports.Model = Event = (function(_super) {
  __extends(Event, _super);

  function Event() {
    return Event.__super__.constructor.apply(this, arguments);
  }

  Event.prototype.schema = {
    active: 'Checkbox',
    title: {
      type: 'Text',
      validators: ['required']
    },
    description: {
      type: 'Text',
      validators: ['required']
    },
    feedbackAllowed: {
      title: 'Feedback allowed',
      type: 'Checkbox'
    },
    link: 'Text',
    location: 'Text',
    taglist: 'Text',
    feedbackDefinitionId: {
      title: 'Feedback type',
      type: 'Select',
      options: []
    },
    startDate: {
      type: 'Text',
      dataType: 'datetime-local'
    },
    endDate: {
      type: 'Text',
      dataType: 'datetime-local'
    }
  };

  return Event;

})(Model);

module.exports.Collection = EventsCollection = (function(_super) {
  __extends(EventsCollection, _super);

  function EventsCollection() {
    return EventsCollection.__super__.constructor.apply(this, arguments);
  }

  EventsCollection.prototype.url = "" + config.apiroot + "/events";

  EventsCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  EventsCollection.prototype.model = module.exports.Model;

  return EventsCollection;

})(Collection);
});

;require.register("models/eventreport", function(exports, require, module) {
var Collection, EventReport, EventReportsCollection, Model, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

user = require('user');

module.exports.Model = EventReport = (function(_super) {
  __extends(EventReport, _super);

  function EventReport() {
    return EventReport.__super__.constructor.apply(this, arguments);
  }

  return EventReport;

})(Model);

module.exports.Collection = EventReportsCollection = (function(_super) {
  __extends(EventReportsCollection, _super);

  function EventReportsCollection() {
    return EventReportsCollection.__super__.constructor.apply(this, arguments);
  }

  EventReportsCollection.prototype.url = function() {
    return "" + config.apiroot + "/events/" + (settings.get('active-event')) + "/report";
  };

  EventReportsCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  EventReportsCollection.prototype.model = module.exports.Model;

  EventReportsCollection.prototype.comparator = 'title';

  return EventReportsCollection;

})(Collection);
});

;require.register("models/eventtag", function(exports, require, module) {
var Collection, EventTag, EventTagsCollection, Model, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

user = require('user');

module.exports.Model = EventTag = (function(_super) {
  __extends(EventTag, _super);

  function EventTag() {
    return EventTag.__super__.constructor.apply(this, arguments);
  }

  return EventTag;

})(Model);

module.exports.Collection = EventTagsCollection = (function(_super) {
  __extends(EventTagsCollection, _super);

  function EventTagsCollection() {
    return EventTagsCollection.__super__.constructor.apply(this, arguments);
  }

  EventTagsCollection.prototype.url = function() {
    return "" + config.apiroot + "/lookup/tags/" + (settings.get('active-event'));
  };

  EventTagsCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  EventTagsCollection.prototype.model = module.exports.Model;

  return EventTagsCollection;

})(Collection);
});

;require.register("models/feedback", function(exports, require, module) {
var Collection, Feedback, FeedbacksCollection, Model, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

user = require('user');

module.exports.Model = Feedback = (function(_super) {
  __extends(Feedback, _super);

  function Feedback() {
    return Feedback.__super__.constructor.apply(this, arguments);
  }

  return Feedback;

})(Model);

module.exports.Collection = FeedbacksCollection = (function(_super) {
  __extends(FeedbacksCollection, _super);

  function FeedbacksCollection() {
    return FeedbacksCollection.__super__.constructor.apply(this, arguments);
  }

  FeedbacksCollection.prototype.url = "" + config.apiroot + "/feedbacks";

  FeedbacksCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  FeedbacksCollection.prototype.model = module.exports.Model;

  return FeedbacksCollection;

})(Collection);
});

;require.register("models/feedbackdefinition", function(exports, require, module) {
var Collection, FeedbackDefinition, FeedbackDefinitionsCollection, Model, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

user = require('user');

module.exports.Model = FeedbackDefinition = (function(_super) {
  __extends(FeedbackDefinition, _super);

  function FeedbackDefinition() {
    return FeedbackDefinition.__super__.constructor.apply(this, arguments);
  }

  return FeedbackDefinition;

})(Model);

module.exports.Collection = FeedbackDefinitionsCollection = (function(_super) {
  __extends(FeedbackDefinitionsCollection, _super);

  function FeedbackDefinitionsCollection() {
    return FeedbackDefinitionsCollection.__super__.constructor.apply(this, arguments);
  }

  FeedbackDefinitionsCollection.prototype.url = "" + config.apiroot + "/feedbackdefinitions";

  FeedbackDefinitionsCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  FeedbackDefinitionsCollection.prototype.model = module.exports.Model;

  FeedbackDefinitionsCollection.prototype.comparator = 'title';

  return FeedbackDefinitionsCollection;

})(Collection);
});

;require.register("models/header", function(exports, require, module) {
var Collection, Header, HeadersCollection, Model, TestData, settings,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = Header = (function(_super) {
  __extends(Header, _super);

  function Header() {
    return Header.__super__.constructor.apply(this, arguments);
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
    return HeadersCollection.__super__.constructor.apply(this, arguments);
  }

  HeadersCollection.prototype.url = 'headers';

  HeadersCollection.prototype.model = module.exports.Model;

  HeadersCollection.prototype.comparator = 'order';

  HeadersCollection.prototype.active = function(roles) {
    var filtered;
    filtered = this.filter((function(_this) {
      return function(item) {
        var visible, _ref;
        log('header:item', item.get('title'), item.get('roles'), '>', roles);
        visible = (_ref = item.get('visible')) != null ? _ref : true;
        if (visible && _.isEmpty(item.get('roles'))) {
          return true;
        }
        if (visible && !_.isEmpty(roles) && _.intersection(roles, item.get('roles')).length > 0) {
          return true;
        }
      };
    })(this));
    log('header:filtered', filtered);
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
      glyphicon: 'glyphicon-home',
      title: "Home",
      trigger: "home:index",
      intern: true,
      order: 0
    }, {
      id: "ce82ceb6-1104-aaa6-4fab-a4656694de17",
      title: "About",
      authenticated: false,
      resource: 'Title_About',
      glyphicon: 'glyphicon-info-sign',
      trigger: "about:index",
      intern: true,
      order: 3
    }, {
      id: "1cf247f4-4c76-d453-bbec-1c40080e32e4",
      title: "Events",
      authenticated: true,
      roles: ['Guest', 'User', 'Administrator'],
      resource: 'Title_Events',
      glyphicon: 'glyphicon-bookmark',
      trigger: "events:index",
      intern: true,
      order: 1
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f5",
      title: "Sign-in",
      authenticated: false,
      resource: 'Title_SignIn',
      glyphicon: 'glyphicon-user',
      trigger: "signin:index",
      intern: true,
      order: 4
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f4",
      title: "Debug",
      authenticated: true,
      roles: ['Administrator'],
      resource: 'Title_Debug',
      glyphicon: 'glyphicon-cog',
      trigger: "debug:index",
      intern: true,
      order: 5
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b890",
      title: "",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: '',
      trigger: "-",
      intern: true,
      order: 10
    }, {
      id: "b85fd64c-3d4a-e8f1-8f1b-7d5e6ed8b8f9",
      title: "Admin - Users",
      authenticated: true,
      roles: ['Administrator'],
      resource: '',
      glyphicon: 'glyphicon-user',
      trigger: "admin:users:generator",
      intern: true,
      order: 14
    }
  ];

  return TestData;

})();
});

;require.register("models/resource", function(exports, require, module) {
var Collection, Model, Resource, ResourceCollection, config, settings,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

module.exports.Model = Resource = (function(_super) {
  __extends(Resource, _super);

  function Resource() {
    return Resource.__super__.constructor.apply(this, arguments);
  }

  return Resource;

})(Model);

module.exports.Collection = ResourceCollection = (function(_super) {
  __extends(ResourceCollection, _super);

  function ResourceCollection() {
    return ResourceCollection.__super__.constructor.apply(this, arguments);
  }

  ResourceCollection.prototype.url = "" + config.apiroot + "/resources";

  ResourceCollection.prototype.model = module.exports.Model;

  ResourceCollection.prototype.comparator = 'key';

  ResourceCollection.prototype.key = function(key) {
    var result, _ref;
    result = this.find((function(_this) {
      return function(model) {
        return model.get('key') === key;
      };
    })(this));
    return (_ref = result != null ? result.get('value') : void 0) != null ? _ref : '';
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
var Collection, Model, Role, RolesCollection, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

user = require('user');

module.exports.Model = Role = (function(_super) {
  __extends(Role, _super);

  function Role() {
    return Role.__super__.constructor.apply(this, arguments);
  }

  return Role;

})(Model);

module.exports.Collection = RolesCollection = (function(_super) {
  __extends(RolesCollection, _super);

  function RolesCollection() {
    return RolesCollection.__super__.constructor.apply(this, arguments);
  }

  RolesCollection.prototype.url = "" + config.apiroot + "/admin/roles";

  RolesCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  RolesCollection.prototype.model = module.exports.Model;

  RolesCollection.prototype.comparator = 'name';

  RolesCollection.prototype.toArray = function() {
    var roles;
    roles = [["", ""]];
    this.each((function(_this) {
      return function(role) {
        return roles.push([role.get('name'), role.get('name')]);
      };
    })(this));
    return roles;
  };

  return RolesCollection;

})(Collection);
});

;require.register("models/session", function(exports, require, module) {
var Collection, Model, Session, SessionsCollection, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('../settings');

user = require('user');

module.exports.Model = Session = (function(_super) {
  __extends(Session, _super);

  function Session() {
    return Session.__super__.constructor.apply(this, arguments);
  }

  return Session;

})(Model);

module.exports.Collection = SessionsCollection = (function(_super) {
  __extends(SessionsCollection, _super);

  function SessionsCollection() {
    return SessionsCollection.__super__.constructor.apply(this, arguments);
  }

  SessionsCollection.prototype.url = function() {
    return "" + config.apiroot + "/events/" + (settings.get('active-event')) + "/sessions";
  };

  SessionsCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  SessionsCollection.prototype.model = module.exports.Model;

  SessionsCollection.prototype.filterForTag = function(tag) {
    return this.filter(function(model) {
      return (_.contains(model.get('tags'), tag)) || (_.isEmpty(model.get('tags')));
    });
  };

  return SessionsCollection;

})(Collection);
});

;require.register("models/store", function(exports, require, module) {
var Collection, StoreCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Collection = require('../lib/base/collection');

module.exports.Collection = StoreCollection = (function(_super) {
  __extends(StoreCollection, _super);

  function StoreCollection() {
    return StoreCollection.__super__.constructor.apply(this, arguments);
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

    /* get the value attribute for an item */
    return this.getValueOrDefault(id, '');
  };

  StoreCollection.prototype.getValueOrDefault = function(id, val) {

    /* get the value attribute for an item */
    var item;
    item = this.get("" + this.name + "-" + id);
    if (item != null) {
      return item.get('value');
    } else {
      return val;
    }
  };

  StoreCollection.prototype.has = function(id) {

    /* looks through the collection for the specified id */
    var item;
    item = this.get("" + this.name + "-" + id);
    return (item != null) === true;
  };

  StoreCollection.prototype.destroy = function(id) {

    /* removes all models from the collection and store */
    if (_.isEmpty(id)) {
      return _.chain(this.models).clone().each(function(model) {
        return model.destroy();
      });
    } else {
      return _.chain(this.models).clone().each((function(_this) {
        return function(model) {
          if (("" + _this.name + "-" + id) === model.get('id')) {
            return model.destroy();
          }
        };
      })(this));
    }
  };

  return StoreCollection;

})(Collection);
});

;require.register("models/user", function(exports, require, module) {
var Collection, Model, User, UsersCollection, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

Collection = require('../lib/base/collection');

settings = require('settings');

user = require('user');

module.exports.Model = User = (function(_super) {
  __extends(User, _super);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  return User;

})(Model);

module.exports.Collection = UsersCollection = (function(_super) {
  __extends(UsersCollection, _super);

  function UsersCollection() {
    return UsersCollection.__super__.constructor.apply(this, arguments);
  }

  UsersCollection.prototype.url = "" + config.apiroot + "/admin/users";

  UsersCollection.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  UsersCollection.prototype.model = module.exports.Model;

  UsersCollection.prototype.comparator = 'name';

  return UsersCollection;

})(Collection);
});

;require.register("models/userprofile", function(exports, require, module) {
var Model, UserProfile, config, settings, user,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

settings = require('../settings');

user = require('user');

module.exports.Model = UserProfile = (function(_super) {
  __extends(UserProfile, _super);

  function UserProfile() {
    return UserProfile.__super__.constructor.apply(this, arguments);
  }

  UserProfile.prototype.urlRoot = function() {
    return "" + config.apiroot + "/user/profile";
  };

  UserProfile.prototype.credentials = function() {
    return {
      token: user.token()
    };
  };

  return UserProfile;

})(Model);
});

;require.register("models/usertoken", function(exports, require, module) {
var Model, UserToken, config, settings,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

config = require('../config');

Model = require('../lib/base/model');

settings = require('../settings');

module.exports.Model = UserToken = (function(_super) {
  __extends(UserToken, _super);

  function UserToken() {
    return UserToken.__super__.constructor.apply(this, arguments);
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

Controller = require('../../lib/base/controller');

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
    log('admin controller init');
    application.addInitializer((function(_this) {
      return function(options) {
        _this.events = new Event.Collection();
        _this.sessions = new Session.Collection();
        _this.users = new User.Collection();
        _this.roles = new Role.Collection();
        return vent.on('save:users', function() {
          return _this.onSaveUsers();
        });
      };
    })(this));
  }

  Controller.prototype.showEventsEdit = function() {
    return this.events.fetch({
      reload: true,
      data: {
        filter: 'all'
      }
    }).done(function(models) {
      var View, view;
      vent.trigger('set:active:header', 'admin:events:edit', application.resources.key('Title_Events'), 'glyphicon-bookmark');
      View = require('./views/events-edit-view');
      view = new View({
        collection: models,
        resources: application.resources
      });
      return application.layout.content.show(view);
    });
  };

  Controller.prototype.showSessionsEdit = function(id) {
    return this.events.fetch({
      data: {
        filter: 'all'
      }
    }).done((function(_this) {
      return function(events) {
        settings.set('active-event', id);
        return _this.sessions.fetch({
          reload: true
        }).done(function(sessions) {
          var View, view;
          vent.trigger('set:active:header', 'admin:events:edit', application.resources.key('Title_Sessions'), 'icon-comment');
          View = require('./views/sessions-edit-view');
          view = new View({
            model: events.get(id),
            collection: sessions,
            resources: application.resources
          });
          return application.layout.content.show(view);
        });
      };
    })(this));
  };

  Controller.prototype.showUsersGenerator = function() {
    this.users.reset();
    return this.roles.fetch({
      reload: true
    }).done((function(_this) {
      return function(roles) {
        var View, view;
        vent.trigger('set:active:header', 'admin:users:generator', application.resources.key('Title_Admin_Users'), 'glyphicon-user');
        _this.users.on('add', function(model) {
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
      };
    })(this));
  };

  Controller.prototype.onSaveUsers = function() {
    return this.users.each((function(_this) {
      return function(model) {
        if (model.get('dirty') && model.get('userName') !== '') {
          return model.save(null, {
            success: function(model, response, options) {
              return model.set('dirty', false, {
                silent: true
              });
            },
            error: function(model, xhr, options) {
              _this.users.remove(model);
              vent.trigger('message:error:show', JSON.parse(xhr.responseText).message);
              return console.warn('user save error');
            }
          });
        }
      };
    })(this));
  };

  Controller.prototype.onClose = function() {
    return log('admin controller close');
  };

  return Controller;

})(Controller);
});

;require.register("modules/admin/router", function(exports, require, module) {
var Controller, Router, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.appRoutes = {
    'admin/events': 'showEventsEdit',
    'admin/events/:id': 'showSessionsEdit',
    'admin/users': 'showUsersGenerator'
  };

  Router.prototype.initialize = function(options) {
    log('admin router init');
    return application.addInitializer((function(_this) {
      return function(options) {
        vent.on('admin:events:edit', function() {
          application.navigate('admin/events');
          return _this.controller.showEventsEdit();
        });
        vent.on('admin:sessions:edit', function(id) {
          application.navigate('admin/events/' + id);
          return _this.controller.showSessionsEdit(id);
        });
        return vent.on('admin:users:generator', function() {
          application.navigate('admin/usersgenerator');
          return _this.controller.showUsersGenerator();
        });
      };
    })(this));
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/admin/views/templates/users-generator-item", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "﻿<div>\r\n  <div class=\"row\">\r\n    <div class=\"col-xs-5\">\r\n      <h2>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\r\n      <p>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.message : stack1), depth0))
    + "</p>\r\n      <h3 style=\"color: #000000;\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.userName : stack1), depth0))
    + "&emsp;/&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.password : stack1), depth0))
    + "</h3>\r\n      "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.roles : stack1), depth0))
    + "<br/>\r\n      "
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\r\n    </div>\r\n    <div class=\"col-xs-3\">\r\n      <div id=\"qr"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.userName : stack1), depth0))
    + "\"></div>\r\n    </div>\r\n    <div class=\"col-xs-4\">\r\n      <a id=\"qrlink"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.userName : stack1), depth0))
    + "\" class=\"btn btn-success btn-small noprint\">signin</a>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "          <option value=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "﻿<div class=\"container\">\r\n  <form class=\"form-horizontal noprint\" role=\"form\">\r\n    <div class=\"form-group\">\r\n      <label for=\"amount\" class=\"col-sm-4 control-label\">Organization</label>\r\n      <div class=\"col-sm-8\">\r\n        <input type=\"text\" class=\"form-control\" name=\"organization\" id=\"organization\" disabled placeholder=\"\"></input>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"roles\" class=\"col-sm-4 control-label\">Account role</label>\r\n      <div class=\"col-sm-8\">\r\n        <select name=\"roles\" id=\"roles\" class=\"form-control\">\r\n          <option value=\"\"></option>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.roles : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </select>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"amount\" class=\"col-sm-4 control-label\">Account names</label>\r\n      <div class=\"col-sm-8\">\r\n        <input type=\"text\" class=\"form-control\" name=\"accountnames\" id=\"accountnames\" placeholder=\"user1; user2; ...\"></input>\r\n        <!--<span class=\"help-block\">A block of help text that breaks onto a new line and may extend beyond one line.</span>-->\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"amount\" class=\"col-sm-4 control-label\">Random accounts amount</label>\r\n      <div class=\"col-sm-8\">\r\n        <select name=\"amount\" id=\"amount\" class=\"form-control\">\r\n          <option value=\"\"></option>\r\n          <option value=\"1\">1</option>\r\n          <option value=\"10\">10</option>\r\n          <option value=\"25\">25</option>\r\n          <option value=\"50\">50</option>\r\n          <option value=\"100\">100</option>\r\n        </select>\r\n        <!--<span class=\"help-block\">A block of help text that breaks onto a new line and may extend beyond one line.</span>-->\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"message\" class=\"col-sm-4 control-label\">Active</label>\r\n      <div class=\"col-sm-8\">\r\n        <div class=\"row\">\r\n          <div class=\"col-xs-6\">\r\n            <input type=\"date\" class=\"form-control\" name=\"activefrom\" id=\"activefrom\" placeholder=\"from\"></input>\r\n          </div>\r\n          <div class=\"col-xs-6\">\r\n            <input type=\"date\" class=\"form-control\" name=\"activetill\" id=\"activetill\" placeholder=\"till\"></input>\r\n          </div>\r\n        </div>\r\n        <!--<span class=\"help-block\">A block of help text that breaks onto a new line and may extend beyond one line.</span>-->\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"prefix\" class=\"col-sm-4 control-label\">Account prefix</label>\r\n      <div class=\"col-sm-8\">\r\n        <input type=\"text\" class=\"form-control\" name=\"prefix\" id=\"prefix\" placeholder=\"\"></input>\r\n        <!--<span class=\"help-block\">A block of help text that breaks onto a new line and may extend beyond one line.</span>-->\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"message\" class=\"col-sm-4 control-label\">Additional message</label>\r\n      <div class=\"col-sm-8\">\r\n        <input type=\"text\" class=\"form-control\" name=\"message\" id=\"message\" placeholder=\"\"></input>\r\n        <!--<span class=\"help-block\">A block of help text that breaks onto a new line and may extend beyond one line.</span>-->\r\n      </div>\r\n    </div>\r\n    \r\n    <div class=\"form-group\">\r\n      \r\n\r\n      <div class=\"col-sm-offset-4 col-sm-8 pull-right\">\r\n        <br/>\r\n        <button type=\"button\" id=\"js-generate\" class=\"btn btn-success btn-responsive\">\r\n          <span class=\"glyphicon glyphicon-user\"></span>&emsp;Generate\r\n        </button>\r\n        <button type=\"button\" id=\"js-clear\" class=\"btn btn-default btn-responsive\">\r\n          <span class=\"glyphicon glyphicon-refresh\"></span>&emsp;Clear\r\n        </button>\r\n        <button type=\"button\" id=\"js-print\" class=\"btn btn-default btn-responsive\">\r\n          <div class=\"glyphicon glyphicon-print\"></div>&emsp;Print\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n  <div class=\"list-group\" id=\"js-users\">\r\n    <!-- users -->\r\n  </div>\r\n  <iframe name=\"print_frame\" width=\"0\" height=\"0\" frameborder=\"0\" src=\"about:blank\"></iframe>\r\n</div>\r\n\r\n";
},"useData":true});
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

;require.register("modules/admin/views/users-generator-item-view", function(exports, require, module) {
var ItemView, UsersGeneratorItemView, application, config, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

config = require('config');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = UsersGeneratorItemView = (function(_super) {
  __extends(UsersGeneratorItemView, _super);

  function UsersGeneratorItemView() {
    return UsersGeneratorItemView.__super__.constructor.apply(this, arguments);
  }

  UsersGeneratorItemView.prototype.id = 'users-generator-item-view';

  UsersGeneratorItemView.prototype.template = require('./templates/users-generator-item');

  UsersGeneratorItemView.prototype.tagName = 'div';

  UsersGeneratorItemView.prototype.className = 'list-group-item';

  UsersGeneratorItemView.prototype.initialize = function(options) {
    return this.resources = options != null ? options.resources : void 0;
  };

  UsersGeneratorItemView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      model: this.model.toJSON(),
      title: config.apptitle,
      url: config.url
    };
  };

  UsersGeneratorItemView.prototype.onShow = function() {
    var url;
    url = "" + config.url + "/app/v1/index.html#signin?u=" + (this.model.get('userName')) + "&p=" + (this.model.get('password'));
    $("#qrlink" + (this.model.get('userName'))).attr('href', url);
    return new QRCode("qr" + (this.model.get('userName')), {
      text: url,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  };

  return UsersGeneratorItemView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/admin/views/users-generator-view", function(exports, require, module) {
var UsersGeneratorView, application, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = UsersGeneratorView = (function(_super) {
  __extends(UsersGeneratorView, _super);

  function UsersGeneratorView() {
    return UsersGeneratorView.__super__.constructor.apply(this, arguments);
  }

  UsersGeneratorView.prototype.id = 'users-generator-view';

  UsersGeneratorView.prototype.template = require('./templates/users-generator');

  UsersGeneratorView.prototype.itemView = require('./users-generator-item-view');

  UsersGeneratorView.prototype.itemViewContainer = '#js-users';

  UsersGeneratorView.prototype.events = {
    'click #js-generate': 'onGenerate',
    'click #js-clear': 'onClear',
    'click #js-print': 'onPrintClick'
  };

  UsersGeneratorView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return this.roles = options != null ? options.roles : void 0;
  };

  UsersGeneratorView.prototype.serializeData = function() {
    var _ref, _ref1;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      roles: (_ref1 = this.roles) != null ? _ref1.pluck('name') : void 0
    };
  };

  UsersGeneratorView.prototype.itemViewOptions = function() {
    return {
      resources: this.resources
    };
  };

  UsersGeneratorView.prototype.onShow = function() {
    return scrollTo(0, 0);
  };

  UsersGeneratorView.prototype.onClear = function(e) {
    e.preventDefault();
    return this.collection.reset();
  };

  UsersGeneratorView.prototype.onGenerate = function(e) {
    var data, i, _i, _j, _len, _ref, _ref1;
    e.preventDefault();
    this.collection.reset();
    data = Backbone.Syphon.serialize(this);
    _ref = data.accountnames.split(';');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.trim() !== "") {
        this.collection.add({
          userName: data.prefix + i.trim(),
          password: this.makeId(),
          roles: data.roles,
          message: data.message,
          activefrom: data.activefrom,
          activetill: data.activetill,
          active: true,
          dirty: true
        });
      }
    }
    if (data.amount > 0) {
      for (i = _j = 1, _ref1 = data.amount; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        this.collection.add({
          userName: data.prefix + this.makeId(),
          password: this.makeId(),
          roles: data.roles,
          message: data.message,
          activefrom: data.activefrom,
          activetill: data.activetill,
          active: true,
          dirty: true
        });
      }
    }
    return vent.trigger('save:users');
  };

  UsersGeneratorView.prototype.onPrintClick = function(e) {
    var css;
    e.preventDefault();
    $('#js-users .list-group-item:nth-child(4n)').css('page-break-after', 'always');
    css = '<link href="www/stylesheets/app.css" rel="stylesheet" type="text/css">';
    window.frames["print_frame"].document.body.innerHTML = css + document.getElementById("js-users").innerHTML;
    window.frames["print_frame"].window.focus();
    return window.frames["print_frame"].window.print();
  };

  UsersGeneratorView.prototype.makeId = function() {
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

  UsersGeneratorView.prototype.onClose = function() {
    return log('user-generator view close');
  };

  return UsersGeneratorView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/common/controller", function(exports, require, module) {
var Controller, UserProfile, UserToken, application, config, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('../../lib/base/controller');

UserProfile = require('../../models/userprofile');

UserToken = require('../../models/usertoken');

vent = require('vent');

settings = require('settings');

user = require('user');

config = require('config');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    log('common controller init');
    application.addInitializer((function(_this) {
      return function(options) {
        vent.on('view:signin:do', function(data) {
          if (!_.isEmpty(data.username) && !_.isEmpty(data.password)) {
            user.reset();
            if (data.remember) {
              user.name(data.username);
            }
            user.remember(data.remember);
            return _this.doSignin(data.username, data.password, data.returnroute);
          }
        });
        vent.on('message:success:show', function(data) {
          return _this.showMessage(data, 'success');
        });
        return vent.on('message:error:show', function(data) {
          return _this.showMessage(data, 'danger');
        });
      };
    })(this));
  }

  Controller.prototype.showMessage = function(data, type) {
    $('#messagebox').append('<div id="currentmessage" class="alert alert-' + type + '"><a class="close" data-dismiss="alert">&emsp;×</a><span>' + data + '</span></div>');
    return setTimeout(function() {
      return $("#currentmessage").remove();
    }, 3000);
  };

  Controller.prototype.showHome = function() {
    var View, view;
    vent.trigger('fetch:done');
    vent.trigger('set:active:header', 'home:index', '', 'glyphicon-home');
    View = require('./views/home-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showSignin = function(params) {
    var View, view;
    params = this.parseParams(params);
    vent.trigger('fetch:done');
    vent.trigger('set:active:header', 'signin:index', application.resources.key('Title_SignIn'), 'glyphicon-user');
    View = require('./views/signin-view');
    view = new View({
      resources: application.resources,
      username: params != null ? params.u : void 0,
      password: params != null ? params.p : void 0,
      returnroute: params != null ? params.returnroute : void 0
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showAbout = function() {
    var View, view;
    vent.trigger('fetch:done');
    vent.trigger('set:active:header', 'about:index', application.resources.key('Title_About'), 'glyphicon-info-sign');
    View = require('./views/about-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.showDebug = function() {
    var View, view;
    vent.trigger('fetch:done');
    vent.trigger('set:active:header', 'debug:index', application.resources.key('Title_Debug'), 'glyphicon-cog');
    View = require('./views/debug-view');
    view = new View({
      resources: application.resources
    });
    return application.layout.content.show(view);
  };

  Controller.prototype.doSignout = function() {
    user.reset();
    vent.trigger('header:refresh');
    vent.trigger(config.hometrigger);
    return appInsights.trackEvent('event/signout');
  };

  Controller.prototype.doSignin = function(username, password, returnroute) {
    var userToken;
    vent.trigger('fetch:start');
    userToken = new UserToken.Model({
      userName: username,
      password: password
    });
    return userToken.save(null, {
      success: (function(_this) {
        return function(model, response, options) {
          var profile;
          appInsights.trackEvent('event/signin/success');
          user.token(userToken.get('accessToken'));
          user.tokenexpires(userToken.get('expires'));
          profile = new UserProfile.Model();
          return profile.fetch({
            success: function(model, response, options) {
              appInsights.trackEvent('event/profile/success');
              user.set('api_userroles', model.get('roles'));
              vent.trigger('message:success:show', 'signed in ' + username);
              vent.trigger('header:refresh');
              if (_.isEmpty(returnroute)) {
                return vent.trigger(config.startuptrigger);
              } else {
                return application.navigate(returnroute);
              }
            },
            error: function(model, xhr, options) {
              appInsights.trackEvent('event/profile/failed');
              return vent.trigger('header:refresh');
            }
          });
        };
      })(this),
      error: function(model, xhr, options) {
        appInsights.trackEvent('event/signin/failed');
        vent.trigger('message:error:show', 'sign in failed');
        vent.trigger('header:refresh');
        return vent.trigger('fetch:fail');
      }
    });
  };

  return Controller;

})(Controller);
});

;require.register("modules/common/router", function(exports, require, module) {
var Controller, Router, application, config, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

Controller = require('./controller');

config = require('config');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.appRoutes = {
    '': 'showHome',
    'home': 'showHome',
    'about': 'showAbout',
    'debug': 'showDebug',
    'signin': 'showSignin',
    'signout': 'doSignout'
  };

  Router.prototype.initialize = function(options) {
    log('common router init');
    return application.addInitializer((function(_this) {
      return function(options) {
        vent.on('sync:fail:unauthorized', function() {
          return vent.trigger(config.signintrigger);
        });
        vent.on('sync:fail:servererror', function() {
          return console.warn('sync:server error');
        });
        vent.on('sync:fail:unknown', function() {
          return console.warn('sync:unknown error');
        });
        vent.on('home:index', function() {
          console.log('HOME!');
          return application.navigate('home');
        });
        vent.on('signin:index', function() {
          console.log('current route:', application.currentRoute());
          if (!application.currentRoute().startsWith('signin')) {
            return application.navigate('signin', {
              returnroute: application.currentRoute()
            });
          } else {
            return application.navigate('signin', {
              returnroute: 'home'
            });
          }
        });
        vent.on('signout:index', function() {
          return application.navigate('signout');
        });
        vent.on('about:index', function() {
          console.log('ABOUT!');
          return application.navigate('about');
        });
        return vent.on('debug:index', function() {
          return application.navigate('debug');
        });
      };
    })(this));
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/common/views/about-view", function(exports, require, module) {
var AboutView, application, config, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

user = require('user');

config = require('config');

module.exports = AboutView = (function(_super) {
  __extends(AboutView, _super);

  function AboutView() {
    return AboutView.__super__.constructor.apply(this, arguments);
  }

  AboutView.prototype.id = 'about-view';

  AboutView.prototype.template = require('./templates/about');

  AboutView.prototype.events = {
    'click .js-reset': 'onReset',
    'click .js-signout': 'onSignout'
  };

  AboutView.prototype.initialize = function(options) {
    return vent.trigger('navigation:back:off');
  };

  AboutView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      user: user.name(),
      roles: user.roles(),
      admin: user.isAdministrator(),
      auth: user.isAuthenticated(),
      help: "" + config.approot + "help",
      swagger: "" + config.approot + "swagger",
      apiinfo: "" + config.apiroot + "/lookup/apiinfo"
    };
  };

  AboutView.prototype.onShow = function() {
    return scrollTo(0, 0);
  };

  AboutView.prototype.onSignout = function() {
    return vent.trigger('signout:index');
  };

  AboutView.prototype.onReset = function(e) {
    e.preventDefault();
    user.reset();
    settings.destroy();
    vent.trigger('home:index');
    return vent.trigger('header:refresh');
  };

  AboutView.prototype.onClose = function() {
    return log('about view close');
  };

  return AboutView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/debug-view", function(exports, require, module) {
var DebugView, Event, application, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

user = require('user');

Event = require('../../../models/event');

module.exports = DebugView = (function(_super) {
  __extends(DebugView, _super);

  function DebugView() {
    return DebugView.__super__.constructor.apply(this, arguments);
  }

  DebugView.prototype.id = 'debug-view';

  DebugView.prototype.template = require('./templates/debug');

  DebugView.prototype.events = {
    'click .js-triggerevent': 'onTriggerEvent',
    'click .js-submit': 'onSubmit',
    'click .js-remove': 'onRemove'
  };

  DebugView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return vent.trigger('navigation:back:off');
  };

  DebugView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      user: user.name(),
      roles: user.roles()
    };
  };

  DebugView.prototype.onTriggerEvent = function(e) {
    var model;
    model = Backbone.Syphon.serialize(this);
    log('onTriggerEvent', model);
    vent.trigger(model.event);
    return e.preventDefault();
  };

  DebugView.prototype.onShow = function() {
    scrollTo(0, 0);
    log('resources', this.resources);
    this.model = new Event.Model({
      title: 'new title'
    });
    this.form = new Backbone.Form({
      model: this.model
    }).render();
    return this.$('#form').append(this.form.el);
  };

  DebugView.prototype.onSubmit = function() {
    log('submit', this.form);
    this.form.commit({
      validate: true
    });
    this.model.set('key', _.str.slugify(this.model.get('title')));
    return log('model:', this.model);
  };

  DebugView.prototype.onRemove = function() {
    return log('remove');
  };

  DebugView.prototype.onClose = function() {
    return log('debug view close');
  };

  return DebugView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/footer-view", function(exports, require, module) {
var FooterView, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

vent = require('vent');

module.exports = FooterView = (function(_super) {
  __extends(FooterView, _super);

  function FooterView() {
    return FooterView.__super__.constructor.apply(this, arguments);
  }

  FooterView.prototype.id = 'footer-view';

  FooterView.prototype.template = require('./templates/footer');

  return FooterView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/home-view", function(exports, require, module) {
var HomeView, application, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = require('./templates/home');

  HomeView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return vent.trigger('navigation:back:off');
  };

  HomeView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0
    };
  };

  HomeView.prototype.onShow = function() {
    return scrollTo(0, 0);
  };

  HomeView.prototype.onClose = function() {
    return log('home view close');
  };

  return HomeView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/signin-view", function(exports, require, module) {
var SigninView, application, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

user = require('user');

module.exports = SigninView = (function(_super) {
  __extends(SigninView, _super);

  function SigninView() {
    return SigninView.__super__.constructor.apply(this, arguments);
  }

  SigninView.prototype.id = 'signin-view';

  SigninView.prototype.template = require('./templates/signin');

  SigninView.prototype.events = {
    'click .js-signin': 'onSignin'
  };

  SigninView.prototype.initialize = function(options) {
    return vent.trigger('navigation:back:off');
  };

  SigninView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      username: this.options.username ? this.options.username : user.remember() ? user.name() : void 0,
      password: this.options.password,
      remember: user.remember()
    };
  };

  SigninView.prototype.onSignin = function(e) {
    var data;
    e.preventDefault();
    data = Backbone.Syphon.serialize(this);
    data.returnroute = this.options.returnroute;
    return vent.trigger('view:signin:do', data);
  };

  SigninView.prototype.onShow = function() {
    return scrollTo(0, 0);
  };

  SigninView.prototype.onClose = function() {
    return log('signin view close');
  };

  return SigninView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/common/views/templates/about", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>App</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.App\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li>Backbone 1.1.0</li>\r\n        <li>Underscore 1.5.2</li>\r\n        <li>Twitter Bootstrap 3.0.0</li>\r\n        <li>MarionetteJS 1.2.2</li>\r\n        <!--<li>MomentJS 2.2.1</li>-->\r\n        <li>jQuery 2.0.3</li>\r\n        <li>JQuery RateIt 1.0.19</li>\r\n        <li>Fastclick 0.6.10</li>\r\n        <li>Pace 0.4.15</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <h3>Api</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.Api\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.apiinfo || (depth0 != null ? depth0.apiinfo : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"apiinfo","hash":{},"data":data}) : helper)))
    + "\">ApiInfo</a></li>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.help || (depth0 != null ? depth0.help : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"help","hash":{},"data":data}) : helper)))
    + "\">Documentation</a></li>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.swagger || (depth0 != null ? depth0.swagger : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"swagger","hash":{},"data":data}) : helper)))
    + "\">Swagger</a></li>\r\n        <li>Microsoft .Net 4.5, C#</li>\r\n        <li>Microsoft ASP.NET Web API 2</li>\r\n        <li>Microsoft Entity Framework 6.0</li>\r\n        <li>Microsoft ASP.NET Identity 1.0</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>Dev</h3>\r\n      <ul>\r\n        <li>\r\n          <a href=\"https://github.com/WindowsAzure\" target=\"_blank\">Windows Azure</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/joyent/node\" target=\"_blank\">Node.js</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/brunch/brunch\" target=\"_blank\">Brunch</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/jashkenas/coffee-script\" target=\"_blank\">Coffeescript</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/bower/bower\" target=\"_blank\">Bower</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      &nbsp;\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <!--<img src=\"http://qrfree.kaywa.com/?l=1&s=8&d=https%3A%2F%2Feventfeedback.azurewebsites.net\" alt=\"QRCode\"/>-->\r\n      <p>\r\n        <a href=\"/\">\r\n          <img class=\"qrimage\" height=\"88\" width=\"88\"/>\r\n        </a>\r\n        <a href=\"/\">\r\n          <img class=\"logoimage\" height=\"88\" width=\"88\" />\r\n        </a>\r\n      </p>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-signout\" href=\"#\">\r\n          <i class=\"icon-user\"></i>\r\n          &emsp;Signout\r\n        </a>\r\n      </p>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-reset\" href=\"#\">\r\n          <i class=\"icon-bomb\"></i>\r\n          &emsp;Reset</a>\r\n      </p>\r\n      <p>\r\n        <span class=\"glyphicon glyphicon-user\">&emsp;user: "
    + escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user","hash":{},"data":data}) : helper)))
    + "/ role: "
    + escapeExpression(((helper = (helper = helpers.roles || (depth0 != null ? depth0.roles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"roles","hash":{},"data":data}) : helper)))
    + "/ admin: "
    + escapeExpression(((helper = (helper = helpers.admin || (depth0 != null ? depth0.admin : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"admin","hash":{},"data":data}) : helper)))
    + "/ auth: "
    + escapeExpression(((helper = (helper = helpers.auth || (depth0 != null ? depth0.auth : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"auth","hash":{},"data":data}) : helper)))
    + "</span>\r\n      </p>\r\n    </div>\r\n  </div>\r\n</div>";
},"useData":true});
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

;require.register("modules/common/views/templates/about.hbs", function(exports, require, module) {
﻿var about = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>App</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.App\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li>Backbone 1.1.0</li>\r\n        <li>Underscore 1.5.2</li>\r\n        <li>Twitter Bootstrap 3.0.0</li>\r\n        <li>MarionetteJS 1.2.2</li>\r\n        <!--<li>MomentJS 2.2.1</li>-->\r\n        <li>jQuery 2.0.3</li>\r\n        <li>JQuery RateIt 1.0.19</li>\r\n        <li>Fastclick 0.6.10</li>\r\n        <li>Pace 0.4.15</li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <h3>Api</h3>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success\" href=\"https://github.com/vip32/eventfeedback/tree/master/Web.Api\" target=\"_blank\">\r\n          <i class=\"icon-circlegithub\"></i>\r\n          &emsp;Sources\r\n        </a>\r\n      </p>\r\n      <ul>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.apiinfo || (depth0 != null ? depth0.apiinfo : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"apiinfo","hash":{},"data":data}) : helper)))
    + "\">ApiInfo</a></li>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.help || (depth0 != null ? depth0.help : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"help","hash":{},"data":data}) : helper)))
    + "\">Documentation</a></li>\r\n        <li><a href=\""
    + escapeExpression(((helper = (helper = helpers.swagger || (depth0 != null ? depth0.swagger : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"swagger","hash":{},"data":data}) : helper)))
    + "\">Swagger</a></li>\r\n        <li>Microsoft .Net 4.5, C#</li>\r\n        <li>Microsoft ASP.NET Web API 2</li>\r\n        <li>Microsoft Entity Framework 6.0</li>\r\n        <li>Microsoft ASP.NET Identity 1.0</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <h3>Dev</h3>\r\n      <ul>\r\n        <li>\r\n          <a href=\"https://github.com/WindowsAzure\" target=\"_blank\">Windows Azure</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/joyent/node\" target=\"_blank\">Node.js</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/brunch/brunch\" target=\"_blank\">Brunch</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/jashkenas/coffee-script\" target=\"_blank\">Coffeescript</a>\r\n        </li>\r\n        <li>\r\n          <a href=\"https://github.com/bower/bower\" target=\"_blank\">Bower</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      &nbsp;\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-6 col-md-6\">\r\n      <!--<img src=\"http://qrfree.kaywa.com/?l=1&s=8&d=https%3A%2F%2Feventfeedback.azurewebsites.net\" alt=\"QRCode\"/>-->\r\n      <p>\r\n        <a href=\"/\">\r\n          <img class=\"qrimage\" height=\"88\" width=\"88\"/>\r\n        </a>\r\n        <a href=\"/\">\r\n          <img class=\"logoimage\" height=\"88\" width=\"88\" />\r\n        </a>\r\n      </p>\r\n    </div>\r\n    <div class=\"col-md-6\">\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-signout\" href=\"#\">\r\n          <i class=\"icon-user\"></i>\r\n          &emsp;Signout\r\n        </a>\r\n      </p>\r\n      <p>\r\n        <a class=\"btn btn-lg btn-success js-reset\" href=\"#\">\r\n          <i class=\"icon-bomb\"></i>\r\n          &emsp;Reset</a>\r\n      </p>\r\n      <p>\r\n        <span class=\"glyphicon glyphicon-user\">&emsp;user: "
    + escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user","hash":{},"data":data}) : helper)))
    + "/ role: "
    + escapeExpression(((helper = (helper = helpers.roles || (depth0 != null ? depth0.roles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"roles","hash":{},"data":data}) : helper)))
    + "/ admin: "
    + escapeExpression(((helper = (helper = helpers.admin || (depth0 != null ? depth0.admin : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"admin","hash":{},"data":data}) : helper)))
    + "/ auth: "
    + escapeExpression(((helper = (helper = helpers.auth || (depth0 != null ? depth0.auth : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"auth","hash":{},"data":data}) : helper)))
    + "</span>\r\n      </p>\r\n    </div>\r\n  </div>\r\n</div>";
},"useData":true});
});

require.register("modules/common/views/templates/debug", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "<div class=\"container\">\r\n  <h3>Debug</h3>\r\n  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\r\n  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\r\n  <p>To see the difference between static and fixed top navbars, just scroll.</p>\r\n    \r\n  <button class=\"js-triggerevent\">trigger</button>\r\n  <br/>user: "
    + escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user","hash":{},"data":data}) : helper)))
    + " \r\n  <br/>roles: "
    + escapeExpression(((helper = (helper = helpers.roles || (depth0 != null ? depth0.roles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"roles","hash":{},"data":data}) : helper)))
    + "\r\n  <br/>resources: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.TestKey1 : stack1), depth0))
    + "\r\n  <hr/>\r\n  <input type=\"datetime-local\"></input>\r\n  <div id=\"form\" class=\"well\"></div>\r\n\r\n  <div class=\"row pull-right\">\r\n    <div class=\"col-xs-12\">\r\n      <br/>\r\n      <button class=\"btn btn-danger btn-responsive js-remove\">\r\n        <span class=\"glyphicon glyphicon-remove\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Remove : stack1), depth0))
    + "\r\n      </button>\r\n      <button class=\"btn btn-success btn-responsive js-submit\">\r\n        <span class=\"glyphicon glyphicon-save\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Save : stack1), depth0))
    + "\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>";
},"useData":true});
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
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<p>© Company 2013 - "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + " ["
    + escapeExpression(((helper = (helper = helpers.time || (depth0 != null ? depth0.time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"time","hash":{},"data":data}) : helper)))
    + "]</p>";
},"useData":true});
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
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"container\">\r\n  <h3>Home</h3>\r\n  <p>\r\n    "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Home_Text : stack1), depth0))
    + "\r\n  </p>\r\n</div>";
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "checked";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"container\">\r\n  <form class=\"form-signin\">\r\n    <input type=\"text\" class=\"form-control\" placeholder=\"username\" name=\"username\" autofocus value=\""
    + escapeExpression(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"username","hash":{},"data":data}) : helper)))
    + "\"/>\r\n    <input type=\"password\" class=\"form-control\" placeholder=\"password\" name=\"password\" value=\""
    + escapeExpression(((helper = (helper = helpers.password || (depth0 != null ? depth0.password : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"password","hash":{},"data":data}) : helper)))
    + "\"/>\r\n    <p><!-- <button type=\"button\" class=\"btn btn-default\" data-toggle=\"button\">Remember me</button> -->\r\n\r\n    </p>\r\n    <div class=\"form-group pull-right\">\r\n      <label for=\"notification1\">Remember me</label>&emsp;\r\n      <input type=\"checkbox\"\r\n             id=\"make-switch\"\r\n             data-animate=\"false\"\r\n             data-on-text=\"yes\" data-off-text=\"no\"\r\n             data-on-color=\"success\" data-off-color=\"default\"\r\n             name=\"remember\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.remember : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "/>\r\n    </div>\r\n    <button class=\"btn btn-lg btn-success btn-block js-signin\">\r\n      <i class=\"icon-securityalt-shieldalt\"></i>&emsp;Sign in</button>\r\n  </form>\r\n</div>";
},"useData":true});
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
var Controller, Event, EventReport, EventTag, Feedback, FeedbackDefinition, Session, application, config, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

config = require('config');

vent = require('vent');

settings = require('settings');

Event = require('../../models/event');

Feedback = require('../../models/feedback');

FeedbackDefinition = require('../../models/feedbackdefinition');

Session = require('../../models/session');

EventReport = require('../../models/eventreport');

EventTag = require('../../models/eventtag');

user = require('user');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  Controller.prototype.resourceFilter = user.isAdministrator() ? 'all' : '';

  function Controller(options) {
    log('event controller init');
    application.addInitializer((function(_this) {
      return function(options) {
        _this.events = new Event.Collection();
        _this.feedbacks = new Feedback.Collection();
        _this.feedbackdefinitions = new FeedbackDefinition.Collection();
        _this.sessions = new Session.Collection();
        _this.eventreports = new EventReport.Collection();
        _this.eventtags = new EventTag.Collection();
        return vent.on('feedback:save', function(feedback) {
          return _this.saveFeedback(feedback);
        });
      };
    })(this));
  }

  Controller.prototype.showEventsIndex = function() {
    appInsights.trackEvent('event/showEventsIndex');
    vent.trigger('fetch:done');
    return this.events.fetch({
      reload: true,
      data: {
        filter: this.resourceFilter
      }
    }).done((function(_this) {
      return function(models) {
        return _this.feedbacks.fetch().done(function(feedbacks) {
          var View, view;
          vent.trigger('set:active:header', 'events:index', application.resources.key('Title_Events'), 'glyphicon-bookmark');
          View = require('./views/events-index-view');
          view = new View({
            collection: models,
            resources: application.resources
          });
          return application.layout.content.show(view);
        });
      };
    })(this));
  };

  Controller.prototype.showEventDetails = function(id) {
    appInsights.trackEvent('event/showEventDetails', {
      eventId: id
    });
    return this.events.fetch({
      data: {
        filter: this.resourceFilter
      }
    }).done((function(_this) {
      return function(models) {
        var event;
        event = models.get(id);
        if (event == null) {
          return vent.trigger('message:error:show', 'event not found');
        } else {
          vent.trigger('set:active:header', 'events:index', event.get('title'), 'glyphicon-bookmark');
          settings.set('active-event', id);
          return _this.eventtags.fetch({
            reload: true
          }).done(function(tags) {
            return _this.sessions.fetch({
              reload: true
            }).done(function(sessions) {
              var View, view;
              _this.sessions.each(function(session) {
                var commented;
                commented = _this.feedbacks.find(function(item) {
                  return (session.get('id') === item.get('sessionId')) && item.get('active');
                });
                return session.set('commented', commented != null);
              });
              View = require('./views/event-details-view');
              view = new View({
                model: event,
                collection: sessions,
                tags: tags,
                resources: application.resources
              });
              return application.layout.content.show(view);
            });
          });
        }
      };
    })(this));
  };

  Controller.prototype.showEventsNew = function() {
    return this.showEventEdit();
  };

  Controller.prototype.showEventEdit = function(id) {
    return this.events.fetch({
      data: {
        filter: this.resourceFilter
      }
    }).done((function(_this) {
      return function(models) {
        var event;
        event = models.get(id);
        if (event == null) {
          event = new Event.Model({
            active: true
          });
          _this.events.add(event);
        }
        vent.trigger('set:active:header', 'events:index', 'edit', 'glyphicon-bookmark');
        return _this.feedbackdefinitions.fetch({
          reload: true
        }).done(function(definitions) {
          var View, view;
          View = require('./views/event-edit-view');
          view = new View({
            model: event,
            collection: _this.events,
            definitions: definitions,
            resources: application.resources
          });
          return application.layout.content.show(view);
        });
      };
    })(this));
  };

  Controller.prototype.showEventReport = function(id) {
    settings.set('active-event', id);
    return this.eventreports.fetch({
      reload: true,
      data: {
        filter: this.resourceFilter
      }
    }).done((function(_this) {
      return function(models) {
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
      };
    })(this));
  };

  Controller.prototype.showSessionDetails = function(id) {
    appInsights.trackEvent('event/showSessionDetails', {
      sessionId: id
    });
    return this.sessions.fetch().done((function(_this) {
      return function(models) {
        var View, feedback, session, view;
        session = models.get(id);
        if (session == null) {
          return vent.trigger('message:error:show', 'session not found');
        } else {
          vent.trigger('set:active:header', 'events:index', session.get('title'), 'icon-comment');
          settings.set('active-session', id);
          feedback = _this.feedbacks.find(function(item) {
            return item.get('sessionId') === +id;
          });
          if (feedback == null) {
            feedback = new Feedback.Model({
              sessionId: id,
              feedbackDefinitionId: session.get('feedbackDefinitionId')
            });
            feedback.set('active', false);
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
      };
    })(this));
  };

  Controller.prototype.saveFeedback = function(feedback) {
    feedback.credentials = this.feedbacks.credentials;
    vent.trigger('fetch:start');
    return feedback.save(null, {
      success: (function(_this) {
        return function(model, response, options) {
          appInsights.trackEvent('event/saveFeedback');
          vent.trigger('message:success:show', application.resources.key('Feedback_Saved_Success'));
          vent.trigger('fetch:done');
          return vent.trigger('event:details', settings.get('active-event'));
        };
      })(this),
      error: (function(_this) {
        return function(model, xhr, options) {
          vent.trigger('message:error:show', application.resources.key('Feedback_Saved_Failed'));
          return vent.trigger('fetch:fail');
        };
      })(this)
    });
  };

  Controller.prototype.onClose = function() {
    return log('event controller close');
  };

  return Controller;

})(Backbone.Marionette.Controller);
});

;require.register("modules/event/router", function(exports, require, module) {
var Controller, Router, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

Controller = require('./controller');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.appRoutes = {
    'events': 'showEventsIndex',
    'events/:id': 'showEventDetails',
    'events/edit/:id': 'showEventEdit',
    'events/edit/new': 'showEventsNew',
    'sessions/:id': 'showSessionDetails',
    'eventreport/:id': 'showEventReport'
  };

  Router.prototype.initialize = function(options) {
    log('event router init');
    return application.addInitializer((function(_this) {
      return function(options) {
        vent.on('events:index', function() {
          return application.navigate('events');
        });
        vent.on('event:details', function(id) {
          return application.navigate('events/' + id);
        });
        vent.on('event:edit', function(id) {
          return application.navigate('events/edit/' + id);
        });
        vent.on('events:new', function() {
          return application.navigate('events/edit/new');
        });
        vent.on('session:details', function(id) {
          return application.navigate('sessions/' + id);
        });
        return vent.on('event:report', function(id) {
          return application.navigate('eventreport/' + id);
        });
      };
    })(this));
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/event/views/event-details-view", function(exports, require, module) {
var EventDetailsView, application, settings, user, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

user = require('user');

module.exports = EventDetailsView = (function(_super) {
  __extends(EventDetailsView, _super);

  function EventDetailsView() {
    this.onBack = __bind(this.onBack, this);
    return EventDetailsView.__super__.constructor.apply(this, arguments);
  }

  EventDetailsView.prototype.id = 'event-details-view';

  EventDetailsView.prototype.template = require('./templates/event-details');

  EventDetailsView.prototype.itemView = require('./session-item-view');

  EventDetailsView.prototype.itemViewContainer = '.js-sessions';

  EventDetailsView.prototype.events = {
    'click .js-edit': 'onEdit',
    'click .js-report': 'onReport',
    'change .js-tag': 'onTag'
  };

  EventDetailsView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    this.tags = options != null ? options.tags : void 0;
    vent.trigger('navigation:back:on');
    vent.on('navigation:back', this.onBack);
    return this.orgcoll = options != null ? new options.collection.constructor(options != null ? options.collection.models : void 0) : void 0;
  };

  EventDetailsView.prototype.serializeData = function() {
    var _ref, _ref1;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      tags: (_ref1 = this.tags) != null ? _ref1.toJSON() : void 0,
      model: this.model.toJSON(),
      isAdmin: user.isAdministrator()
    };
  };

  EventDetailsView.prototype.itemViewOptions = function() {
    return {
      resources: this.resources
    };
  };

  EventDetailsView.prototype.onShow = function() {
    var tag;
    scrollTo(0, 0);
    tag = settings.get('active-eventtag');
    this.$("input:radio[name='tags'][value='" + tag + "']").attr('checked', 'checked').parent().addClass('active');
    return this.filterByTag(tag);
  };

  EventDetailsView.prototype.onTag = function(e) {
    e.preventDefault();
    return this.filterByTag(this.$("input:radio[name='tags']:checked").val());
  };

  EventDetailsView.prototype.filterByTag = function(tag) {
    if (tag != null) {
      settings.set('active-eventtag', tag);
      if (_.isEmpty(tag)) {
        return this.collection.reset(this.orgcoll.models);
      } else {
        return this.collection.reset(this.orgcoll.filterForTag(tag));
      }
    }
  };

  EventDetailsView.prototype.onBack = function() {
    log('back from event-details');
    return vent.trigger('events:index');
  };

  EventDetailsView.prototype.onEdit = function(e) {
    e.preventDefault();
    return vent.trigger('event:edit', settings.get('active-event'));
  };

  EventDetailsView.prototype.onReport = function(e) {
    e.preventDefault();
    return vent.trigger('event:report', settings.get('active-event'));
  };

  EventDetailsView.prototype.onClose = function() {
    vent.off('navigation:back', this.onBack);
    return log('events-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/event/views/event-edit-view", function(exports, require, module) {
var EventEditView, application, settings, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

module.exports = EventEditView = (function(_super) {
  __extends(EventEditView, _super);

  function EventEditView() {
    this.onBack = __bind(this.onBack, this);
    return EventEditView.__super__.constructor.apply(this, arguments);
  }

  EventEditView.prototype.id = 'event-report-view';

  EventEditView.prototype.template = require('./templates/event-edit');

  EventEditView.prototype.events = {
    'click .js-submit': 'onSubmit',
    'click .js-remove': 'onRemove'
  };

  EventEditView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    this.definitions = options != null ? options.definitions : void 0;
    vent.trigger('navigation:back:on');
    return vent.on('navigation:back', this.onBack);
  };

  EventEditView.prototype.serializeData = function() {
    var _ref, _ref1;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      definitions: (_ref1 = this.definitions) != null ? _ref1.toJSON() : void 0
    };
  };

  EventEditView.prototype.onShow = function() {
    scrollTo(0, 0);
    this.form = new Backbone.Form({
      model: this.model
    });
    this.form.schema.feedbackDefinitionId.options = this.definitions.map(function(def) {
      return {
        val: def.get('id'),
        label: def.get('title')
      };
    });
    this.form.initialize();
    return this.$('#form').append(this.form.render().el);
  };

  EventEditView.prototype.onSubmit = function(e) {
    var errors;
    e.preventDefault();
    errors = this.form.commit({
      validate: true
    });
    if (_.isEmpty(errors)) {
      this.model.set('key', _.str.slugify(this.model.get('title')));
      this.model.credentials = this.collection.credentials;
      this.model.save({
        wait: true
      });
      return this.onBack();
    }
  };

  EventEditView.prototype.onRemove = function(e) {
    return e.preventDefault();
  };

  EventEditView.prototype.onBack = function() {
    log('back from event-edit');
    return vent.trigger('events:index');
  };

  EventEditView.prototype.onClose = function() {
    vent.off('navigation:back', this.onBack);
    return log('event-edit view close');
  };

  return EventEditView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/event/views/event-item-view", function(exports, require, module) {
var EventItemView, ItemView, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = EventItemView = (function(_super) {
  __extends(EventItemView, _super);

  function EventItemView() {
    return EventItemView.__super__.constructor.apply(this, arguments);
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
    return vent.trigger('event:details', this.model.get('id'));
  };

  return EventItemView;

})(ItemView);
});

;require.register("modules/event/views/event-report-view", function(exports, require, module) {
var EventReportView, application, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

module.exports = EventReportView = (function(_super) {
  __extends(EventReportView, _super);

  function EventReportView() {
    this.onBack = __bind(this.onBack, this);
    return EventReportView.__super__.constructor.apply(this, arguments);
  }

  EventReportView.prototype.id = 'event-report-view';

  EventReportView.prototype.template = require('./templates/event-report');

  EventReportView.prototype.events = {
    'click .js-print': 'onPrintClick'
  };

  EventReportView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    vent.trigger('navigation:back:on');
    return vent.on('navigation:back', this.onBack);
  };

  EventReportView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      model: this.model.toJSON(),
      json: JSON.stringify(this.model, null, 4)
    };
  };

  EventReportView.prototype.onPrintClick = function(e) {
    var css, sessionId;
    e.preventDefault();
    sessionId = $(e.currentTarget).attr('data-sessionId');
    css = '<link href="www/stylesheets/app.css" rel="stylesheet" type="text/css">';
    window.frames["print_frame"].document.body.innerHTML = css + document.getElementById(sessionId).innerHTML;
    window.frames["print_frame"].window.focus();
    return window.frames["print_frame"].window.print();
  };

  EventReportView.prototype.onBack = function() {
    var _ref;
    log('back from event-report');
    return vent.trigger('event:details', (_ref = this.model) != null ? _ref.id : void 0);
  };

  EventReportView.prototype.onClose = function() {
    vent.off('navigation:back', this.onBack);
    return log('event-report view close');
  };

  return EventReportView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/event/views/events-index-view", function(exports, require, module) {
var Event, EventIndexView, application, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

Event = require('../../../models/event');

user = require('user');

module.exports = EventIndexView = (function(_super) {
  __extends(EventIndexView, _super);

  function EventIndexView() {
    return EventIndexView.__super__.constructor.apply(this, arguments);
  }

  EventIndexView.prototype.id = 'event-index-view';

  EventIndexView.prototype.template = require('./templates/events-index');

  EventIndexView.prototype.itemView = require('./event-item-view');

  EventIndexView.prototype.itemViewContainer = '.js-events';

  EventIndexView.prototype.events = {
    'click .js-new': 'onNew'
  };

  EventIndexView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return vent.trigger('navigation:back:off');
  };

  EventIndexView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      isAdmin: user.isAdministrator()
    };
  };

  EventIndexView.prototype.onNew = function(e) {
    e.preventDefault();
    return vent.trigger('events:new');
  };

  EventIndexView.prototype.onClose = function() {
    return log('events-index view close');
  };

  return EventIndexView;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/event/views/session-details-view", function(exports, require, module) {
var EventDetailsView, application, user, vent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

user = require('user');

module.exports = EventDetailsView = (function(_super) {
  __extends(EventDetailsView, _super);

  function EventDetailsView() {
    this.onBack = __bind(this.onBack, this);
    return EventDetailsView.__super__.constructor.apply(this, arguments);
  }

  EventDetailsView.prototype.id = 'session-details-view';

  EventDetailsView.prototype.template = require('./templates/session-details');

  EventDetailsView.prototype.events = {
    'click .js-submit': 'onSubmit',
    'click .js-remove': 'onRemove',
    'change textarea': 'onChange',
    'input textarea': 'onChange'
  };

  EventDetailsView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    this.feedback = options != null ? options.feedback : void 0;
    vent.trigger('navigation:back:on');
    return vent.on('navigation:back', this.onBack);
  };

  EventDetailsView.prototype.serializeData = function() {
    var _ref, _ref1;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      model: this.model.toJSON(),
      feedback: (_ref1 = this.feedback) != null ? _ref1.toJSON() : void 0,
      feedbackdefinition: this.model.get('feedbackDefinition'),
      isGuest: user.isGuest()
    };
  };

  EventDetailsView.prototype.onBack = function() {
    log('back from session-details');
    return vent.trigger('event:details', this.model.get('eventId'));
  };

  EventDetailsView.prototype.onShow = function() {
    var id, _i;
    scrollTo(0, 0);
    for (id = _i = 0; _i <= 9; id = ++_i) {
      $("#rateit" + id).rateit();
    }
    return $('textarea').autosize();
  };

  EventDetailsView.prototype.onChange = function(e) {
    var maxlength;
    maxlength = $(e.currentTarget).attr('data-maxlength');
    if (maxlength > 0 && $(e.currentTarget).val().length > maxlength) {
      return $(e.currentTarget).val($(e.currentTarget).val().substring(0, maxlength));
    }
  };

  EventDetailsView.prototype.onRemove = function(e) {
    return e.preventDefault();
  };

  EventDetailsView.prototype.onSubmit = function(e) {
    var data;
    e.preventDefault();
    data = Backbone.Syphon.serialize(this);
    this.feedback.set('active', true);
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
    vent.off('navigation:back', this.onBack);
    return log('session-details view close');
  };

  return EventDetailsView;

})(Backbone.Marionette.ItemView);
});

;require.register("modules/event/views/session-item-view", function(exports, require, module) {
var ItemView, SessionItemView, application, settings, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

vent = require('vent');

settings = require('settings');

ItemView = require('../../../../lib/base/item-view');

module.exports = SessionItemView = (function(_super) {
  __extends(SessionItemView, _super);

  function SessionItemView() {
    return SessionItemView.__super__.constructor.apply(this, arguments);
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

  SessionItemView.prototype.onShow = function() {
    if (this.model.get('feedbackAllowed') === false) {
      log(this.model, this.model.get('feedbackAllowed'));
      return this.$el.addClass('nofeedback');
    }
  };

  SessionItemView.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0,
      model: this.model.toJSON()
    };
  };

  SessionItemView.prototype.onClick = function(e) {
    e.preventDefault();
    this.$el.addClass('active');
    settings.set('active-session', this.model.get('id'));
    return vent.trigger('session:details', this.model.get('id'));
  };

  return SessionItemView;

})(ItemView);
});

;require.register("modules/event/views/templates/event-details", function(exports, require, module) {
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.name : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "        <label class=\"btn badge\">\r\n          <input type=\"radio\" class=\"js-tag\" name=\"tags\" value=\""
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</input>\r\n        </label>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  <div class=\"row pull-right\">\r\n    <div class=\"col-xs-12\">\r\n      <br/>\r\n      <a class=\"btn btn-success btn-responsive js-edit\" href=\"#\">\r\n        <span class=\"glyphicon glyphicon-edit\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Edit : stack1), depth0))
    + "\r\n      </a>\r\n      <a class=\"btn btn-success btn-responsive js-report\" href=\"#\">\r\n        <span class=\"glyphicon glyphicon-list\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Report : stack1), depth0))
    + "\r\n      </a>\r\n    </div>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n      <div class=\"btn-group pull-right\" data-toggle=\"buttons\">\r\n        <label class=\"btn btn-primary badge\">\r\n          <input type=\"radio\" class=\"js-tag\" name=\"tags\" value=\"\">&nbsp;&nbsp;\r\n          </input>\r\n        </label>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tags : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"list-group js-sessions\">\r\n    <!-- sessions -->\r\n  </div>\r\n\r\n  <div class=\"row pull-right\">\r\n    <div class=\"col-xs-12\">\r\n      <p>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\r\n    </div>\r\n  </div>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isAdmin : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
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

;require.register("modules/event/views/templates/event-edit", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"container\">\r\n  <div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n      <div id=\"form\" class=\"well\"></div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row pull-right\">\r\n    <div class=\"col-xs-12\">\r\n      <br/>\r\n      <button class=\"btn btn-danger btn-responsive js-remove\">\r\n        <span class=\"glyphicon glyphicon-remove\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Remove : stack1), depth0))
    + "\r\n      </button>\r\n      <button class=\"btn btn-success btn-responsive js-submit\">\r\n        <span class=\"glyphicon glyphicon-save\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Save : stack1), depth0))
    + "\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>";
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div>\r\n<div class=\"glyphicon glyphicon-map-marker\"></div>\r\n  &emsp;&emsp;"
    + escapeExpression(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"location","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div>\r\n  <div class=\"glyphicon glyphicon-bookmark\"></div>\r\n    &emsp;&emsp;<strong>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</strong>\r\n</div>\r\n<div>\r\n<div class=\"glyphicon glyphicon-time\"></div>\r\n  &emsp;&emsp;"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.startDate : depth0), {"name":"dateFormat","hash":{
    'format': ("DD.MM.YYYY")
  },"data":data})))
    + "\r\n</div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.location : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "  <div id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\" class=\"list-group-item js-session\" style=\"page-break-after: always;\">\r\n    <div>\r\n      <strong>\r\n        <div class=\"glyphicon glyphicon-bookmark\"></div>\r\n        &emsp;&emsp;"
    + escapeExpression(lambda(((stack1 = (depths[1] != null ? depths[1].model : depths[1])) != null ? stack1.title : stack1), depth0))
    + " <br/>\r\n        <div class=\"glyphicon icon-presentation\"></div>\r\n        &emsp;&emsp;"
    + escapeExpression(lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "\r\n      </strong>&emsp;<span class=\"badge\">"
    + escapeExpression(lambda((depth0 != null ? depth0.averageRate : depth0), depth0))
    + "</span>\r\n      <button class=\"btn btn-lg btn-success pull-right noprint js-print\" data-sessionId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\"><div class=\"glyphicon glyphicon-print\"></div>&emsp;Print</button>\r\n    </div>\r\n    ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tags : depth0), {"name":"each","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n    <div>\r\n      <div class=\"glyphicon glyphicon-user\"></div>\r\n      &emsp;&emsp;"
    + escapeExpression(((helpers.seperatelist || (depth0 && depth0.seperatelist) || helperMissing).call(depth0, (depth0 != null ? depth0.speakerList : depth0), {"name":"seperatelist","hash":{},"data":data})))
    + "\r\n    </div>\r\n    <div>\r\n      <div class=\"glyphicon glyphicon-time\"></div>\r\n      &emsp;&emsp;"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.startDate : depth0), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "-"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.endDate : depth0), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "\r\n      &emsp;&emsp;<div class=\"glyphicon glyphicon-map-marker\"></div>\r\n      &emsp;&emsp;"
    + escapeExpression(lambda(((stack1 = (depths[1] != null ? depths[1].model : depths[1])) != null ? stack1.location : stack1), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.location : depth0), depth0))
    + "\r\n    </div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.feedbackAllowed : depth0), {"name":"if","hash":{},"fn":this.program(4, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<span class=\"badge pull-right\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</span>";
},"4":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "    <div>\r\n      <hr/>\r\n      <ol>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle0 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion0 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle1 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion1 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle2 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion2 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle3 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion3 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle4 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion4 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle5 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion5 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle6 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion6 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(17, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle7 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion7 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(19, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle8 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion8 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(21, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li>\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.quesstionTitle9 : depth0), depth0))
    + ":&emsp;";
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion9 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(23, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n      </ol>\r\n    </div>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.feedbacks : depth0), {"name":"each","hash":{},"fn":this.program(25, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer0 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion0 : depth0), depth0));
},"7":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer1 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion1 : depth0), depth0));
},"9":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer2 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion2 : depth0), depth0));
},"11":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer3 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion3 : depth0), depth0));
},"13":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer4 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion4 : depth0), depth0));
},"15":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer5 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion5 : depth0), depth0));
},"17":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer6 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion6 : depth0), depth0));
},"19":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer7 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion7 : depth0), depth0));
},"21":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer8 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion8 : depth0), depth0));
},"23":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return escapeExpression(lambda((depth0 != null ? depth0.averageRateAnswer9 : depth0), depth0))
    + "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion9 : depth0), depth0));
},"25":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "    <div>\r\n      <h4>\r\n        <span class=\"label label-default\">\r\n          Feedback "
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.createDate : depth0), {"name":"dateFormat","hash":{
    'format': ("MM.DD.YYYY hh:mm")
  },"data":data})))
    + "\r\n        </span>\r\n        &emsp;<span class=\"badge\">"
    + escapeExpression(lambda((depth0 != null ? depth0.averageRate : depth0), depth0))
    + "</span>\r\n      </h4>\r\n      <ol>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle0 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer0 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion0 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(26, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle1 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer1 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion1 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(28, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle2 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer2 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion2 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(30, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle3 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer3 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion3 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(32, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle4 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer4 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion4 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(34, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle5 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer5 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion5 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(36, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle6 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer6 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion6 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(38, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle7 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer7 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion7 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(40, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle8 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer8 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion8 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(42, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n        </li>\r\n        <li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].quesstionTitle9 : depths[1]), depth0))
    + "\">\r\n          "
    + escapeExpression(lambda((depth0 != null ? depth0.answer9 : depth0), depth0));
  stack1 = ((helpers.unlessCond || (depth0 && depth0.unlessCond) || helperMissing).call(depth0, (depth0 != null ? depth0.maxRateQuestion9 : depth0), "0", {"name":"unlessCond","hash":{},"fn":this.program(44, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n        </li>\r\n      </ol>\r\n    </div>\r\n";
},"26":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion0 : depth0), depth0));
},"28":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion1 : depth0), depth0));
},"30":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion2 : depth0), depth0));
},"32":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion3 : depth0), depth0));
},"34":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion4 : depth0), depth0));
},"36":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion5 : depth0), depth0));
},"38":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion6 : depth0), depth0));
},"40":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion7 : depth0), depth0));
},"42":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion8 : depth0), depth0));
},"44":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "/ "
    + escapeExpression(lambda((depth0 != null ? depth0.maxRateQuestion9 : depth0), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "﻿<div class=\"container\">\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.sessions : stack1), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n  <textarea>\r\n    "
    + escapeExpression(((helper = (helper = helpers.json || (depth0 != null ? depth0.json : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"json","hash":{},"data":data}) : helper)))
    + "\r\n  </textarea>\r\n  <iframe name=\"print_frame\" width=\"0\" height=\"0\" frameborder=\"0\" src=\"about:blank\"></iframe>\r\n</div>";
},"useData":true,"useDepths":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  <div class=\"row pull-right\">\r\n    <div class=\"col-xs-12\">\r\n      <br/>\r\n      <button class=\"btn btn-success btn-responsive js-new\">\r\n        <span class=\"glyphicon glyphicon-plus\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_New : stack1), depth0))
    + "\r\n      </button>\r\n    </div>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"container\">\r\n  <div class=\"list-group js-events\" style=\"margin-top:39px;\">\r\n    <!-- events -->\r\n  </div>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isAdmin : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<span class=\"badge pull-right\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</span>";
},"3":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div>\r\n        <div class=\"glyphicon glyphicon-map-marker\"></div>\r\n        &emsp;&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.location : stack1), depth0))
    + "\r\n      </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType0 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType0 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType0 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType0 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType0 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title0 : stack1), depth0))
    + " </div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer0\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title0 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer0\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title0 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
  return "";
},"13":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title0 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"15":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title0 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer0\" id=\"answer0\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer0\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer0 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing0\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit0\" data-rateit-backingfld=\"#backing0\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"17":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType1 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType1 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType1 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(22, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType1 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(24, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType1 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(26, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"18":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title1 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer1\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"20":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title1 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer1\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"22":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title1 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"24":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title1 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"26":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title1 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer1\" id=\"answer1\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer1\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer1 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing1\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit1\" data-rateit-backingfld=\"#backing1\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"28":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType2 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(29, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType2 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(31, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType2 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(33, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType2 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(35, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType2 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(37, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"29":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title2 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer2\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"31":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title2 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer2\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"33":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title2 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"35":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title2 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"37":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title2 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer2\" id=\"answer2\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer2\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer2 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing2\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit2\" data-rateit-backingfld=\"#backing2\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"39":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType3 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(40, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType3 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(42, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType3 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(44, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType3 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(46, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType3 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(48, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"40":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title3 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer3\" maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"42":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title3 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer3\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"44":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title3 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"46":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title3 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"48":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title3 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer3\" id=\"answer3\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer3\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer3 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing3\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit3\" data-rateit-backingfld=\"#backing3\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"50":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType4 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(51, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType4 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(53, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType4 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(55, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType4 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(57, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType4 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(59, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"51":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title4 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer4\" id=\"answer4\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"53":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title4 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer4\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"55":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title4 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"57":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title4 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"59":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title4 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer4\" id=\"answer4\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer4\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer4 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing4\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit4\" data-rateit-backingfld=\"#backing4\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"61":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType5 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(62, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType5 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(64, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType5 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(66, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType5 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(68, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType5 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(70, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"62":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title5 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer5\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"64":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title5 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer5\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"66":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title5 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"68":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title5 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"70":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title5 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer5\" id=\"answer5\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer5\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer5 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing5\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit5\" data-rateit-backingfld=\"#backing5\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"72":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType6 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(73, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType6 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(75, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType6 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(77, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType6 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(79, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType6 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(81, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"73":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title6 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer6\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"75":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title6 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer6\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"77":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title6 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"79":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title6 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"81":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title6 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer6\" id=\"answer6\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer6\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer6 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing6\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit6\" data-rateit-backingfld=\"#backing6\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"83":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType7 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(84, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType7 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(86, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType7 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(88, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType7 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(90, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType7 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(92, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"84":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title7 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer7\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"86":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title7 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer7\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"88":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title7 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"90":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title7 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"92":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title7 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer7\" id=\"answer7\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer7\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer7 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing7\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit7\" data-rateit-backingfld=\"#backing7\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"94":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType8 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(95, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType8 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(97, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType8 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(99, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType8 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(101, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType8 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(103, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"95":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title8 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer8\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"97":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title8 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer8\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"99":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title8 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"101":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title8 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"103":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title8 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer8\" id=\"answer8\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer8\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer8 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing8\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit8\" data-rateit-backingfld=\"#backing8\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"105":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "    <div class=\"row\">\r\n";
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType9 : stack1), 0, {"name":"ifCond","hash":{},"fn":this.program(106, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType9 : stack1), 1, {"name":"ifCond","hash":{},"fn":this.program(108, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType9 : stack1), 10, {"name":"ifCond","hash":{},"fn":this.program(110, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType9 : stack1), 11, {"name":"ifCond","hash":{},"fn":this.program(112, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.questionType9 : stack1), 12, {"name":"ifCond","hash":{},"fn":this.program(114, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\r\n";
},"106":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title9 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <textarea name=\"answer9\" data-maxlength=\"2048\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), depth0))
    + "</textarea>\r\n      </div>\r\n";
},"108":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <div class=\"col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title9 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-md-9\">\r\n        <input type=\"text\" name=\"answer9\" maxlength=\"2048\" value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), depth0))
    + "\"/>\r\n      </div>\r\n";
},"110":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title9 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"3\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"3\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"112":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title9 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"5\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"5\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"114":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "      <div class=\"col-xs-4 col-md-3\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.title9 : stack1), depth0))
    + "</div>\r\n      <div class=\"col-xs-8 col-md-9\">\r\n        <!--<input type=\"number\" data-max=\"10\" data-min=\"1\"\r\n             name=\"answer9\" id=\"answer9\" class=\"rating\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" />-->\r\n        <input name=\"answer9\" type=\"range\" min=\"0\" max=\"10\" value=\"";
  stack1 = ((helpers.zerowhenempty || (depth0 && depth0.zerowhenempty) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.feedback : depth0)) != null ? stack1.answer9 : stack1), {"name":"zerowhenempty","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" step=\"0.5\" id=\"backing9\"/>\r\n        <div class=\"rateit bigstars\" id=\"rateit9\" data-rateit-backingfld=\"#backing9\" data-rateit-starwidth=\"32\" data-rateit-starheight=\"32\" data-rateit-resetable=\"false\"></div>\r\n      </div>\r\n";
},"116":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.feedbackAllowed : stack1), {"name":"if","hash":{},"fn":this.program(117, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"117":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <div class=\"row pull-right\">\r\n      <div class=\"col-xs-12\">\r\n        <br/>\r\n        <!--<button class=\"btn btn-danger btn-responsive js-remove\">\r\n          <span class=\"glyphicon glyphicon-remove\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Remove : stack1), depth0))
    + "\r\n        </button>-->\r\n        <button class=\"btn btn-success btn-responsive js-submit\">\r\n          <span class=\"glyphicon glyphicon-save\"></span>&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.resources : depth0)) != null ? stack1.Text_Save : stack1), depth0))
    + "\r\n        </button>\r\n      </div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<div class=\"container\">\r\n\r\n  <div class=\"list-group\" style=\"margin-top:39px;\">\r\n    <div id=\"session-item-view\" class=\"list-group-item\">\r\n      <div>\r\n        <div class=\"glyphicon icon-presentation\"></div>\r\n        &emsp;&emsp;<strong>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.title : stack1), depth0))
    + "</strong>\r\n      </div>\r\n      ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.tags : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n      <div>\r\n      <div>\r\n        <div class=\"glyphicon glyphicon-user\"></div>\r\n        &emsp;&emsp;"
    + escapeExpression(((helpers.seperatelist || (depth0 && depth0.seperatelist) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.speakerList : stack1), {"name":"seperatelist","hash":{},"data":data})))
    + "\r\n      </div>\r\n      <div class=\"glyphicon glyphicon-time\"></div>\r\n        &emsp;&emsp;"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.startDate : stack1), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "-"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.endDate : stack1), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "\r\n      </div>\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.location : stack1), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "      <br/><br/>\r\n      <p>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\r\n    </div>\r\n  </div>\r\n\r\n  <form>\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active0 : stack1), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active1 : stack1), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active2 : stack1), {"name":"if","hash":{},"fn":this.program(28, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active3 : stack1), {"name":"if","hash":{},"fn":this.program(39, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active4 : stack1), {"name":"if","hash":{},"fn":this.program(50, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active5 : stack1), {"name":"if","hash":{},"fn":this.program(61, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active6 : stack1), {"name":"if","hash":{},"fn":this.program(72, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active7 : stack1), {"name":"if","hash":{},"fn":this.program(83, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active8 : stack1), {"name":"if","hash":{},"fn":this.program(94, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.feedbackdefinition : depth0)) != null ? stack1.active9 : stack1), {"name":"if","hash":{},"fn":this.program(105, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.isGuest : depth0), {"name":"unless","hash":{},"fn":this.program(116, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </form>\r\n\r\n</div>";
},"useData":true});
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
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<div class=\"commented pull-right glyphicon icon-comment\"></div>";
  },"3":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<span class=\"badge pull-right\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</span>";
},"5":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div>\r\n  <div class=\"glyphicon glyphicon-map-marker\"></div>\r\n  &emsp;&emsp;"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.location : stack1), depth0))
    + "\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<div>\r\n  <div class=\"glyphicon icon-presentation\"></div>\r\n  &emsp;&emsp;<strong>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.title : stack1), depth0))
    + " ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.commented : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</strong>\r\n</div>\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.tags : stack1), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n<div>\r\n<div>\r\n  <div class=\"glyphicon glyphicon-user\"></div>\r\n  &emsp;&emsp;"
    + escapeExpression(((helpers.seperatelist || (depth0 && depth0.seperatelist) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.speakerList : stack1), {"name":"seperatelist","hash":{},"data":data})))
    + "\r\n</div>\r\n<div class=\"glyphicon glyphicon-time\"></div>\r\n  &emsp;&emsp;"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.startDate : stack1), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "-"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.endDate : stack1), {"name":"dateFormat","hash":{
    'format': ("HH:mm")
  },"data":data})))
    + "\r\n</div>\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.location : stack1), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
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
var Controller, Header, application, settings, user, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('../../lib/base/controller');

Header = require('../../models/header');

vent = require('vent');

settings = require('settings');

user = require('user');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller(options) {
    log('header controller init');
    application.addInitializer((function(_this) {
      return function(options) {
        _this.headers = new Header.Collection();
        new Header.TestData().addTo(_this.headers);
        return vent.on('resources:loaded', function() {
          return _this.showHeader();
        });
      };
    })(this));
  }

  Controller.prototype.showHeader = function() {
    var View, view;
    View = require('./views/header-view');
    view = new View.Header({
      collection: this.headers.active(user.roles()),
      resources: application.resources
    });
    return application.layout.header.show(view);
  };

  Controller.prototype.onClose = function() {
    return log('header controller close');
  };

  return Controller;

})(Controller);
});

;require.register("modules/header/router", function(exports, require, module) {
var Controller, Router, application, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

Controller = require('./controller');

vent = require('vent');

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.initialize = function(options) {
    log('header router init');
    return application.addInitializer((function(_this) {
      return function(options) {
        application.on('start', function() {
          return _this.controller.showHeader();
        });
        return vent.on('header:refresh', function() {
          return _this.controller.showHeader();
        });
      };
    })(this));
  };

  Router.prototype.controller = new Controller();

  return Router;

})(Backbone.Marionette.AppRouter);
});

;require.register("modules/header/views/header-view", function(exports, require, module) {
var ItemView, View, application, config, vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

config = require('config');

vent = require('vent');

module.exports.HeaderItem = ItemView = (function(_super) {
  __extends(ItemView, _super);

  function ItemView() {
    return ItemView.__super__.constructor.apply(this, arguments);
  }

  ItemView.prototype.id = 'header-item-view';

  ItemView.prototype.template = require('./templates/header-item');

  ItemView.prototype.tagName = 'li';

  ItemView.prototype.events = {
    'click': 'onClick'
  };

  ItemView.prototype.initialize = function(options) {
    this.resources = options != null ? options.resources : void 0;
    return vent.on('set:active:header', (function(_this) {
      return function(trigger, title, glyphicon) {
        if (trigger === _this.model.get('trigger')) {
          return _this.setActive();
        } else {
          return _this.setInactive();
        }
      };
    })(this));
  };

  ItemView.prototype.serializeData = function() {
    var _ref, _ref1, _ref2;
    return {
      title: (_ref = (_ref1 = this.resources.find(((function(_this) {
        return function(resource) {
          return resource.get('key') === _this.model.get('resource');
        };
      })(this)))) != null ? _ref1.get('value') : void 0) != null ? _ref : this.model.get('title'),
      href: this.model.get('href'),
      icon: (_ref2 = this.model.get('glyphicon')) != null ? _ref2 : config.sidebarglyphicon
    };
  };

  ItemView.prototype.onClick = function(e) {
    e.preventDefault();
    vent.trigger('sidebar:hide');
    return vent.trigger(this.model.get('trigger'));
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
    return View.__super__.constructor.apply(this, arguments);
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
    this.resources = options != null ? options.resources : void 0;
    vent.on('set:active:header', (function(_this) {
      return function(trigger, title, icon) {
        return _this.setSubHeader(title, icon);
      };
    })(this));
    vent.on('fetch:start', (function(_this) {
      return function(title) {
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
      };
    })(this));
    vent.on('fetch:done', (function(_this) {
      return function() {
        if (config.spinneractive) {
          $('#spinner').spin(false);
        }
        return $('#wrapper').unblock();
      };
    })(this));
    vent.on('fetch:fail', (function(_this) {
      return function() {
        if (config.spinneractive) {
          $('#spinner').spin(false);
        }
        return $('#wrapper').unblock();
      };
    })(this));
    vent.on('navigation:back:on', function() {
      return $('#menu-back').show();
    });
    return vent.on('navigation:back:off', function() {
      return $('#menu-back').hide();
    });
  };

  View.prototype.serializeData = function() {
    var _ref;
    return {
      resources: (_ref = this.resources) != null ? _ref.toJSON() : void 0
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
    return vent.trigger('sidebar:toggle');
  };

  View.prototype.onBack = function(e) {
    e.preventDefault();
    return vent.trigger('navigation:back');
  };

  View.prototype.setSubHeader = function(title, icon) {
    this.$('#js-subtitle').text(title);
    this.$('#js-subtitle-glyph').removeClass();
    return this.$('#js-subtitle-glyph').addClass("glyphicon " + icon);
  };

  return View;

})(Backbone.Marionette.CompositeView);
});

;require.register("modules/header/views/templates/header-item", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a href=\"#"
    + escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"href","hash":{},"data":data}) : helper)))
    + "\">\r\n  <span class=\"glyphicon "
    + escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span>\r\n  &nbsp;&nbsp;&nbsp;"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\r\n</a>";
},"useData":true});
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
var __templateData = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <!-- Sidebar -->\r\n  <div id=\"sidebar-wrapper\">\r\n    <ul class=\"sidebar-nav js-headers\">\r\n      <!-- <li class=\"sidebar-brand\">\r\n        <a id=\"menu-toggle\" href=\"#\">&nbsp;&nbsp;&nbsp;&nbsp; -->\r\n          <!-- <span class=\"glyphicon glyphicon-align-justify\"></span> -->\r\n        <!-- </a>\r\n      </li> -->\r\n      <!-- headers -->\r\n    </ul>\r\n  </div>\r\n\r\n  <!-- Page header -->\r\n  <div id=\"page-content-wrapper\">\r\n    <div class=\"content-header row\">\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-toggle\" href=\"#\" class=\"btn btn-primary pull-left\">\r\n           <span class=\"glyphicon glyphicon-align-justify\"></span>\r\n        </a>\r\n      </div>\r\n      <div class=\"col-xs-7 col-md-9\">\r\n        <div>\r\n          <div class=\"content-header-title js-apptitle\"></div>\r\n          <div class=\"content-header-subtitle\">\r\n            <span class=\"\" id=\"js-subtitle-glyph\">\r\n              <span id=\"js-subtitle\"></span>\r\n            </span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-xs-1 col-md-1\" style=\"margin-top:27px\">\r\n        <span id=\"spinner\"></span>\r\n      </div>\r\n      <div class=\"col-xs-2 col-md-1\">\r\n        <a id=\"menu-back\" href=\"#\" class=\"btn btn-default pull-right\">\r\n          <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n        </a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!--\r\n  <div class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <div class=\"container\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"http://brunch.io\">Brunch</a>\r\n    </div>\r\n    <div class=\"navbar-collapse collapse no-transition\">\r\n      <ul class=\"nav navbar-nav\">\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div> -->";
  },"useData":true});
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

    /* initializes this instance */
    log('settings store init');
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

    /* get the value attribute for an item */
    return this.store.getValue(id);
  };

  Settings.prototype.getValueOrDefault = function(id, val) {

    /* get the value attribute for an item */
    return this.store.getValueOrDefault(id, val);
  };

  Settings.prototype.has = function(id) {

    /* looks through the collection for the specified id */
    return this.store.has(id);
  };

  Settings.prototype.destroy = function(id) {

    /* removes all (or by id) models from the collection and store */
    return this.store.destroy(id);
  };

  return Settings;

})();

module.exports = new Settings();
});

;require.register("user", function(exports, require, module) {
var User, settings;

settings = require('settings');

User = (function() {
  function User() {}


  /*
    encapsulates the current user
   */

  User.prototype.set = function(key, value) {
    return settings.set(key, value);
  };

  User.prototype.get = function(key) {
    return settings.get(key);
  };

  User.prototype.isAuthenticated = function() {
    return !(_.isEmpty(this.token()) || _.isEmpty(this.tokenexpires()));
  };

  User.prototype.isAdministrator = function() {
    return _.intersection(['Administrator'], this.roles()).length > 0;
  };

  User.prototype.isGuest = function() {
    return _.intersection(['Guest'], this.roles()).length > 0;
  };

  User.prototype.reset = function() {
    settings.destroy('api_token');
    settings.destroy('api_token_expires');
    settings.destroy('api_authenticated');
    settings.destroy('api_username');
    settings.destroy('api_remember');
    return settings.destroy('api_userroles');
  };

  User.prototype.token = function(value) {
    if (!_.isEmpty(value)) {
      return settings.set('api_token', value);
    } else {
      return settings.get('api_token');
    }
  };

  User.prototype.tokenexpires = function(value) {
    if (!_.isEmpty(value)) {
      return settings.set('api_token_expires', value);
    } else {
      return settings.get('api_token_expires');
    }
  };

  User.prototype.roles = function(values) {
    var _ref;
    if (!_.isEmpty(values)) {
      return settings.set('api_userroles', values);
    } else {
      return (_ref = settings.get('api_userroles')) != null ? _ref : [];
    }
  };

  User.prototype.name = function(value) {
    if (!_.isEmpty(value)) {
      return settings.set('api_username', value);
    } else {
      return settings.get('api_username');
    }
  };

  User.prototype.remember = function(value) {
    var _ref;
    if (_.isBoolean(value)) {
      return settings.set('api_remember', value);
    } else {
      return (_ref = settings.get('api_remember')) != null ? _ref : false;
    }
  };

  return User;

})();

module.exports = new User();
});

;require.register("vent", function(exports, require, module) {
var Vent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vent = (function(_super) {
  __extends(Vent, _super);

  function Vent() {
    return Vent.__super__.constructor.apply(this, arguments);
  }

  Vent.setup = function() {
    return this.on('all', function(name, options) {
      return log('vent:trigger -->', name, options);
    });
  };

  return Vent;

})(Backbone.Events);

module.exports = Vent;
});

;
//# sourceMappingURL=app.js.map