class AddUserIdToPublicacions < ActiveRecord::Migration
  def change
    add_column :publicacions, :user_id, :integer
  end
end
