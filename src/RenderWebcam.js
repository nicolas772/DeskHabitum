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

    update_home();
}


async function update_home(){

    let id_Usuario = 2;
    var id_Sesion, duracion, manias, duraciontotal, duracionunas, duracionpelo, duracionobjetos;
    var postura = "10 veces";
    var visual = "Sí"

    
    await window.api.lastSesion(id_Usuario).then(result => {
        id_Sesion = result;
    });
    
    await window.api.durationSesion(id_Sesion).then(result => {
        duraciontotal = result;
        var minutes = Math.floor(result / 60);
        var seconds = (result - minutes * 60).toFixed(0);
        if (minutes == 0)
            duracion = String(seconds) + " segundos";
        else
            duracion = String(minutes) + " minutos " + String(seconds) + " segundos";
    });

    await window.api.countUnhasSesion(id_Sesion).then(result => {
        manias = result;
    });

    await window.api.totalDurationUnhas(id_Sesion).then(result => {
        duracionunas = result;
    });

    duraciontotal = duraciontotal - duracionunas;
    duracionpelo = duraciontotal*0.02;
    duraciontotal = duraciontotal - duracionpelo;
    duracionobjetos = duraciontotal*0.02;
    duraciontotal = duraciontotal - duracionobjetos;

    var optionsdona = {
        series: [duracionunas,duracionpelo,duracionobjetos,duraciontotal],
        chart: {
          height:300,
          width:500,
        type: 'donut',
      },
      labels: ['Onicofagia', 'Tricotilomanía', 'Morder objetos', 'Tiempo óptimo'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height:200,
      
          },
          legend: {
            position: 'bottom',
            verticalAlign: 'bottom',
            align:'left'
          }
        }
      }]
      };

    document.getElementById("chartdona").innerHTML = ''
    var chartdona = new ApexCharts(document.querySelector("#chartdona"), optionsdona);
    chartdona.render();
    document.getElementById("Card-Sesion").innerHTML = duracion
    document.getElementById("Card-Manias").innerHTML = manias
    document.getElementById("Card-Postura").innerHTML = postura
    document.getElementById("Card-Visual").innerHTML = visual

}




window.onload = check_cam;
window.onload = update_home;