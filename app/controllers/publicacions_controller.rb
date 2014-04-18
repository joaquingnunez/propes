class PublicacionsController < ApplicationController
  before_action :set_publicacion, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:show, :search]
  before_action :check_publicacion, only: [:edit, :update, :destroy] 

  # GET /publicacions
  # GET /publicacions.json
  def index
    @user = current_user
    @publicacion =  @user.publicacions.all
  end

  # GET /publicacions/1
  # GET /publicacions/1.json
  def show
    
  end

  # GET /publicacions/new
  def new
    @publicacion = Publicacion.new
  end

  # GET /publicacions/1/edit
  def edit
  end

  # POST /publicacions
  # POST /publicacions.json
  def create
    @user = current_user
    @publicacion = @user.publicacions.new(publicacion_params)

    respond_to do |format|
      if @publicacion.save
        format.html { redirect_to @publicacion }
        format.json { render action: 'show', status: :created, location: @publicacion }
      else
        format.html { render action: 'new' }
        format.json { render json: @publicacion.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /publicacions/1
  # PATCH/PUT /publicacions/1.json
  def update
    respond_to do |format|
      if @publicacion.update(publicacion_params)
        format.html { redirect_to @publicacion, notice: 'Publicacion was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @publicacion.errors, status: :unprocessable_entity }
      end
    end
  end


  def search
    if user_signed_in?
      @user = current_user
    end
    @search = Publicacion.search(params[:q])
    @publicacion=@search.result.page(params[:page]).per(5)
  end
  # DELETE /publicacions/1
  # DELETE /publicacions/1.json
  def destroy
    @publicacion.destroy
    respond_to do |format|
      format.html { redirect_to publicacions_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_publicacion
      @publicacion = Publicacion.find_by_id(params[:id])
    end

    def check_publicacion
      @user=current_user
      id=params[:id]
      if (@user.publicacions.find_by_id(id) == nil)
         flash[:error] = "Accion no permitida"
         redirect_to url_for(:controller => :welcome, :action => :index)
       end
     end

    # Never trust parameters from the scary internet, only allow the white list through.
    def publicacion_params
      params.require(:publicacion).permit(:pieza, :direccion, :precio, :bano, :estacionamiento, :tipo, :ciudad, :region, :comparte, :md, :latitude, :longitude,:titulo, :descripcion,attachments_attributes: [:id, :file, :file_cache, :_destroy])
    end
end
