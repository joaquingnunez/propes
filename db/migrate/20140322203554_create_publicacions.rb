class CreatePublicacions < ActiveRecord::Migration
  def change
    create_table :publicacions do |t|
      t.integer :pieza
      t.string :direccion
      t.integer :precio
      t.integer :bano
      t.boolean :estacionamiento
      t.string :tipo
      t.string :ciudad
      t.string :region
      t.boolean :comparte
      t.boolean :md
      t.text :titulo
      t.text :descripcion
      t.integer :user_id

      t.timestamps
    end
  end
end
