let id_Usuario = 1;


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
  

  //////// Dashboard general
  
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