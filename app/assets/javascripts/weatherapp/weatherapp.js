window.WeatherApp = (function (_, Backbone, $){
  'use-strict';

  function _bootstrapDefaults () {
    return $.getJSON('/search/defaults');
  }

  var App = new Marionette.Application();

  App.on('before:start', function () {
    Backbone.history.start();
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


    // this.MainLayout.mainContentRegion.on('before:swap', function () {
    //   setTimeout(function () {this.$el.removeClass('active') }.bind(this), 1000)
    // })
    //
    // this.MainLayout.mainContentRegion.on('swap', function () {
    //   console.log("show")
    //   setTimeout(function () {this.$el.addClass('active') }.bind(this), 1000)
    // })

    this.module('Searchbar').start();
    this.module('Forecast').start();


  });


  App.on('start', function () {
    // this.module('Searchbar').start();
    // this.module('Forecast').start();
    var frag = Backbone.history.getFragment();

    // if (frag) {
    //   console.log("FRAG", frag);
    //   this.vent.trigger('app:init:fragment', frag);
    // } else {
      _bootstrapDefaults().done(function (data, status, xhr) {
        this.vent.trigger('app:init:defaults', data)
      }.bind(this));
    // }
  });

  return App;

})(_ , Backbone, jQuery);
