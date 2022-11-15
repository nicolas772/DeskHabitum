//ID_USER = 2
id_Usuario = window.api.get_user_id("")
let id_Sesion, duracion, manias, duraciontotal, duracionunas, duracionpelo, duracionobjetos, duracionpiel, duracionnariz, id_lastSesion;
let postura = "";
let visual = "Sí"
let pestaneoCount
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
        console.log(manias)
    });

    await window.api.countPeloSesion(id_lastSesion).then(result => {
      manias += result;
    });

    await window.api.countMorderSesion(id_lastSesion).then(result => {
      manias += result;
    });

    await window.api.ultimaNariz(id_Usuario).then(result => {
      manias += parseInt(result);
    });

    await window.api.ultimaPiel(id_Usuario).then(result => {
      manias += parseInt(result);
    });



    document.getElementById("Card-Manias").innerHTML = manias

    //HTML: index , indicador: # detecciones mala postura
    //hardcodeado
    await window.api.ultimaPostura(id_Usuario).then(result => {
      postura = result.toString() + " Veces";
    });

    document.getElementById("Card-Postura").innerHTML = postura

    //HTML: index , indicador: detección fatiga visual
    await window.api.countPestaneoSesion(id_lastSesion).then(result => {
      pestaneoCount = result
    });
    await window.api.countVistaSesion(id_lastSesion).then(result => {
      if(result == 0 && pestaneoCount == 0){
        visual = "No"
      }else{
        visual = "Si"
      }
    });
    
    document.getElementById("Card-Visual").innerHTML = visual

    //HTML: index , indicador: porcentajes hábitos ultima sesion

    await window.api.totalSesionTimeUnhas(id_lastSesion).then(result => {
      result = parseInt(result)
        if (Number.isNaN(result)) {
          duracionunas = 0
        } else {
          duracionunas = result;
        }
    });
    
    await window.api.totalSesionTimePelo(id_lastSesion).then(result => {
      result = parseInt(result)
      if (Number.isNaN(result)) {
        duracionpelo = 0
      } else {
        duracionpelo = result;
      }      
    });

    await window.api.totalSesionTimeMorder(id_lastSesion).then(result => {
      result = parseInt(result)
      if (Number.isNaN(result)) {
        duracionobjetos = 0
      } else {
        duracionobjetos = result;
      }
    });

    if (duracionunas > duraciontotal){ //ARREGLAR EN EL FUTURO (error del reconocimiento automatico)
        duracionunas = duraciontotal
    }
    //hardcodeado

    await window.api.ultimaTimePiel(id_Usuario).then(result => {
      duracionpiel = parseInt(result)
    });
    await window.api.ultimaTimeNariz(id_Usuario).then(result => {
      duracionnariz = parseInt(result)
    });
    //duracionpelo = 2;
    //duracionobjetos = 2;
    duraciontotal = duraciontotal - duracionobjetos - duracionpelo - duracionunas - duracionnariz - duracionpiel

    var dataHabitosUltimaSesion = {
        series: [duracionunas,duracionpelo,duracionobjetos, duracionnariz, duracionpiel, duraciontotal],
        chart: {
          height:300,
          width:500,
        type: 'donut',
      },
      labels: ['Tiempo Onicofagia', 'Tiempo Tricotilomanía', 'Tiempo Morder objetos', 'Tiempo Rinotilexomanía', 'Tiempo Dermatilomanía', 'Tiempo Óptimo'],
      colors: ["#F9A3A4", "#00E396", "#FEB019", "#FF4560", "#775DD0","#008FFB"],
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
  if(userData.liderequipo == "si"){
    document.getElementById("tipo-usuario").append('Lider de equipo')
  }else{
    document.getElementById("tipo-usuario").append('Usuario activo')
  }
}

function init(){
  actualizarNavbar();
  update_dash_ultima_sesion();
  navbarInit()
}

window.onload = init;