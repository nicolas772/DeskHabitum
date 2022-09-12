
function init_cam(){
    window.api.iniciar_camara("")
      
}

async function stop_cam(){
    window.api.cerrar_camara("")
    //esta funcion es de ultimaSesion.js, no es necesario importar ya que se
    //importan los script en el html, y puedo usar las funciones de otros archivos
    //siempre y cuando esten en el orden correcto. ver https://es.stackoverflow.com/questions/353796/como-exportar-una-funcion-de-un-archivo-js-a-otro-archivo-js
    await update_dash_ultima_sesion(); 
}