class AddLongitudeToPublicacions < ActiveRecord::Migration
  def change
    add_column :publicacions, :longitude, :float
  end
end
