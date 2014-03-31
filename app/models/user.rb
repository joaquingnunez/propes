class User < ActiveRecord::Base
  has_many :publicacions, dependent: :destroy
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable
   acts_as_messageable

def mailboxer_email(object)
  #Check if an email should be sent for that object
  #if true
  return email
  #if false
  #return nil
end

end
