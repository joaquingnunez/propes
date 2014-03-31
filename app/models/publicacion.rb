class Publicacion < ActiveRecord::Base
	belongs_to :user
	validates :pieza, :bano, numericality: { only_integer: true, greater_than: 0 }
	has_many :attachments, :as => :attachable
	accepts_nested_attributes_for :attachments,:allow_destroy => true
end
