let ID_USER = window.api.get_user_id("")
let inicio_sesion
let fin_sesion
let total

function init_cam(){
    window.api.iniciar_camara("")
    inicio_sesion = new Date()
}

async function stop_cam(){
    window.api.cerrar_camara("")
    //creo sesion en BD
    fin_sesion = new Date()
    total =  Math.trunc((fin_sesion - inicio_sesion)/1000) //lo pasa de milisegundos a segundos
    let ini_sesion = inicio_sesion.toISOString()
    let fini_sesion = fin_sesion.toISOString()
    window.api.createSesion(ID_USER, ini_sesion, fini_sesion, total); 
     //esta funcion es de ultimaSesion.js, no es necesario importar ya que se
    //importan los script en el html, y puedo usar las funciones de otros archivos
    //siempre y cuando esten en el orden correcto. ver https://es.stackoverflow.com/questions/353796/como-exportar-una-funcion-de-un-archivo-js-a-otro-archivo-js
    await update_dash_ultima_sesion(); 
}
