require 'rest-client'
class HomeController < ApplicationController

  def index
  end

  def defaults
    @defaults = get_defaults
    respond_to do |format|
      format.json {render :json => @defaults}
    end

  end
end
