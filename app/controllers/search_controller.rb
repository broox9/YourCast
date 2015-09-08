class SearchController < ApplicationController

  def city_search region, city, lat = nil, lon = nil
    city_cache_key = city + '_' + region

    Rails.cache.fetch(city_cache_key, :expires_in => 15.minutes) do
      if lat
        url = "http://api.wunderground.com/api/#{wu_key}/forecast/conditions/almanac/q/#{lat},#{lon}.json"
      else
        url = "http://api.wunderground.com/api/#{wu_key}/forecast10day/conditions/almanac/q/#{region}/#{city}.json"
      end

      res = RestClient.get(url)
    end
  end


  def forecast
    # TODO: strong params
    city_forecast = city_search format_name(params[:region]), format_name(params[:city]), params[:lat], params[:lon]
    render :json => city_forecast
  end



  def default_search
    default_forecast = []
    get_defaults.each do |default|
      city = city_search format_name(default[:region]), format_name(default[:city])
      default_forecast << JSON.parse(city)
    end

    render :json => default_forecast
  end

  def format_name name
    name.gsub(/\s/, '_');
  end

  private

    def wu_key
      Rails.env == 'production' ? ENV['WU_KEY'] : Rails.application.secrets.wu_key
    end

end
