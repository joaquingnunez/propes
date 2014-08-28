class AddDetailsToPublicacions < ActiveRecord::Migration
  def change
    add_column :publicacions, :aire, :boolean
    add_column :publicacions, :balcon, :boolean
    add_column :publicacions, :calefaccion, :boolean
    add_column :publicacions, :piscina, :boolean
    add_column :publicacions, :multiuso, :boolean
    add_column :publicacions, :spa, :boolean
    add_column :publicacions, :computacion, :boolean
    add_column :publicacions, :conserje, :boolean
    add_column :publicacions, :lavado, :boolean
    add_column :publicacions, :cine, :boolean
    add_column :publicacions, :visita, :boolean
    add_column :publicacions, :quincho, :boolean
    add_column :publicacions, :juegos, :boolean
    add_column :publicacions, :cocina, :boolean
    add_column :publicacions, :infantiles, :boolean
    add_column :publicacions, :superficie, :integer
    add_column :publicacions, :contrato, :string
  end
end
