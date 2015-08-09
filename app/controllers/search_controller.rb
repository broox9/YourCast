class SearchController < ApplicationController

  def city_search
    Rails.logger.debug "~~~~~~~~~~~~~~~~~~~~~~~~ WU KEY: #{wu_key}"
  end


  private

    def wu_key
      Rails.env == 'production' ? ENV['WU_KEY'] : Rails.application.secrets.wu_key
    end

end
