# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$('#publicacions').html('<%= escape_javascript render(@publicacion) %>');
$('#paginator').html('<%= escape_javascript(paginate(@publicacion, :remote => true).to_s) %>');

# initialise the google maps objects, and add listeners
