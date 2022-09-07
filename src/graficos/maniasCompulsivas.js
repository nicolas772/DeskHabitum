let id_Usuario = 2;
let id_Sesion;

var unha_ultima_sesion = 0;
var pelo_ultima_sesion = 2
var morder_ultima_sesion = 3

var total_pelo = 20;
var total_morder = 15;
var total_unha = 0;

var pelos_10_sesiones = [45, 52, 38, 24, 33, 26, 21, 20, 6, 8];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [87, 57, 74, 99, 75, 38, 62, 47, 82, 56];

var tiempo_unha = 0
var tiempo_optimo = 0

async function update_dash_general() {

    await window.api.lastSesion(id_Usuario).then(result => {
        id_Sesion = result;
      });


    //Html: dashboard, dato: Cantidad detecciones ultima sesion
    await window.api.countUnhasSesion(id_Sesion).then(result => {
        unha_ultima_sesion = result;
    });

    //agregar pelo y morder

    document.getElementById("deteccionesUltimaSesion").innerHTML= unha_ultima_sesion + pelo_ultima_sesion + morder_ultima_sesion;


    //Html: dashboard, dato: Cantidad detecciones totales
    await window.api.allSesionUnhas(id_Usuario).then(result => {
        total_unha = result;
      });


    //agregar pelo y morder

    document.getElementById("deteccionesTotales").innerHTML = total_unha + total_pelo + total_morder;

    //html: dashboard, dato: Porcentage de distraccion total

    var dataDistraccionTotal = {
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

      var chartDistraccion = new ApexCharts(document.getElementById("chartDistraccionTotal"), dataDistraccionTotal);
      chartDistraccion.render();


      //html: dashboard, dato: Porcentaje distracción últimas 10 sesiones
      
      await window.api.percentageTenSesion(id_Usuario).then(result => {
        unhas_10_sesiones = result;
      });

      //ARREGLAR EN EL FUTURO
      for (var i = 0; i < 10; i++) {
        if (unhas_10_sesiones[i] > 100){
          unhas_10_sesiones[i] = 100;
        }
      }

      var data10Sesiones = {
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
      
    var chart10Sesiones = new ApexCharts(document.getElementById("chart10Sesiones"), data10Sesiones);
    chart10Sesiones.render();

    //----------------------------------------Pestaña ONICOFAGIA------------------------------------------------

    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-unhas").innerHTML = unha_ultima_sesion;

    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-unhas").innerHTML = total_unha;

    //Html: dashboard, pestana: Onicofagia, dato: porcentaje distracción total
    await window.api.totalTimeUnhas(id_Usuario).then(result => {
      tiempo_unha = result;
    });
    await window.api.totalTimeSesions(id_Usuario).then(result => {
      tiempo_optimo = result;
    });
    console.log("tiempo_unha: ", typeof(tiempo_unha))
    console.log("tiempo_optimo: ", typeof(tiempo_optimo))
    var dataDistraccionTotalUnhas = {
        series: [parseInt(tiempo_unha), parseInt(tiempo_optimo)],
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: ['Tiempo Onicofagia', 'Tiempo Óptimo'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
      
    var chartDistraccionTotalUnhas = new ApexCharts(document.getElementById("chartDistraccionTotalUnhas"), dataDistraccionTotalUnhas);
    chartDistraccionTotalUnhas.render();

    //Html: dashboard, pestana: Onicofagia, dato: porcentaje distracción íltimas 10 sesiones
    var data10SesionesUnhas = {
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
    
    var chart10SesionesUnhas = new ApexCharts(document.getElementById("chart10SesionesUnhas"), data10SesionesUnhas);
    chart10SesionesUnhas.render();

    //----------------------------------------Pestaña TRICOTILOMANIA------------------------------------------------


    //----------------------------------------Pestaña MANIA MORDER OBJETOS------------------------------------------------

}

//Navbar responsive
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

window.onload = update_dash_general;
