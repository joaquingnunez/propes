class AddLatitudeToPublicacions < ActiveRecord::Migration
  def change
    add_column :publicacions, :latitude, :float
  end
end
