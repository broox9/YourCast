class SearchController < ApplicationController

  def city_search region, city
    url_city = city.gsub(/\s/, '_')
    city_cache_key = url_city + '_' + region
    Rails.cache.fetch(city_cache_key, :expires_in => 15.minutes) do
      url = "http://api.wunderground.com/api/#{wu_key}/forecast/conditions/q/#{region}/#{url_city}.json"
      res = RestClient.get(url)
      Rails.logger.debug "~~~~~~~~~~~~~~~~~~~~~~~~ CITY SEARCH: #{url} --> #{city_cache_key} "
      res
    end
  end

  def default_search

    default_forecast = []
    get_defaults.each do |default|
      city = city_search default[:region], default[:city]
      default_forecast << JSON.parse(city)
    end

    render :json => default_forecast
  end

  private

    def wu_key
      Rails.env == 'production' ? ENV['WU_KEY'] : Rails.application.secrets.wu_key
    end

end
