class WelcomeController < ApplicationController
	def index
		@publicacion =  Publicacion.all.order(created_at: :desc)
		if user_signed_in?
			@user = current_user
		end
	end
end
