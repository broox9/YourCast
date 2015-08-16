Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  # provider :heroku, ENV['HEROKU_OAUTH_ID'], ENV['HEROKU_OAUTH_SECRET']
  # provider :twitter, ENV['TWITTER_KEY'], ENV['TWITTER_SECRET'] # TODO: set up twitter
end

#logging
OmniAuth.config.logger = Rails.logger
