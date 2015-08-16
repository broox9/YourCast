class SessionsController < ApplicationController

  def create
    hash = auth_hash
    Rails.logger.info "~~~~~~~~~~~~~~~~~~~~~~~~ #{auth_hash}"
  end

  private

    def auth_hash
      request.env['omniauth.hash']
    end

end
