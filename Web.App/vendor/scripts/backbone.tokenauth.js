/*!
 * backbone.tokenauth.js v0.4.0
 * https://github.com/vip32/backbone.tokenauth
 *
 * Adds HTTP Bearer Token Authentication headers,
 * either by reading them from a model property,
 * or by parsing the model/collection.url.
 *
 * Copyright 2013, Vincent van Proosdij (@vip32), based on basicauth by Tom Spencer (@fiznool) and Luis Abreu (@lmjabreu)
 * backbone.tokenauth.js may be freely distributed under the MIT license.
 */
;( function (root, factory) {
  // AMD module if available
  if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root._, root.Backbone);
    }
}( this, function (_, Backbone) {

  // Add a public method so that anything else can also create the header
  Backbone.TokenAuth = {
    getHeader: function(credentials) {
      return {
        'Authorization': 'Bearer ' + credentials.token
      };
    }
  };

  // Store a copy of the original Backbone.sync
  var originalSync = Backbone.sync;

  /**
   * Override Backbone.sync
   *
   * If a token is present, set the Basic Auth header before the sync is performed.
   *
   * @param  {string} method  Contains the backbone operation. e.g.: read, reset, set
   * @param  {object} model   A Backbone model or collection
   * @param  {object} options Options to be passed over to Backbone.sync and jQuery
   * @return {object}         Reference to Backbone.sync for chaining
   */
  Backbone.sync = function (method, model, options) {

    // Basic Auth supports two modes: URL-based and function-based.
    var credentials, remoteUrl, remoteUrlParts;

    if(model.credentials) {
      // Try function-based.
      credentials = _.result(model, 'credentials');
    }

    // Add the token to the request headers if available
    if (credentials != null) {
      options.headers = options.headers || {};
      _.extend(options.headers, Backbone.TokenAuth.getHeader(credentials));
    }

    // Perform the sync
    return originalSync.call(model, method, model, options);
  };

}));
