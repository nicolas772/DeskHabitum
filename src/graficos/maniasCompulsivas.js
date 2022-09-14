let id_Usuario = 2;
let ID_USER = window.api.get_user_id("")
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
      
      await window.api.percentageTenSesionUnhas(id_Usuario).then(result => {
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
    

    let ultima_ses_trico, total_trico;

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
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8]
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

    var options_meses3_trico = {
      series: [{
      name: 'Julio',
      data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
    }, {
      name: 'Agosto',
      data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
    }, {
      name: 'Septiembre',
      data: [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null]
    }],
      chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    stroke: {
      width: [5,5,4],
      curve: 'straight'
    },
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    title: {
      text: 'Missing data (null values)'
    },
    xaxis: {
    },
    };
    
    var chart_meses3_trico = new ApexCharts(document.querySelector("#chart_meses3_trico"), options_meses3_trico);
    chart_meses3_trico.render();

    /* GRAFICO CENTRAL TRICO PARA ANUAL */
    var option_anual_trico = {
      series: [{
      name: 'Tricotilomanía',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Total',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
      name: 'Sin Tricotilomanía',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
      chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    }
    };

    var chart_anual_trico = new ApexCharts(document.querySelector("#chart_anual_trico"), option_anual_trico);
    chart_anual_trico.render();

    /* grafico trico mes 10 dias casi*/
    var options_trico_10dias = {
      series: [{
      name: 'Sales',
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
      chart: {
      height: 350,
      type: 'line',
    },
    forecastDataPoints: {
      count: 7
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
      tickAmount: 10,
      labels: {
        formatter: function(value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), 'dd MMM')
        }
      }
    },
    title: {
      text: 'Forecast',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [ '#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    },
    yaxis: {
      min: -10,
      max: 40
    }
    };

    var chart_trico10 = new ApexCharts(document.querySelector("#chart_trico10"), options_trico_10dias);
    chart_trico10.render();

    //////// grafico de comparativo mensual trico
    var trico_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: [1,4,1,6,5,8,7,5,4,6]
      },
      {
        name: "Mejor record",
        data: [1,1,1,1,1,1,1,1,1,1]
      },
      {
        name: 'Peor record',
        data: [7,7,7,7,7,7,7,7,7,7]
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
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10'
      ],
    },
    
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_tricomes = new ApexCharts(document.querySelector("#chart_tricomes"), trico_mes);
    chart_tricomes.render();

    //----------------------------------------Pestaña MANIA MORDER OBJETOS------------------------------------------------
    //////// Dashboard objetos



    let ultima_ses_morder, total_morder_objeto;

    await window.api.countMorderSesion(id_Sesion).then(result => {
      ultima_ses_morder = result
      })

    await window.api.allSesionsMorder(id_Usuario).then(result => {
      total_morder_objeto = result
      })
    
       
    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones ultima sesion
    document.getElementById("ultima-sesion-morder").innerHTML =  ultima_ses_trico;   
;

    //Html: dashboard, pestana: Onicofagia, dato: Cantidad detecciones totales
    document.getElementById("total-detecciones-morder").innerHTML = total_trico;

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
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56]
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
    
    var chart_obj2 = new ApexCharts(document.querySelector("#chart_obj2"), options_obj2);
    chart_obj2.render();
    
    /*--GRAFICO 3 MESES PARA ANUAL DE OBJETOS-- */

    var options_meses3_obj = {
      series: [{
      name: 'Julio',
      data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
    }, {
      name: 'Agosto',
      data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
    }, {
      name: 'Septiembre',
      data: [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null]
    }],
      chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    stroke: {
      width: [5,5,4],
      curve: 'straight'
    },
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    title: {
      text: 'Missing data (null values)'
    },
    xaxis: {
    },
    };

    var chart_meses3_obj = new ApexCharts(document.querySelector("#chart_meses3_obj"), options_meses3_obj);
    chart_meses3_obj.render();

    /*GRAFICO CENTRAL OBJETOS ANUAL */

    var option_anual_obj = {
      series: [{
      name: 'Mordiendo objetos',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Total',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
      name: 'Sin Morder objetos',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
      chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    }
    };

    var chart_anual_obj = new ApexCharts(document.querySelector("#chart_anual_obj"), option_anual_obj);
    chart_anual_obj.render();

    //------------10dias obj
    var options_obj_10dias = {
      series: [{
      name: 'Sales',
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
      chart: {
      height: 350,
      type: 'line',
    },
    forecastDataPoints: {
      count: 7
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
      tickAmount: 10,
      labels: {
        formatter: function(value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), 'dd MMM')
        }
      }
    },
    title: {
      text: 'Forecast',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [ '#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    },
    yaxis: {
      min: -10,
      max: 40
    }
    };

    var chart_obj10 = new ApexCharts(document.querySelector("#chart_obj10"), options_obj_10dias);
    chart_obj10.render();

    //////// grafico de comparativo mensual objetos
    var ob_mes = {
      series: [{
        name: "Detecciones mes actual",
        data: [1,4,1,6,5,8,7,5,4,6]
      },
      {
        name: "Mejor record",
        data: [1,1,1,1,1,1,1,1,1,1]
      },
      {
        name: 'Peor record',
        data: [7,7,7,7,7,7,7,7,7,7]
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
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10'
      ],
    },
    
    grid: {
      borderColor: '#f1f1f1',
    }
    };

    var chart_obmes = new ApexCharts(document.querySelector("#chart_obmes"), ob_mes);
    chart_obmes.render();


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
