WeatherApp.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  App.models = {};
  App.collections = {};


  App.models.Location = Backbone.Model.extend({
    initialize: function (opts) {
      //this.set('country', opts.c)
    }
  });

  App.collections.Locations = Backbone.Collection.extend({
    model: WeatherApp.models.Location
  });

});
