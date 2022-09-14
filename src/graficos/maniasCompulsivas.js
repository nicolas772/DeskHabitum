let id_Usuario = 2;
let ID_USER = window.api.get_user_id("")
let id_Sesion;

var unha_ultima_sesion = 0;
var pelo_ultima_sesion = 2
var morder_ultima_sesion = 3

var total_pelo = 20;
var total_morder = 15;
var total_unha = 0;

var pelos_10_sesiones = [];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [];

var tiempo_unha = 0
var tiempo_optimo = 0

let ultima_ses_trico, total_trico;
let peor_ses_trico, mejor_ses_trico;
let ultima_ses_morder, total_morder_objeto;
let peor_ses_obj, mejor_ses_obj;

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
      
      await window.api.percentageTenSesionUnhas(id_Usuario).then(result => {
        unhas_10_sesiones = result;
      });

      await window.api.percentageTenSesionPelo(id_Usuario).then(result => {
        pelos_10_sesiones = result;
      });

      await window.api.percentageTenSesionMorder(id_Usuario).then(result => {
        objetos_10_sesiones = result;
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
    



    await window.api.countPeloSesion(id_Sesion).then(result => {
      ultima_ses_trico = result
      })

    await window.api.allSesionsPelo(id_Usuario).then(result => {
      total_trico = result
      })
    
       
    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-trico").innerHTML =  ultima_ses_trico;   
;

    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-trico").innerHTML = total_trico;

    var tiempo_trico;
    await window.api.totalTimePelo(id_Usuario).then(result => {
      console.log(result)
      tiempo_trico = result
    })

    var options_trico1 = {
      series: [parseInt(tiempo_trico), parseInt(tiempo_optimo)],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Tiempo Tricotilomanía', 'Tiempo Óptimo'],
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
    
    var chart_trico1 = new ApexCharts(document.getElementById("#chart_trico1"), options_trico1);
    chart_trico1.render();
    
    var options_trico2 = {
      series: [{
        name: "% tricotilomanía",
        data: pelos_10_sesiones
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
        text: '% tricotilomanía últimas 10 sesiones.',
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
    
    var chart_trico2 = new ApexCharts(document.querySelector("#chart_trico2"), options_trico2);
    chart_trico2.render();


    await window.api.peorSesionPelo(id_Usuario).then(result => {
      peor_ses_trico = result
      console.log(peor_ses_trico, result)
      })

    await window.api.mejorSesionPelo(id_Usuario).then(result => {
      mejor_ses_trico = result
      console.log(mejor_ses_trico, result)
      })

    //var ultima_ses_trico tiene la ultima ses

    //Graficos diarias trico
    document.getElementById("peor_ses_trico").innerHTML = peor_ses_trico;
    document.getElementById("ult_ses_trico").innerHTML = ultima_ses_trico;
    document.getElementById("mejor_ses_trico").innerHTML = mejor_ses_trico;


    let pelo_mes_act, ult_mes_pelo_total;
    let date = new Date();
    let pelo_mes_peor, pelo_mes_peor_arr = [];
    let pelo_mes_mejor, pelo_mes_mejor_arr = [];
    let categories_pelo = [];
    await window.api.sesionesMesPelo(id_Usuario, date.getMonth()+1, date.getFullYear()).then(result => {
      pelo_mes_act = result;
    })

    await window.api.mejorMesPelo(id_Usuario,date.getMonth()+1,date.getFullYear()).then(result => {
      pelo_mes_mejor = result;
    })
    
    await window.api.peorMesPelo(id_Usuario,date.getMonth()+1,date.getFullYear()).then(result => {
      pelo_mes_peor = result;
    })


    //graficos mensuales
    document.getElementById("peor_mes_trico").innerHTML = pelo_mes_peor;
    document.getElementById("ult_mes_trico").innerHTML = pelo_mes_act.reduce((a, b) => a + b, 0);
    document.getElementById("mejor_mes_trico").innerHTML = pelo_mes_mejor;



    //////// grafico de comparativo mensual trico
    
    let ctx = document.getElementById('trico_comparacion').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mejor sesión', 'Última sesión', 'Peor sesión'],
            datasets: [{
                label: 'Cantidad de detecciones',
                data: [parseInt(peor_ses_trico),parseInt(ultima_ses_trico),parseInt(mejor_ses_trico)],
                backgroundColor: [
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rrgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 1
            }]
        }
       
    });


   
    for (let index = 0; index < pelo_mes_act.length; index++) {
      pelo_mes_peor_arr[index] = pelo_mes_peor;
      pelo_mes_mejor_arr[index] = pelo_mes_mejor;
      categories_pelo[index] = index+1;      
    }


    var trico_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: pelo_mes_act
      },
      {
        name: "Mejor record",
        data: pelo_mes_mejor_arr
      },
      {
        name: 'Peor record',
        data: pelo_mes_peor_arr
      }
    ],
      chart: {
      height: 350,
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
      text: 'Cantidad de detecciones por sesión',
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
      categories: categories_pelo,
    },
    
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_tricomes = new ApexCharts(document.getElementById("chart_tricomes"), trico_mes);
    chart_tricomes.render();

    //----------------------------------------Pestaña MANIA MORDER OBJETOS------------------------------------------------
    //////// Dashboard objetos





    await window.api.countMorderSesion(id_Sesion).then(result => {
      ultima_ses_morder = result
      })

    await window.api.allSesionsMorder(id_Usuario).then(result => {
      total_morder_objeto = result
      })
    
       
    //Html: dashboard, pestana: objetos, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-morder").innerHTML =  ultima_ses_morder;   


    //Html: dashboard, pestana: objetos, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-morder").innerHTML = total_morder_objeto;

    var tiempo_morder;
    await window.api.totalTimeMorder(id_Usuario).then(result => {
      tiempo_morder = result
    })

    var options_obj1 = {
      series: [parseInt(tiempo_morder), parseInt(tiempo_optimo)], 
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Tiempo Morder objetos', 'Tiempo Óptimo'],
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
    
    var chart_obj1 = new ApexCharts(document.getElementById("#chart_obj1"), options_obj1);
    chart_obj1.render();
    
    var options_obj2 = {
      series: [{
        name: "% morder objetos",
        data: objetos_10_sesiones
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
        text: '% morder objetos últimas 10 sesiones.',
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
    
    var chart_obj2 = new ApexCharts(document.getElementById("#chart_obj2"), options_obj2);
    chart_obj2.render();
    
    //Diarias
    
    //vat ultima_ses_morder ultima ses

    await window.api.peorSesionMorder(id_Usuario).then(result => {
      peor_ses_obj = result
      })

    await window.api.mejorSesionMorder(id_Usuario).then(result => {
      mejor_ses_obj = result
      })



    //Graficos diarias objetos
    document.getElementById("peor_ses_obj").innerHTML = peor_ses_obj;
    document.getElementById("ult_ses_obj").innerHTML = ultima_ses_morder;
    document.getElementById("mejor_ses_obj").innerHTML = mejor_ses_obj;

    //graficos mensuales
    let obj_mes_act;
    let obj_mes_peor, obj_mes_peor_arr = [];
    let obj_mes_mejor, obj_mes_mejor_arr = [];
    let categories_obj = [];
    await window.api.sesionesMesMorder(id_Usuario, date.getMonth()+1, date.getFullYear()).then(result => {
      obj_mes_act = result;
    })

    await window.api.mejorMesMorder(id_Usuario,date.getMonth()+1,date.getFullYear()).then(result => {
      obj_mes_mejor = result;
    })
    
    await window.api.peorMesMorder(id_Usuario,date.getMonth()+1,date.getFullYear()).then(result => {
      obj_mes_peor = result;
    })





    document.getElementById("peor_mes_obj").innerHTML = obj_mes_peor;
    document.getElementById("ult_mes_obj").innerHTML = obj_mes_act.reduce((a, b) => a + b, 0);
    document.getElementById("mejor_mes_obj").innerHTML = obj_mes_mejor;

      
    let ct = document.getElementById('ob_comparacion').getContext('2d');
    let ob_comparacion = new Chart(ct, {
        type: 'bar',
        data: {
            labels: ['Mejor sesión', 'Última sesión', 'Peor sesión'],
            datasets: [{
                label: 'Cantidad de detecciones',
                data: [parseInt(peor_ses_obj), parseInt(ultima_ses_morder),parseInt(mejor_ses_obj)],
                backgroundColor: [
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rrgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 1
            }]
        }
       
    });
  

    for (let index = 0; index < obj_mes_act.length; index++) {
      obj_mes_peor_arr[index] = obj_mes_peor;
      obj_mes_mejor_arr[index] = obj_mes_mejor;
      categories_obj[index] = index+1;      
    }
    
    //////// grafico de comparativo mensual objetos
    var ob_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: obj_mes_act
      },
      {
        name: "Mejor record",
        data: obj_mes_mejor_arr
      },
      {
        name: 'Peor record',
        data: obj_mes_peor_arr
      }
    ],
      chart: {
      height: 350,
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
      text: 'Cantidad de detecciones por sesión',
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
      categories: categories_obj,
    },
    
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_obmes = new ApexCharts(document.getElementById("chart_obmes"), ob_mes);
    chart_obmes.render();

    myChart();
    ob_comparacion();
}

const tricorec = document.getElementById('tricorec');
const tricomes = document.getElementById('tricomes');
const tricoanio = document.getElementById('tricoanio');

const checktricorec = document.getElementById('checktricorec');
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
const checkobjmes = document.getElementById('checkobjmes');
const checkobjanio = document.getElementById('checkobjanio');

const objrec = document.getElementById('objrec');
const objomes = document.getElementById('objmes');
const objanio = document.getElementById('objanio');



checkobjrec.addEventListener('click', function handleClick() {
  if (checkobjrec.checked) {
    objrec.style.display = 'block';
    objomes.style.display = 'none';
    objanio.style.display = 'none';
    objrec.style.visibility = 'visible';
    objomes.style.visibility = 'hidden';
    objanio.style.visibility = 'hidden';
    
  } else {
    objrec.style.display = 'none';
    objrec.style.visibility = 'hidden';
  }
});

checkobjmes.addEventListener('click', function handleClick() {
  if (checkobjmes.checked) {
    objrec.style.display = 'none';
    objomes.style.display = 'block';
    objanio.style.display = 'none';
    objrec.style.visibility = 'hidden';
    objomes.style.visibility = 'visible';
    objanio.style.visibility = 'hidden';
  } else {
    objomes.style.display = 'none';
    objomes.style.visibility = 'hidden';
  }
});

checkobjanio.addEventListener('click', function handleClick() {
  if (checkobjanio.checked) {
    objrec.style.display = 'none';
    objomes.style.display = 'none';
    objanio.style.display = 'block';
    objrec.style.visibility = 'hidden';
    objomes.style.visibility = 'hidden';
    objanio.style.visibility = 'visible';
    
  } else {
    objanio.style.display = 'none';
    objanio.style.visibility = 'hidden';
  }
});


window.onload = update_dash_general;
