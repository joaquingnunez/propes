class WelcomeController < ApplicationController
	def index
		if user_signed_in?
			@user = current_user
			@publicacion =  current_user.publicacions.all
		end
	end
end
