WeatherApp.module('Forecast', function (Forecast, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.on('start', function (data) {
    Controller.init(data);
  })

  var defaultForecast= {};

  var Controller = {
    init: function (data) {
      console.log("Forecast Data", data[0]);
      defaultForecast = data[0];

      var view = new ForecastSlice();
      App.mainContentRegion.show(view);
    }
  };


  var ForecastSlice = Marionette.ItemView.extend({
    serializeData: function () {
      return defaultForecast;
    },
    template: function (serializeData) {
      return JST['weatherapp/forecast/templates/forecast_slice'](serializeData)
    },
  });



});
