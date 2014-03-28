class WelcomeController < ApplicationController
	def index
	if user_signed_in?
    @user = current_user
    @publicacion =  Publicacion.all
end
end
end
