json.array!(@publicacions) do |publicacion|
  json.extract! publicacion, :id, :pieza, :direccion, :precio, :bano, :estacionamiento, :tipo, :ciudad, :region, :comparte, :md, :titulo, :descripcion, :user_id
  json.url publicacion_url(publicacion, format: :json)
end
