WeatherApp.module('Forecast', function (Forecast, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  function name_formatter (name) {
    var formatted_name = name.replace(/\s/g, "_");
    return formatted_name;
  }

  App.vent.on({
    'city:selected': function (model) {
      var cityKey = API.processCityModel(model);
      API.showSelectedForecast(cityKey);
    },

    'app:init:fragment': function (fragment) {
      Forecast.router.navigate(fragment, {trigger: true});
    },

    'app:init:defaults': function (defaults) {
      API.setDefaults(defaults);
    }
  });


  /* = Controller ----------------------------------------------------------- */
  var API = {
    blockDefaults: false,
    init: function () {
      var loading = new LoadingView();
      App.MainLayout.mainContentRegion.show(loading);
    },

    setDefaults: function (defaults) {
      var mainview = new ForecastMainView({data: defaults})
      var view = new ForecastSlice();
      App.MainLayout.mainContentRegion.show(mainview);
    },

    reset: function () {
      if (App.defaultData) {
        this.setDefaults(App.defaultData);
      }
    },

    navTo: function (city, region) {
      // var cityKey = fragment.replace(/^\/?forecast/, '');
      var url = '/search/forecast/' + region + '/' + city;
      //TODO: Throttle this back
      var forecast = this.getForecast(region, city, null, null)

      $.when(forecast).done(function (data, status, xhr) {
        var view = this.getFullView(data);
        App.MainLayout.mainContentRegion.show(view);
      }.bind(this));
    },

    processCityModel: function (model) {
      var name = model.get('name');
      var location = name.split(', ');
      var city = location[0];
      var region = location[1];
      var urlFragment = name_formatter(region) + "/" + name_formatter(city);

      //TODO: regulate this cache so it does get out of hand
      App.state.locationsCache[urlFragment] = model
      return urlFragment;
    },

    showSelectedForecast: function (citykey) {
      var model = App.state.locationsCache[citykey];
      var name = citykey.split('/');
      var region = name[0]
      var city = name[1];
      var forecast = this.getForecast(region, city, model.get('lat'), model.get('lon'));

      $.when(forecast).done(function (data, status, xhr) {
        console.log("Show Forecast DATA", status, data);
        var view = this.getFullView(data);
        App.MainLayout.mainContentRegion.show(view);
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
  var Router = Marionette.AppRouter.extend({
    controller: API,
    appRoutes: {
      '' : 'reset',
      'forecast/:region/:city' : 'navTo'
    },
  });



  /* = Views ---------------------------------------------------------------- */
  var ForecastSlice = Marionette.ItemView.extend({
    // tagName: 'article',
    className: 'forecast forecast-slice bordered',

    initialize: function (options) {
      this.data = options.data;
    },

    templateHelpers: function () {
      var data = this.data.current_observation.display_location;
      return {
        locationURL: function () {
          var city = data.city;
          var region = (!!data.state)? data.state : data.country;

          return '#forecast/' + name_formatter(city) + "/" + name_formatter(region)
        }
      }
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
    className: 'forecast forecast-full bordered',

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




  var ForecastMainView = Marionette.LayoutView.extend({
    className: 'forecast-slices-wrapper',
    initialize: function (options) {
      this.data = options.data;
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
    },
  });


  var LoadingView = Marionette.ItemView.extend({
    className: 'weather-loading',

    template: function () {
      return _.template('<strong></strong><h4>Loading</h4>');
    }
  })




  /* = Start ---------------------------------------------------------------- */
  this.on('start', function () {
    this.router = new Router();
    API.init();
  });


});
