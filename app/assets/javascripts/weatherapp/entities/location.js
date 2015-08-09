WeatherApp.models = {};
WeatherApp.collections = {};


WeatherApp.models.Location = Backbone.Model.extend({
  initialize: function (opts) {
    //this.set('country', opts.c)
  }
});

WeatherApp.collections.Locations = Backbone.Collection.extend({
  model: WeatherApp.models.Location
});
