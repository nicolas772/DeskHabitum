////////Funciones especificas de la vista principal:

//Función para iniciar una nueva sesión apretando el botón "empezar"
function init_cam(){

  sesion = window.api.check_session("")
  //Si no hay una sesión en curso entonces se ejecuta el inicio de la camara
  if (sesion == "No-Session"){
      //GIF de carga
      var img = document.createElement("img");
      img.src = 'https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif';
      img.style.height = '60px';
      img.style.width = '60px';
      document.getElementById("loading-webcam").appendChild(img);
      //Se genera un date de sesión
      sesion = window.api.check_session("Init");
      build_cam(sesion);
  }  
}


//Función para parar la sesión apretando el botón "parar"
function stop_cam(){
  
  sesion = window.api.check_session("");
  if (sesion != "No-Session"){
      //Se para la sesión comunicando con index.js
      sesion = window.api.check_session("Stop")
      window.api.stop_session();
      document.getElementById("loading-webcam").innerHTML = '';
  }

  update_dash_ultima_sesion(); //importar desde ultimaSesion.js 
}




