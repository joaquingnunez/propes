require 'test_helper'

class PropiedadsControllerTest < ActionController::TestCase
  setup do
    @propiedad = propiedads(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:propiedads)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create propiedad" do
    assert_difference('Propiedad.count') do
      post :create, propiedad: { bano: @propiedad.bano, ciudad: @propiedad.ciudad, comparte: @propiedad.comparte, direccion: @propiedad.direccion, estacionamiento: @propiedad.estacionamiento, pieza: @propiedad.pieza, precio: @propiedad.precio, region: @propiedad.region, tipo: @propiedad.tipo }
    end

    assert_redirected_to propiedad_path(assigns(:propiedad))
  end

  test "should show propiedad" do
    get :show, id: @propiedad
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @propiedad
    assert_response :success
  end

  test "should update propiedad" do
    patch :update, id: @propiedad, propiedad: { bano: @propiedad.bano, ciudad: @propiedad.ciudad, comparte: @propiedad.comparte, direccion: @propiedad.direccion, estacionamiento: @propiedad.estacionamiento, pieza: @propiedad.pieza, precio: @propiedad.precio, region: @propiedad.region, tipo: @propiedad.tipo }
    assert_redirected_to propiedad_path(assigns(:propiedad))
  end

  test "should destroy propiedad" do
    assert_difference('Propiedad.count', -1) do
      delete :destroy, id: @propiedad
    end

    assert_redirected_to propiedads_path
  end
end
