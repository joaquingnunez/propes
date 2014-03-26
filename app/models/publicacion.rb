class Publicacion < ActiveRecord::Base
	belongs_to :user
	validates :pieza, :bano, numericality: { only_integer: true, greater_than: 0 }
end
