WeatherApp.module('Forecast', function (Forecast, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  /* = Start ---------------------------------------------------------------- */
  this.on('start', function (data) {
    Controller.init(data);
  })


  /* = Controller ----------------------------------------------------------- */
  var defaultForecast= {};

  var Controller = {
    init: function (data) {
      console.log("Forecast Data", data[0]);
      defaultForecast = data[0];

      var mainview = new ForecastMainView({data: data})
      var view = new ForecastSlice();
      App.mainContentRegion.show(mainview);
    }
  };

  /* = Views ---------------------------------------------------------------- */
  var ForecastSlice = Marionette.ItemView.extend({
    // tagName: 'article',
    className: 'forecast forecast-slice',

    initialize: function (options) {
      this.data = options.data;
    },

    serializeData: function () {
      return this.data;
    },
    template: function (serializeData) {
      return JST['weatherapp/forecast/templates/forecast_slice'](serializeData)
    },
  });




  ForecastMainView = Marionette.LayoutView.extend({
    className: 'forecast-slices-wrapper',
    initialize: function (options) {
      this.data = options.data
    },

    template: function () {
      return _.template('')();
    },

    onRender: function () {
      var docFrag = document.createDocumentFragment();
      this.data.forEach(function (d) {
        var view = new ForecastSlice({data: d});
        docFrag.appendChild(view.render().el)
      });

      this.el.appendChild(docFrag);
    }
  })


});
