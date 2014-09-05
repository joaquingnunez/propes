class Publicacion < ActiveRecord::Base
	belongs_to :user
	validates :pieza, :bano, :precio,numericality: { only_integer: true, greater_than: 0 }, presence: true
	validates :titulo, :descripcion, :region, :ciudad, :direccion, presence: true
	has_many :attachments, :as => :attachable
	accepts_nested_attributes_for :attachments,:allow_destroy => true

	def twitter
		config = {
          :consumer_key        => "0k9QQODmhmVcPUusziFakkBpI",
          :consumer_secret     => "p1W1tSgwwBt0K1aMpSgsz863hw0xZJCihoxDWFhpYF4cqnie13",
          :access_token        => "2490114194-yVvLnTxJBkSfdXNVnQ6YjDHgCekJ6ikSnU3LdQx",
          :access_token_secret => "ISijaSf6OBOssSNL3j0AZivePLyGkFKCDj2fDl0L1z3j0",
        }
        client = Twitter::REST::Client.new(config)
    end

    def smallImage
    	imagen = self.attachments.last.file_url(:small)
    end

    def largeImage
      imagen = self.attachments.last.file_url(:large)
    end

    def ultimasPropiedades
    result = Publicacion.find(:all, :order => "id desc", :limit => 5)
    return result
    end

end
