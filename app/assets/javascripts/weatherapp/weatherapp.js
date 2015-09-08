window.WeatherApp = (function (_, Backbone, $){
  'use-strict';

  function _bootstrapDefaults () {
    return $.getJSON('/search/defaults');
  }

  var App = new Marionette.Application();

  App.on('before:start', function () {
    this.module('Entities').start();

    this.state = {
      locationsCache: {}
    };

    // set the main layout with regions
    this.MainLayout = new Marionette.LayoutView({
      el: "#weatherApp",
      regions: {
        searchBarRegion: '#search-bar-region',
        mainContentRegion: '#main-content-region'
      }
    });

    this.module('Searchbar').start();
    this.module('Forecast').start();
  });


  App.on('start', function () {
    Backbone.history.start();
    var frag = Backbone.history.getFragment();

    _bootstrapDefaults().done(function (data, status, xhr) {
      App.defaultData = data;
      if (frag) {
        this.vent.trigger('app:init:fragment', frag);
      } else {
        this.vent.trigger('app:init:defaults', data)
      }
    }.bind(this));

  });

  return App;

})(_ , Backbone, jQuery);
