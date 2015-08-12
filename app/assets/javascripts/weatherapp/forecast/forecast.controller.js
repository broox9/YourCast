WeatherApp.module('Forecast', function (Forecast, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  /* = Start ---------------------------------------------------------------- */
  this.on('start', function (data) {
    Controller.init(data);
  })

  App.vent.on('city:selected', function (model) {
    console.log("Selected", model.attributes)
    var name = model.get('name');
    var country = model.get('c');
    var lat = model.get('lat')
    var lon = model.get('lon')
    Controller.showForecast(name, country,lat, lon)
  })


  /* = Controller ----------------------------------------------------------- */
  //var defaultForecast= {};

  var Controller = {
    init: function (data) {
      console.log("Forecast Data", data[0]);

      var mainview = new ForecastMainView({data: data})
      var view = new ForecastSlice();
      App.mainContentRegion.show(mainview);
    },

    showForecast: function (name, country, lat,lon) {
      var location = name.split(', ');
      var city = location[0];
      var region = location[1];
      var forecast = this.getForecast(region, city, lat, lon);

      $.when(forecast).done(function (data, status, xhr) {
        console.log("DATA", status, data);
        var view = this.getFullView(data);
        App.mainContentRegion.show(view);
      }.bind(this));
    },

    getForecast: function (region, city ,lat, lon) {
      var url_region = region.replace(/\s/g, '_' );
      var url_city = city.replace(/\s/g, '_' );
      var url = ['search/forecast', url_region, url_city].join('/');
      return $.ajax(url, {data: {lat: lat, lon: lon}});
    },

    getFullView: function (data) {
      return new ForecastFull({data: data});
    }
  };



  /* = Router --------------------------------------------------------------- */
  var Router = new Marionette.AppRouter({
    controller: Controller,
    appRoutes: {
      'forecast/:region/:city' : 'showForecast',
    }
  })



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


  var ForecastFull = Marionette.ItemView.extend({
    // tagName: 'article',
    className: 'forecast forecast-slice',

    initialize: function (options) {
      this.data = options.data;
    },

    serializeData: function () {
      return this.data;
    },
    template: function (serializeData) {
      return JST['weatherapp/forecast/templates/forecast_full'](serializeData)
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
