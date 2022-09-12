let id_Usuario = 2;


var total_pelo = 20;
var total_morder = 15;
var total_unha = 0;


var id_Sesion
var pelo_ultima_sesion = 2
var morder_ultima_sesion = 3
var unha_ultima_sesion = 0 ;


var pelos_10_sesiones = [45, 52, 38, 24, 33, 26, 21, 20, 6, 8];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [87, 57, 74, 99, 75, 38, 62, 47, 82, 56];

var tiempo_optimo = 0
var tiempo_unha = 0

async function Update_Dashboard(){

  await window.api.lastSesion(id_Usuario).then(result => {
    id_Sesion = result;
  });

  await window.api.countAllUnhas(id_Usuario).then(result => {
    total_unha = result;
  });

  await window.api.countUnhasSesion(id_Sesion).then(result => {
    unha_ultima_sesion = result;
  });

  await window.api.percentageTenSesion(id_Usuario).then(result => {
    unhas_10_sesiones = result;
  });

  await window.api.percentageTenSesion(id_Usuario).then(result => {
    unhas_10_sesiones = result;
  });

  await window.api.timeSesionAll(id_Usuario).then(result => {
    tiempo_optimo = result;
  });

  await window.api.totalDurationUnhas(id_Usuario).then(result => {
    tiempo_unha = result;
  });
  

  //////// Dashboard principal
  
  //Cantidad de detecciones en la ultima sesión
  document.getElementById("h1totunhas").innerHTML = total_unha + total_pelo + total_morder;
  //Cantidad de detecciones totales
  document.getElementById("h1unhassesion").innerHTML= unha_ultima_sesion + pelo_ultima_sesion + morder_ultima_sesion;

  //ARREGLAR EN EL FUTURO
  for (var i = 0; i < 10; i++) {
    if (unhas_10_sesiones[i] > 100){
      unhas_10_sesiones[i] = 100;
    }
 }
  

  var options5 = {
    series: [total_unha, total_pelo, total_morder],
    chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Onicofagia', 'Tricotilomanía', 'Manía Mordiendo Objetos'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };
  
  var chart5 = new ApexCharts(document.querySelector("#chart5"), options5);
  chart5.render();


  var options11 = {
    series: [{
        name: "Onicofagia",
        data: unhas_10_sesiones
      
    },
      {
        name: "Tricotilomanía",
        data: pelos_10_sesiones
      },
      {
        name: 'Manía Mordiendo Objetos',
        data: objetos_10_sesiones
      }
    ],
    chart: {
      height: 240,
      type: 'line',
      zoom: {
        enabled: false
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5]
    },
    title: {
      text: '% manía respecto al tiempo total de sesión',
      align: 'left'
    },
    legend: {
      tooltipHoverFormatter: function(val, opts) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
      }
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories: ['Sesión 1','Sesión 2', 'Sesión 3', 'Sesión 4', 'Sesión 5', 'Sesión 6', 'Sesión 7', 'Sesión 8', 'Sesión 9', 'Sesión 10'],
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + "%"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + "%"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + "%";
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };
  
  var chart11 = new ApexCharts(document.querySelector("#chart11"), options11);
  chart11.render();



  //////// Dashboard unhas
  var options61 = {
    series: [tiempo_unha, tiempo_optimo],
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Tiempo Onicofagia', 'Tiempo Óptimo'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  var chart61 = new ApexCharts(document.querySelector("#chart61"), options61);
  chart61.render();
  
  var options62 = {
    series: [{
      name: "% mordiendo uñas",
      data: unhas_10_sesiones
    }],
    chart: {
      height: 240,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: '% onicofagia últimas 10 sesiones.',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Sesión 1','Sesión 2', 'Sesión 3', 'Sesión 4', 'Sesión 5', 'Sesión 6', 'Sesión 7', 'Sesión 8', 'Sesión 9', 'Sesión 10'],
    }
  };
  
  var chart62 = new ApexCharts(document.querySelector("#chart62"), options62);
  chart62.render();



  document.getElementById("ultima-sesion-unhas").innerHTML = unha_ultima_sesion;
  
  document.getElementById("total-detecciones-unhas").innerHTML = total_unha;
  

}


window.onload = Update_Dashboard;


const shrink_btn = document.querySelector(".shrink-btn");
const userId = 2;
shrink_btn.addEventListener("click",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});


const aside = document.querySelector(".aside1");
aside.addEventListener("mouseenter",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});

