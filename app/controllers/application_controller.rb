class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :get_defaults
  # before_filter :get_defaults

  def get_defaults
    [{city: "Newark", region: "NJ"}, {city: "Los Angeles", region: "California"}, {city: "London", region: "UK"}]
  end

end
