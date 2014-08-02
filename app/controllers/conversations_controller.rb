class ConversationsController < ApplicationController
  before_filter :authenticate_user!
  helper_method :mailbox, :conversation
  #before_action :check_user, only: [:create, :new]

  def create
    recipient_emails = conversation_params(:recipients).split(',')
    recipients = User.where(email: recipient_emails).all
    conversation = current_user.
      send_message(recipients, *conversation_params(:body, :subject)).conversation

    redirect_to conversation
  end

  def reply
    current_user.reply_to_conversation(conversation, *message_params(:body, :subject))
    redirect_to conversation
  end

  def trash
    conversation.move_to_trash(current_user)
    redirect_to :conversations
  end

  def untrash
    conversation.untrash(current_user)
    redirect_to :conversations
  end

  def new
  id = params[:id]
  @publicacion = Publicacion.find_by_id(id)
  user_id = @publicacion.user_id
  @user = User.find_by_id(user_id)
  end

  private

  def mailbox
    @mailbox ||= current_user.mailbox
  end

  def conversation
    @conversation ||= mailbox.conversations.find(params[:id])
  end

  #def check_user
   # id = params[:id]
    #publicacion = Publicacion.find_by_id(id)
    #if(publicacion == nil or current_user.id == Publicacion.find_by_id(id).user_id)
     # flash[:error] = "Accion no permitida"
      #redirect_to url_for(:controller => :publicacions, :action => :search)
    #end
  #end

  def conversation_params(*keys)
    fetch_params(:conversation, *keys)
  end

  def message_params(*keys)
    fetch_params(:message, *keys)
  end

  def fetch_params(key, *subkeys)
    params[key].instance_eval do
      case subkeys.size
      when 0 then self
      when 1 then self[subkeys.first]
      else subkeys.map{|k| self[k] }
      end
    end
  end
end