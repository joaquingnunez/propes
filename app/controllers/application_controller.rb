class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }

  before_filter :configure_permitted_parameters, if: :devise_controller?

  helper_method :ultimasPropiedades

  def ultimasPropiedades
  	result = Publicacion.find(:all, :order => "id desc", :limit => 5)
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:email, :password, :password_confirmation, :name, :lastname, :birthday) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:name,:lastname,:password,:password_confirmation,:current_password) }
  end
  
end
