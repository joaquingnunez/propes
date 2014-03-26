class AddUserIdToPropiedads < ActiveRecord::Migration
  def change
    add_column :propiedads, :user_id, :integer
  end
end
