//Para esta función https://stackoverflow.com/questions/4842590/how-to-run-a-function-when-the-page-is-loaded

//Función para comprobar si hay una sesión en curso y así abrir la camara en una nueva vista.
function check_cam(){
    sesion = window.api.check_session("");
    //console.log(sesion);
    //No hay sesión en curso, por ende no se abre la cámara
    if (sesion == "No-Session")
        return
    //Hay sesión en curso
    else{
        sesion = window.api.check_session("");
        build_cam(sesion);
    }
}

//Función que "enciende" la cámara si hay una sesión en curso.
function build_cam(sesion) {
    window.api.init_session(sesion).then(() => {
    try {
        document.getElementById("loading-webcam").innerHTML = 'Monitoreando webcam!';
     } 
    catch {
        console.log("Monitoreando webcam!")
    }
    });

}


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
}


window.onload = check_cam;