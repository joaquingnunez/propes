class WelcomeController < ApplicationController
	def index
		@publicacion =  Publicacion.all.order(created_at: :desc)
		@ultimas = Publicacion.find(:all, :order => "id desc", :limit => 5)
		if user_signed_in?
			@user = current_user
		end
	end
end
