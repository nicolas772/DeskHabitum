//Para esta función https://stackoverflow.com/questions/4842590/how-to-run-a-function-when-the-page-is-loaded
//Se debe ejecutar en todas las ventanas, para que pueda ejecutarse en segundo plano

//Función que "enciende" la cámara si hay una sesión en curso.
function build_cam(sesion) {
    window.api.init_session(sesion).then(() => {
    console.log("Se prendió");
    try {
        document.getElementById("loading-webcam").innerHTML = 'Monitoreando webcam!';
     } 
    catch {
        console.log("Monitoreando webcam!")
    }
    });
  
}

//Función para comprobar si hay una sesión en curso y así abrir la camara en una nueva vista.
function check_cam(){
    sesion = window.api.check_session("");
    console.log(sesion);
    //No hay sesión en curso, por ende no se abre la cámara
    if (sesion == "No-Session")
        return
    //Hay sesión en curso
    else{
        sesion = window.api.check_session("");
        build_cam(sesion);
    }
  }

window.onload = check_cam;