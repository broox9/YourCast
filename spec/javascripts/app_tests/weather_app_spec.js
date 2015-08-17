describe("WeatherApp", function () {

  var App = WeatherApp;

  it("is defined", function () {
    expect(App).toBeDefined()
  });

  it('defines the search, entities, and forecast modules', function () {
    expect(App.submodules.Entities).toBeDefined();
    expect(App.submodules.Searchbar).toBeDefined();
    expect(App.submodules.Forecast).toBeDefined();
  });
});
