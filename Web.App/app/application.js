(function() {
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
