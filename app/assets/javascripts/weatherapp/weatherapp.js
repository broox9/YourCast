var WeatherApp = new Marionette.Application();

WeatherApp.on('before:start', function () {
  this.addRegions({
    searchBarRegion: '#search-bar-region',
    mainContentRegion: '#main-content-region'
  });
});


// console.log("WeatherApp init", WeatherApp)
