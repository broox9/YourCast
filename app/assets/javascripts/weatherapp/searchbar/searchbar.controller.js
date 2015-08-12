WeatherApp.module('Searchbar', function (Searchbar, App, Backbone, Marionette, $, _) {
  'use-strict';

  this.startWithParent = true;

  /* = Initialize ----------------------------------------------------------- */
  this.on('start', function () {
    Controller.init();
  });


  /* = Controller ----------------------------------------------------------- */
  var SearchList = new App.collections.Locations();

  var Controller = {
    init: function () {
      var DateModel = Backbone.Model.extend({
        initialize: function () {
          this.set('date', moment().format("ddd MMM Do YYYY") )
        }
      });

      var dateView = new DateView({model: new DateModel });
      var searchView = new SearchBoxView();
      var layout = new SearchBarLayout({collection: SearchList});
      layout.render();
      App.searchBarRegion.show(layout);

      layout.searchBarDate.show(dateView)
      layout.searchBarField.show(searchView);
    },

    broadcastSelectedCity: function (model) {
      console.log("selected Model", model)
      App.vent.trigger('city:selected', model)
    }
  };



  /* = Views ---------------------------------------------------------------- */
  // Layout for the entire bar (3 sections)
  var SearchBarLayout = Marionette.LayoutView.extend({
    className: 'search-bar-container',

    template: function () {
      return JST['weatherapp/searchbar/templates/searchbar_template']
    },

    regions: {
      searchBarDate: '#search-bar-date',
      searchBarField: '#search-bar-field',
      searchBarButton: '#search-bar-button'
    }
  });


  /* = Views: DateView ------------------------------------------------------- */
  var DateView = Marionette.ItemView.extend({
    className: 'search-bar-date',
    tagName: 'span',

    template: function (model) {
      return _.template('<%= date %>')(model)
    }
  });


  /* = Views: Search Result Item --------------------------------------------- */
  var SearchItem = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'city-search-item',

    initialize: function () {
      console.log('childView')
    },

    events: {
      'click' : 'handleItemSelect'
    },

    template: function (model) {
      return _.template('<span><%= name %></span>')(model);
    },

    handleItemSelect: function (e) {
      Controller.broadcastSelectedCity(this.model)
    }
  });


  /* = Views: Search Box Composite View ------------------------------------- */
  var SearchBoxView = Marionette.CompositeView.extend({
    className: 'search-box-container',
    tagName: 'form',
    childView: SearchItem,
    childViewContainer: '#city-search-results',
    collection: SearchList,

    events: {
      'keyup #city-search' : 'handleInput'
    },

    initialize: function (opts) {
      this.xhr;
    },

    templateHelpers: function() {
      return { items: this.collection.toJSON };
    },

    template: function (data) {
      return JST['weatherapp/searchbar/templates/searchbox_template'](data);
    },

    handleResults: function (data, status, xhr) {
      var cities = (!data.RESULTS.length) ? [] : data.RESULTS.filter(function (city) {return city.type = "city";})
      SearchList.reset(cities);
    },

    handleInput: function (e) {
      var str = e.target.value;
      if (this.xhr) { this.xhr.abort() }

      if (str.length < 1) {
        if (this.xhr) { this.xhr.abort() }
        SearchList.reset([])
        return;
      }

      var url = 'https://autocomplete.wunderground.com/aq';
      //TODO: Throttle this back
      this.xhr = $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'cb',
        data: {
          query: str,
          format: 'json'
        }
      });
      //run 'handleResults bound to the View Object, since it's aliased by the 'done'
      //method since it's call site isn't what it appears to be
      $.when(this.xhr).done(this.handleResults.bind(this))
    }
  });

});
