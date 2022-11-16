let ID_USER = window.api.get_user_id("")
let id_Sesion;

var unha_ultima_sesion = 0;
var pelo_ultima_sesion = 0;
var morder_ultima_sesion = 0;
var piel_ultima_sesion = 0;
var nariz_ultima_sesion = 0;

var total_pelo = 0;
var total_morder = 0;
var total_unha = 0;


var pelos_10_sesiones = [];
var unhas_10_sesiones = [];
var objetos_10_sesiones = [];
var piel_10_sesiones = []
var nariz_10_sesiones = []

var tiempo_unha = 0
var tiempo_nariz = 0
var tiempo_piel = 0
var tiempo_trico=0;
var tiempo_optimo = 0

let ultima_ses_trico, total_trico;
let peor_ses_trico, mejor_ses_trico;
let ultima_ses_nariz, total_nariz;
let peor_ses_nariz, mejor_ses_nariz;
let ultima_ses_piel, total_piel;
let peor_ses_piel, mejor_ses_piel;
let ultima_ses_morder, total_morder_objeto;
let peor_ses_obj, mejor_ses_obj;

async function update_dash_general() {

    await window.api.lastSesion(ID_USER).then(result => {
        id_Sesion = result;
      });


    //Html: dashboard, dato: Cantidad detecciones ultima sesion
    await window.api.countUnhasSesion(id_Sesion).then(result => {
      unha_ultima_sesion = result;
    });

    await window.api.countPeloSesion(id_Sesion).then(result => {
      pelo_ultima_sesion = result;
    });

    await window.api.countMorderSesion(id_Sesion).then(result => {
      morder_ultima_sesion = result;
    });

    await window.api.totalPiel(ID_USER).then(result => {
      piel_ultima_sesion = parseInt(result);
    });

    await window.api.totalNariz(ID_USER).then(result => {
      nariz_ultima_sesion = parseInt(result);
    });

    //agregar pelo y morder

    document.getElementById("deteccionesUltimaSesion").innerHTML= unha_ultima_sesion + pelo_ultima_sesion + morder_ultima_sesion +piel_ultima_sesion+nariz_ultima_sesion;


    //Html: dashboard, dato: Cantidad detecciones totales
    await window.api.allSesionsUnhas(ID_USER).then(result => {
        total_unha = result;
      });

    await window.api.allSesionsMorder(ID_USER).then(result => {
      total_morder = result;
    });

    await window.api.allSesionsPelo(ID_USER).then(result => {
      total_pelo = result;
    });
    await window.api.totalNariz(ID_USER).then(result => {
      total_nariz = parseInt(result);
    })
    await window.api.totalPiel(ID_USER).then(result => {
      total_piel = parseInt(result);
    })


    //agregar pelo y morder

    document.getElementById("deteccionesTotales").innerHTML = total_unha + total_pelo + total_morder + total_nariz + total_piel;

    //html: dashboard, dato: Porcentage de distraccion total

    var dataDistraccionTotal = {
        series: [total_unha, total_pelo, total_morder, total_nariz, total_piel],
        chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Onicofagia', 'Tricotilomanía', 'Manía Mordiendo Objetos', 'Rinotilexomanía', 'Dermatilomanía'],
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
      
      await window.api.percentageTenSesionUnhas(ID_USER).then(result => {
        unhas_10_sesiones = result;
      });

      await window.api.percentageTenSesionPelo(ID_USER).then(result => {
        pelos_10_sesiones = result;
      });

      await window.api.percentageTenSesionMorder(ID_USER).then(result => {
        objetos_10_sesiones = result;
      });

      await window.api.percentageTenSesionPiel(ID_USER).then(result => {
        piel_10_sesiones = result;
      })

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
          },
          {
            name: 'Dermantilomanía',
            data: piel_10_sesiones
          },
          {
            name: 'Rinotilexomanía',
            data: nariz_10_sesiones
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
          width: [5, 7, 5, 5, 5],
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
        yaxis:{
          decimalsInFloat: 0,
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
    await window.api.totalTimeUnhas(ID_USER).then(result => {
      tiempo_unha = result;
    });
    await window.api.totalTimeSesions(ID_USER).then(result => {
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
        },
        yaxis:{
          decimalsInFloat: 0,
        }
      };
    
    var chart10SesionesUnhas = new ApexCharts(document.getElementById("chart10SesionesUnhas"), data10SesionesUnhas);
    chart10SesionesUnhas.render();

    //----------------------------------------Pestaña TRICOTILOMANIA------------------------------------------------
    



    await window.api.countPeloSesion(id_Sesion).then(result => {
      ultima_ses_trico = result
      })

    await window.api.allSesionsPelo(ID_USER).then(result => {
      total_trico = result
      })
    
       
    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-trico").innerHTML =  ultima_ses_trico;   


    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-trico").innerHTML = total_trico;


    await window.api.totalTimePelo(ID_USER).then(result => {
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
      },
      yaxis:{
        decimalsInFloat: 0,
      }
    };
    
    var chart_trico2 = new ApexCharts(document.querySelector("#chart_trico2"), options_trico2);
    chart_trico2.render();


    await window.api.peorSesionPelo(ID_USER).then(result => {
      peor_ses_trico = result
      console.log(peor_ses_trico, result)
      })

    await window.api.mejorSesionPelo(ID_USER).then(result => {
      mejor_ses_trico = result
      console.log(mejor_ses_trico, result)
      })

    //var ultima_ses_trico tiene la ultima ses

    //Graficos diarias trico
    document.getElementById("peor_ses_trico").innerHTML = peor_ses_trico;
    document.getElementById("ult_ses_trico").innerHTML = ultima_ses_trico;
    document.getElementById("mejor_ses_trico").innerHTML = mejor_ses_trico;


    let pelo_mes_act;
    let date = new Date();
    let pelo_mes_peor, pelo_mes_peor_arr = [];
    let pelo_mes_mejor, pelo_mes_mejor_arr = [];
    let categories_pelo = [];
    await window.api.sesionesMesPelo(ID_USER, date.getMonth()+1, date.getFullYear()).then(result => {
      pelo_mes_act = result;
    })

    await window.api.mejorMesPelo(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      pelo_mes_mejor = result;
    })
    
    await window.api.peorMesPelo(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
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
            labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
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
      pelo_mes_peor_arr[index] = peor_ses_trico;
      pelo_mes_mejor_arr[index] = mejor_ses_trico;
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

    await window.api.allSesionsMorder(ID_USER).then(result => {
      total_morder_objeto = result
      })
    
       
    //Html: dashboard, pestana: objetos, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-morder").innerHTML =  ultima_ses_morder;   


    //Html: dashboard, pestana: objetos, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-morder").innerHTML = total_morder_objeto;

    var tiempo_morder;
    await window.api.totalTimeMorder(ID_USER).then(result => {
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
      },
      yaxis:{
        decimalsInFloat: 0,
      }
    };
    
    var chart_obj2 = new ApexCharts(document.getElementById("#chart_obj2"), options_obj2);
    chart_obj2.render();
    
    //Diarias
    
    //vat ultima_ses_morder ultima ses

    await window.api.peorSesionMorder(ID_USER).then(result => {
      peor_ses_obj = result
      })

    await window.api.mejorSesionMorder(ID_USER).then(result => {
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
    await window.api.sesionesMesMorder(ID_USER, date.getMonth()+1, date.getFullYear()).then(result => {
      obj_mes_act = result;
    })

    await window.api.mejorMesMorder(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      obj_mes_mejor = result;
    })
    
    await window.api.peorMesMorder(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      obj_mes_peor = result;
    })





    document.getElementById("peor_mes_obj").innerHTML = obj_mes_peor;
    document.getElementById("ult_mes_obj").innerHTML = obj_mes_act.reduce((a, b) => a + b, 0);
    document.getElementById("mejor_mes_obj").innerHTML = obj_mes_mejor;

      
    let ct = document.getElementById('ob_comparacion').getContext('2d');
    let ob_comparacion = new Chart(ct, {
        type: 'bar',
        data: {
            labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
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
      obj_mes_peor_arr[index] = peor_ses_obj;
      obj_mes_mejor_arr[index] = mejor_ses_obj;
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

    //---------PESTAÑA RINO------

    await window.api.ultimaNariz(ID_USER).then(result => {
      ultima_ses_nariz = result;
    })

    await window.api.peorSesionNariz(ID_USER).then(result => {
      peor_ses_nariz = result;
    })
    await window.api.mejorSesionNariz(ID_USER).then(result => {
      mejor_ses_nariz = result;
    })
    await window.api.percentageTenSesionNariz(ID_USER).then(result => {
      nariz_10_sesiones = result;
    })
    await window.api.totalTimeNariz(ID_USER).then(result => {
      if(parseInt(result)>0) {
        tiempo_nariz = result;
      }     
    })


    //resumen
    document.getElementById("ultima-sesion-nariz").innerHTML = ultima_ses_nariz;
    document.getElementById("total-detecciones-nariz").innerHTML = total_nariz;

    //por sesion
    document.getElementById("peor_ses_nariz").innerHTML = peor_ses_nariz;
    document.getElementById("ult_ses_nariz").innerHTML = ultima_ses_nariz;
    document.getElementById("mejor_ses_nariz").innerHTML = mejor_ses_nariz;

    var options_rino1 = {
      series: [parseInt(tiempo_nariz), parseInt(tiempo_optimo)],  //series: [parseInt(tiempo_morder), parseInt(tiempo_optimo)], 
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Tiempo Rinotilexomanía', 'Tiempo Óptimo'],
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

    var chart_rino1 = new ApexCharts(document.getElementById("#chart_rino1"), options_rino1);
    chart_rino1.render();

    var options_rino2 = {
      series: [{
        name: "% Rinotilexomanía",
        data: nariz_10_sesiones //data: objetos_10_sesiones
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
        text: '% Rinotilexomanía últimas 10 sesiones.',
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
      },
      yaxis:{
        decimalsInFloat: 0,
      }
    };

    var chart_rino2 = new ApexCharts(document.getElementById("#chart_rino2"), options_rino2);
    chart_rino2.render();
    //--
    let ct2 = document.getElementById('rino_comparacion').getContext('2d');
        let rino_comparacion = new Chart(ct2, {
            type: 'bar',
            data: {
                labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
                datasets: [{
                    label: 'Cantidad de detecciones',
                    data: [peor_ses_nariz, ultima_ses_nariz, mejor_ses_nariz],// data: [parseInt(peor_ses_obj), parseInt(ultima_ses_morder),parseInt(mejor_ses_obj)]
                    backgroundColor: [
                        'rgba(58, 198, 143, 0.2)', //'rgba(255, 205, 86, 0.2)'
                        'rgba(58, 198, 143, 0.2)', //'rgba(75, 192, 192, 0.2)'
                        'rgba(58, 198, 143, 0.2)' //'rrgba(255, 99, 132, 0.2)' 
                    ],
                    borderColor: [
                        'rgb(0, 91, 82)', //'rgb(255, 205, 86)'
                        'rgb(0, 91, 82)', //'rgb(75, 192, 192)'
                        'rgb(0, 91, 82)' //'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1,
                    yaxis:{
                      decimalsInFloat: 0,
                    }
                }]
            }
          
        });
      


    //--
    let nariz_mes_act;
    let nariz_mes_peor, nariz_mes_peor_arr = [];
    let nariz_mes_mejor, nariz_mes_mejor_arr = [];
    let categories_nariz = [];
    await window.api.sesionesMesNariz(ID_USER, date.getMonth()+1, date.getFullYear()).then(result => {
      nariz_mes_act = result;
    })

    await window.api.mejorMesNariz(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      nariz_mes_mejor = result;
    })
    
    await window.api.peorMesNariz(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      nariz_mes_peor = result;
    })





    document.getElementById("peor_mes_nariz").innerHTML = nariz_mes_peor;
    document.getElementById("ult_mes_nariz").innerHTML = nariz_mes_act.reduce((a, b) => a + b, 0);
    document.getElementById("mejor_mes_nariz").innerHTML = nariz_mes_mejor;

    for (let index = 0; index < nariz_mes_act.length; index++) {
      nariz_mes_peor_arr[index] = peor_ses_nariz;
      nariz_mes_mejor_arr[index] = mejor_ses_nariz;
      categories_nariz[index] = index+1;  
         
    }


    var rino_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: nariz_mes_act
      },
      {
        name: "Mejor record",
        data: nariz_mes_mejor_arr
      },
      {
        name: 'Peor record',
        data: nariz_mes_peor_arr
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
      text: 'Page Statistics',
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
      categories: categories_nariz,
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (mins)"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + " per session"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val;
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_rinomes = new ApexCharts(document.querySelector("#chart_rinomes"), rino_mes);
    chart_rinomes.render();

    //---------PESTAÑA DERMA-----
    await window.api.ultimaPiel(ID_USER).then(result => {
      ultima_ses_piel = result;
    })

    await window.api.peorSesionPiel(ID_USER).then(result => {
      peor_ses_piel = result;
    })
    await window.api.mejorSesionPiel(ID_USER).then(result => {
      mejor_ses_piel= result;
    })

    await window.api.totalTimePiel(ID_USER).then(result => {
      if(parseInt(result)>0) {
        tiempo_piel = result;
      }     
    })


    //resumen
    document.getElementById("ultima-sesion-piel").innerHTML = ultima_ses_piel;
    document.getElementById("total-detecciones-piel").innerHTML = total_piel;

    //por sesion
    document.getElementById("peor_ses_piel").innerHTML = peor_ses_piel;
    document.getElementById("ult_ses_piel").innerHTML = ultima_ses_piel;
    document.getElementById("mejor_ses_piel").innerHTML = mejor_ses_piel;


    var options_derma1 = {
      series: [parseInt(tiempo_piel), parseInt(tiempo_optimo)],  //series: [parseInt(tiempo_morder), parseInt(tiempo_optimo)], 
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Tiempo Dermatilomanía', 'Tiempo Óptimo'],
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

    var chart_derma1 = new ApexCharts(document.getElementById("#chart_derma1"), options_derma1);
    chart_derma1.render();

    var options_derma2 = {
      series: [{
        name: "% Dermatilomanía",
        data: piel_10_sesiones //data: objetos_10_sesiones
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
        text: '% Dermatilomanía últimas 10 sesiones.',
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
      },
      yaxis:{
        decimalsInFloat: 0,
      }
    };

    var chart_derma2 = new ApexCharts(document.getElementById("#chart_derma2"), options_derma2);
    chart_derma2.render();

    let ct3 = document.getElementById('derma_comparacion').getContext('2d');
        let derma_comparacion = new Chart(ct3, {
            type: 'bar',
            data: {
                labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
                datasets: [{
                    label: 'Cantidad de detecciones',
                    data: [peor_ses_piel, ultima_ses_piel, mejor_ses_piel],// data: [parseInt(peor_ses_obj), parseInt(ultima_ses_morder),parseInt(mejor_ses_obj)]
                    backgroundColor: [
                      'rgba(58, 198, 143, 0.2)', //'rgba(255, 205, 86, 0.2)'
                      'rgba(58, 198, 143, 0.2)', //'rgba(75, 192, 192, 0.2)'
                      'rgba(58, 198, 143, 0.2)' //'rrgba(255, 99, 132, 0.2)' 
                    ],
                    borderColor: [
                        'rgb(0, 91, 82)', //'rgb(255, 205, 86)'
                        'rgb(0, 91, 82)', //'rgb(75, 192, 192)'
                        'rgb(0, 91, 82)' //'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1,
                    yaxis:{
                      decimalsInFloat: false,
                    }
                }]
            }
          
        });
      

    let piel_mes_act;
    let piel_mes_peor, piel_mes_peor_arr = [];
    let piel_mes_mejor, piel_mes_mejor_arr = [];
    let categories_piel = [];
    await window.api.sesionesMesPiel(ID_USER, date.getMonth()+1, date.getFullYear()).then(result => {
      piel_mes_act = result;
    })

    await window.api.mejorMesPiel(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      piel_mes_mejor = result;
    })
    
    await window.api.peorMesPiel(ID_USER,date.getMonth()+1,date.getFullYear()).then(result => {
      piel_mes_peor = result;
    })





    document.getElementById("peor_mes_piel").innerHTML = piel_mes_peor;
    document.getElementById("ult_mes_piel").innerHTML = piel_mes_act.reduce((a, b) => a + b, 0);
    document.getElementById("mejor_mes_piel").innerHTML = piel_mes_mejor;

    for (let index = 0; index < piel_mes_act.length; index++) {
      piel_mes_peor_arr[index] = peor_ses_piel;
      piel_mes_mejor_arr[index] = mejor_ses_piel;
      categories_piel[index] = index+1;  
         
    }




    var derma_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: piel_mes_act
      },
      {
        name: "Mejor record",
        data: piel_mes_mejor_arr
      },
      {
        name: 'Peor record',
        data: piel_mes_peor_arr
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
      text: 'Page Statistics',
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
      categories: categories_piel,
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (val) {
              return val + " (mins)"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + " per session"
            }
          }
        },
        {
          title: {
            formatter: function (val) {
              return val;
            }
          }
        }
      ]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_dermames = new ApexCharts(document.querySelector("#chart_dermames"), derma_mes);
    chart_dermames.render();


    //----------


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


//---cambio pestanias rino
const rinorec = document.getElementById('rinorec');
const rinomes = document.getElementById('rinomes');
const rinoanio = document.getElementById('rinoanio');

const checkrinorec = document.getElementById('checkrinorec');
const checkrinomes = document.getElementById('checkrinomes');
const checkrinoanio = document.getElementById('checkrinoanio');

checkrinorec.addEventListener('click', function handleClick() {
  if (checkrinorec.checked) {
    rinorec.style.display = 'block';
    rinomes.style.display = 'none';
    rinoanio.style.display = 'none';
    rinorec.style.visibility = 'visible';
    rinomes.style.visibility = 'hidden';
    rinoanio.style.visibility = 'hidden';
    
  } else {
    rinorec.style.display = 'none';
    rinorec.style.visibility = 'hidden';
  }
});

checkrinomes.addEventListener('click', function handleClick() {
  if (checkrinomes.checked) {
    rinorec.style.display = 'none';
    rinomes.style.display = 'block';
    rinoanio.style.display = 'none';
    rinorec.style.visibility = 'hidden';
    rinomes.style.visibility = 'visible';
    rinoanio.style.visibility = 'hidden';
  } else {
    rinomes.style.display = 'none';
    rinomes.style.visibility = 'hidden';
  }
});

checkrinoanio.addEventListener('click', function handleClick() {
  if (checkrinoanio.checked) {
    rinorec.style.display = 'none';
    rinomes.style.display = 'none';
    rinoanio.style.display = 'block';
    rinorec.style.visibility = 'hidden';
    rinomes.style.visibility = 'hidden';
    rinoanio.style.visibility = 'visible';
    
  } else {
    rinoanio.style.display = 'none';
    rinoanio.style.visibility = 'hidden';
  }
});

//---pestanias derma
const dermarec = document.getElementById('dermarec');
const dermames = document.getElementById('dermames');
const dermaanio = document.getElementById('dermaanio');

const checkdermarec = document.getElementById('checkdermarec');
const checkdermames = document.getElementById('checkdermames');
const checkdermaanio = document.getElementById('checkdermaanio');

checkdermarec.addEventListener('click', function handleClick() {
  if (checkdermarec.checked) {
    dermarec.style.display = 'block';
    dermames.style.display = 'none';
    dermaanio.style.display = 'none';
    dermarec.style.visibility = 'visible';
    dermames.style.visibility = 'hidden';
    dermaanio.style.visibility = 'hidden';
    
  } else {
    dermarec.style.display = 'none';
    dermarec.style.visibility = 'hidden';
  }
});

checkdermames.addEventListener('click', function handleClick() {
  if (checkdermames.checked) {
    dermarec.style.display = 'none';
    dermames.style.display = 'block';
    dermaanio.style.display = 'none';
    dermarec.style.visibility = 'hidden';
    dermames.style.visibility = 'visible';
    dermaanio.style.visibility = 'hidden';
  } else {
    dermames.style.display = 'none';
    dermames.style.visibility = 'hidden';
  }
});

checkdermaanio.addEventListener('click', function handleClick() {
  if (checkdermaanio.checked) {
    dermarec.style.display = 'none';
    dermames.style.display = 'none';
    dermaanio.style.display = 'block';
    dermarec.style.visibility = 'hidden';
    dermames.style.visibility = 'hidden';
    dermaanio.style.visibility = 'visible';
    
  } else {
    dermaanio.style.display = 'none';
    dermaanio.style.visibility = 'hidden';
  }
});










function init4(){
  update_dash_general()
  actualizarNavbar();
}
window.onload = init4;