aside.addEventListener("mouseleave",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});
















///////////////////////////////// FUNCIONES RenderWebcam /////////////////////////////////

//Para esta función https://stackoverflow.com/questions/4842590/how-to-run-a-function-when-the-page-is-loaded

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

  //ARREGLAR EN EL FUTURO
  if (duracionunas > duraciontotal){
    duracionunas = duraciontotal
  }

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

  document.getElementById("chartdona").innerHTML = ''
  var chartdona = new ApexCharts(document.querySelector("#chartdona"), optionsdona);
  chartdona.render();
  document.getElementById("Card-Sesion").innerHTML = duracion
  document.getElementById("Card-Manias").innerHTML = manias
  document.getElementById("Card-Postura").innerHTML = postura
  document.getElementById("Card-Visual").innerHTML = visual

}



function carga_home(){
  check_cam();
  update_home();
  Update_Dashboard();

}

window.onload = carga_home;




/*mas graficos */
const checktricorec = document.getElementById('checktricorec');
const tricorec = document.getElementById('tricorec');



const tricomes = document.getElementById('tricomes');
const tricoanio = document.getElementById('tricoanio');

const checktricomes = document.getElementById('checktricomes');
const checktricoanio = document.getElementById('checktricoanio');

checktricorec.addEventListener('click', function handleClick() {
  if (checktricorec.checked) {
    tricorec.style.display = 'block';
    tricomes.style.display = 'none';
    tricoanio.style.display = 'none';
    tricorec.style.visibility = 'visible';
    tricomes.style.visibility = 'hidden';
    tricoanio.style.visibility = 'hidden';
    
  } else {
    tricorec.style.display = 'none';
    tricorec.style.visibility = 'hidden';
  }
});

checktricomes.addEventListener('click', function handleClick() {
  if (checktricomes.checked) {
    tricorec.style.display = 'none';
    tricomes.style.display = 'block';
    tricoanio.style.display = 'none';
    tricorec.style.visibility = 'hidden';
    tricomes.style.visibility = 'visible';
    tricoanio.style.visibility = 'hidden';
  } else {
    tricomes.style.display = 'none';
    tricomes.style.visibility = 'hidden';
  }
});

checktricoanio.addEventListener('click', function handleClick() {
  if (checktricoanio.checked) {
    tricorec.style.display = 'none';
    tricomes.style.display = 'none';
    tricoanio.style.display = 'block';
    tricorec.style.visibility = 'hidden';
    tricomes.style.visibility = 'hidden';
    tricoanio.style.visibility = 'visible';
    
  } else {
    tricoanio.style.display = 'none';
    tricoanio.style.visibility = 'hidden';
  }
});
/* ----------grafico objetos */

const checkobjrec = document.getElementById('checkobjrec');
const objrec = document.getElementById('objrec');



const objomes = document.getElementById('objmes');
const objanio = document.getElementById('objanio');

const checkobjmes = document.getElementById('checkobjmes');
const checkobjanio = document.getElementById('checkobjanio');

checkobjrec.addEventListener('click', function handleClick() {
  if (checkobjrec.checked) {
    objrec.style.display = 'block';
    objmes.style.display = 'none';
    objanio.style.display = 'none';
    objrec.style.visibility = 'visible';
    objmes.style.visibility = 'hidden';
    objanio.style.visibility = 'hidden';
    
  } else {
    objrec.style.display = 'none';
    objrec.style.visibility = 'hidden';
  }
});

checkobjmes.addEventListener('click', function handleClick() {
  if (checkobjmes.checked) {
    objrec.style.display = 'none';
    objmes.style.display = 'block';
    objanio.style.display = 'none';
    objrec.style.visibility = 'hidden';
    objmes.style.visibility = 'visible';
    objanio.style.visibility = 'hidden';
  } else {
    objmes.style.display = 'none';
    objmes.style.visibility = 'hidden';
  }
});

checkobjanio.addEventListener('click', function handleClick() {
  if (checkobjanio.checked) {
    objrec.style.display = 'none';
    objmes.style.display = 'none';
    objanio.style.display = 'block';
    objrec.style.visibility = 'hidden';
    objmes.style.visibility = 'hidden';
    objanio.style.visibility = 'visible';
    
  } else {
    objanio.style.display = 'none';
    objanio.style.visibility = 'hidden';
  }
});