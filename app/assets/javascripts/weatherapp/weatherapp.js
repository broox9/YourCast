var WeatherApp = new Marionette.Application();

WeatherApp.on('before:start', function () {
  this.addRegions({
    searchBarRegion: '#search-bar-region',
    mainContentRegion: '#main-content-region'
  });
});


WeatherApp.on('start', function () {
  _bootstrapDefaults().done(function (data, status, xhr) {
    this.module('Forecast').start(data)
  }.bind(this));
});


function _bootstrapDefaults () {
  return $.getJSON('/search/defaults');
}
