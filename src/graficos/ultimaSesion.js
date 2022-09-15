ID_USER = 2
id_Usuario = window.api.get_user_id("")
var id_Sesion, duracion, manias, duraciontotal, duracionunas, duracionpelo, duracionobjetos, id_lastSesion;
var postura = "10 veces";
var visual = "Sí"

async function update_dash_ultima_sesion() {
    //HTML: index , indicador: duracion ultima sesion
    await window.api.lastSesion(id_Usuario).then(result => {
        id_lastSesion = result;
    });
    await window.api.durationSesion(id_lastSesion).then(result => {
        duraciontotal = parseInt(result);
        var minutes = Math.floor(result / 60);
        var seconds = (result - minutes * 60).toFixed(0);
        if (minutes == 0)
            duracion = String(seconds) + " segundos";
        else
            duracion = String(minutes) + " minutos " + String(seconds) + " segundos";
  
    });
    document.getElementById("Card-Sesion").innerHTML = duracion

    //HTML: index , indicador: # detecciones manias
    //a futuro, se debe sumar a la var manias las otras manias (pelo y morder objetos)
    await window.api.countUnhasSesion(id_lastSesion).then(result => {
        manias = result;
    });

    await window.api.countPeloSesion(id_lastSesion).then(result => {
      manias += result;
    });

    await window.api.countMorderSesion(id_lastSesion).then(result => {
      manias += result;
    });
    document.getElementById("Card-Manias").innerHTML = manias

    //HTML: index , indicador: # detecciones mala postura
    //hardcodeado
    document.getElementById("Card-Postura").innerHTML = postura

    //HTML: index , indicador: detección fatiga visual
    //hardcodeado
    document.getElementById("Card-Visual").innerHTML = visual

    //HTML: index , indicador: porcentajes hábitos ultima sesion

    await window.api.totalSesionTimeUnhas(id_lastSesion).then(result => {
        duracionunas = parseInt(result);
    });
    
    await window.api.totalSesionTimePelo(id_lastSesion).then(result => {
      duracionpelo = parseInt(result);
    });

    await window.api.totalSesionTimeMorder(id_lastSesion).then(result => {
      duracionobjetos = parseInt(result);
    });

    if (duracionunas > duraciontotal){ //ARREGLAR EN EL FUTURO (error del reconocimiento automatico)
        duracionunas = duraciontotal
    }
    //hardcodeado

    
    //duracionpelo = 2;
    //duracionobjetos = 2;
    duraciontotal = duraciontotal - duracionobjetos - duracionpelo - duracionunas

    var dataHabitosUltimaSesion = {
        series: [duracionunas,duracionpelo,duracionobjetos,duraciontotal],
        chart: {
          height:300,
          width:500,
        type: 'donut',
      },
      labels: ['Tiempo Onicofagia', 'Tiempo Tricotilomanía', 'Tiempo Morder objetos', 'Tiempo Óptimo'],
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

    document.getElementById("charHabitosUltimaSesion").innerHTML = ''
    var charHabitosUltimaSesion = new ApexCharts(document.getElementById("charHabitosUltimaSesion"), dataHabitosUltimaSesion);
    charHabitosUltimaSesion.render();

}

//codigo para que se muestre el nombre del usuario activo
async function navbarInit(){
  await window.api.getUserData(id_Usuario).then(result => {
      userData = result[0];
  });
  document.getElementById("usuario-activo").append(userData.nombre)
}

function init(){
  update_dash_ultima_sesion();
  navbarInit()
}

window.onload = init;