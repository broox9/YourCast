var WeatherApp = new Marionette.Application();


WeatherApp.on('before:start', function () {
  this.state = {
    locationsCache: {}
  };

  this.addRegions({
    searchBarRegion: '#search-bar-region',
    mainContentRegion: '#main-content-region'
  });
});


WeatherApp.on('start', function () {
  Backbone.history.start();
  // var frag = Backbone.history.getFragment();
  // this.vent.trigger('app:init:fragment', frag);

  _bootstrapDefaults().done(function (data, status, xhr) {
    this.module('Forecast').start(data)
  }.bind(this));

});


function _bootstrapDefaults () {
  return $.getJSON('/search/defaults');
}
