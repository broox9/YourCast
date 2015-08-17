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
  });


  App.on('start', function () {
    Backbone.history.start();
    // var frag = Backbone.history.getFragment();
    // this.vent.trigger('app:init:fragment', frag);

    _bootstrapDefaults().done(function (data, status, xhr) {
      this.module('Forecast').start(data)
    }.bind(this));
  });

  return App;

})(_ , Backbone, jQuery);
