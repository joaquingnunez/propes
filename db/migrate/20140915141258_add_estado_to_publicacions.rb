class AddEstadoToPublicacions < ActiveRecord::Migration
  def change
    add_column :publicacions, :estado, :boolean, :default => true
  end
end
