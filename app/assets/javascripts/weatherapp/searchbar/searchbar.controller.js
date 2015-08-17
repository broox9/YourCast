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

      this.dateView = new DateView({model: new DateModel });
      this.titleView = new TitleView();
      this.searchView = new SearchBoxView();
      this.layout = new SearchBarLayout({collection: SearchList});
      this.layout.render();
      App.MainLayout.searchBarRegion.show(this.layout);

      this.layout.searchBarTitle.show(this.titleView);
      this.layout.searchBarDate.show(this.dateView)
      this.layout.searchBarField.show(this.searchView);
    },

    broadcastSelectedCity: function (model) {
      App.vent.trigger('city:selected', model)
    },

    reset: function () {
      SearchList.reset([]);
    }
  };

  // this.Router = new Marionette.AppRouter({
  //   //controller: Controller,
  //   routes: {
  //     '' : 'reset'
  //   },
  //
  //   reset: function () {
  //       SearchList.reset([]);
  //   }
  // });



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
      searchBarTitle: '#search-bar-title'
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


  /* = Views: TitleView ----------------------------------------------------- */
  var TitleView = Marionette.ItemView.extend({
    className: 'title',
    template: function (model) {
      return JST['weatherapp/searchbar/templates/title_template']
    }
  });



  /* = Views: Search Result Item --------------------------------------------- */
  var SearchItem = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'city-search-item',

    initialize: function () {
      // console.log('childView')
    },

    events: {
      'click' : 'handleItemSelect'
    },

    template: function (model) {
      var location = model.name.split(', ');
      var region = location[0].replace(/\s/g, '_');
      var city = location[1].replace(/\s/g, '_');

      model.url = "#/forecast/" + region + "/" + city
      return _.template('<a href="<%= url %>"><%= name %></span>')(model);
    },

    handleItemSelect: function (e) {
      Controller.broadcastSelectedCity(this.model);
      SearchList.reset([]);
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
      'keypress #city-search' : 'handleInput',
      'submit': 'handleSubmit'
    },

    initialize: function (opts) {
      this.xhr;
      //TODO: wire the childView to pass this event back to
      //this view instead of listening this way
      // App.vent.on("city:selected", function (model) {
      //   this.resetBoxText();
      //   SearchList.reset([]);
      // }.bind(this))
    },

    resetBoxText: function () {
      this.$el.find('#city-search').val('').blur();
      SearchList.reset([]);
    },

    templateHelpers: function() {
      return { items: this.collection.toJSON };
    },

    template: function (data) {
      return JST['weatherapp/searchbar/templates/searchbox_template'](data);
    },

    handleSubmit: function (e) {
      e.preventDefault();
      Controller.broadcastSelectedCity(this.collection.at(0));
      this.xhr.abort();
      this.resetBoxText();
      SearchList.reset([]);
    },

    handleResults: function (data, status, xhr) {
      var cities = (!data.RESULTS.length) ? [] : data.RESULTS.filter(function (city) {return city.type == "city" && city.tz != "MISSING";})
      var list = (cities.length > 10)? cities.slice(0, 10) : cities
      SearchList.reset(list);
    },

    handleInput: function (e) {
      console.log("handle input")
      var str = e.target.value;
      if (this.xhr) { this.xhr.abort() }

      if (str.length < 1) {
        if (this.xhr) { this.xhr.abort() }
        SearchList.reset([]);
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
