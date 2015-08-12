WeatherApp.module('Forecast', function (Forecast, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  function name_formatter (name) {
    var formatted_name = name.replace(/\s/g, "_");
    return formatted_name;
  }

  App.vent.on('city:selected', function (model) {
    var cityKey = API.processCityModel(model);
    Forecast.router.navigate("forecast/" + cityKey);
    API.showForecast(cityKey);
  });


  /* = Controller ----------------------------------------------------------- */
  //var defaultForecast= {};

  var API = {
    init: function (data) {
      this.defaultData = data;

      var mainview = new ForecastMainView({data: data})
      var view = new ForecastSlice();
      App.mainContentRegion.show(mainview);
    },

    reset: function () {
      this.init(this.defaultData);
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

    showForecast: function (citykey) {
      var model = App.state.locationsCache[citykey];
      var name = citykey.split('/');
      var region = name[0]
      var city = name[1];
      var forecast = this.getForecast(region, city, model.get('lat'), model.get('lon'));

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
  this.Router = new Marionette.AppRouter({
    controller: API,
    appRoutes: {
      '/' : 'reset',
      '' : 'reset'
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
    className: 'forecast forecast-full',

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
  });




  /* = Start ---------------------------------------------------------------- */
  this.on('start', function (data) {
    API.init(data);
    this.router = new Backbone.Router()
    //console.log("ROUTER", Router)

  });


});
