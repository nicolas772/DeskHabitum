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

var options = {
  series: [{
  name: 'Porcentaje de tiempo',
  data: [30,25]
  
}],
  chart: {
  type: 'bar',
  height: 200
},
plotOptions: {
  bar: {
    borderRadius: 4,
    horizontal: true,
  }
},
dataLabels: {
  enabled: false
},
xaxis: {
  categories: ['Semana 1', 'Semana 2'
  ],
}
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

var options2 = {
  series: [44, 55, 13],
  chart: {
  width: 380,
  type: 'pie',
},
labels: ['Manías compulsivas', 'Fatiga visual', 'Mala postura'],
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

var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
chart2.render();

var options3 = {
  series: [{
  name: 'Cantidad de detecciones',
  data: [400, 430, 448, 470]
}],
  chart: {
  type: 'bar',
  height: 350
},
plotOptions: {
  bar: {
    borderRadius: 4,
    horizontal: true,
  }
},
dataLabels: {
  enabled: false
},
xaxis: {
  categories: ['Morderse las uñas', 'Fatiga visual', 'Mala postura', 'tricotilomanía'
  ],
}
};

var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
chart3.render();

var options4 = {
  series: [{
  name: 'Semana 1',
  data: [44, 55, 41]
}, {
  name: 'Semana 2',
  data: [53, 32, 33]
}],
  chart: {
  type: 'bar',
  height: 430
},
plotOptions: {
  bar: {
    horizontal: true,
    dataLabels: {
      position: 'top',
    },
  }
},
dataLabels: {
  enabled: true,
  offsetX: -6,
  style: {
    fontSize: '12px',
    colors: ['#fff']
  }
},
stroke: {
  show: true,
  width: 1,
  colors: ['#fff']
},
tooltip: {
  shared: true,
  intersect: false
},
xaxis: {
  categories: ['Manías compulsivas', 'Fatiga visual', 'Mala postura'],
},
};

var chart4 = new ApexCharts(document.querySelector("#chart4"), options4);
chart4.render();

var total_pelo = 20;
var total_morder = 15;

var conteounhas1 =window.api.countAllUnhas(userId).then(result => {
  document.getElementById("h1totunhas").innerHTML=result + total_pelo + total_morder;
  var options5 = {
    series: [total_pelo, result, total_morder],
    chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Tricotilomanía', 'Morderse las uñas', 'Morder objetos'],
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
  
});



/*Intento timeline*/

/*Llamando api*/

/*
* crud.lastSesion(2).then(res => crud.createUnhas(res,u.inicio,u.final))
* */
let last_sesion
let pelo_ultima_sesion = 2
let morder_ultima_sesion = 3
var l_sesion = window.api.lastSesion(userId).then(result => {
  last_sesion=result
  console.log(result);
  window.api.countUnhasSesion(last_sesion).then(result => {
    document.getElementById("h1unhassesion").innerHTML=result + pelo_ultima_sesion + morder_ultima_sesion;
    console.log(result);
  });
});

/*var conteounhas2 =window.api.countUnhasSesion(last_sesion).then(result => {
  document.getElementById("h1unhassesion").innerHTML=result;
  console.log(result);
});*/



//document.getElementById("h1totunhas").innerHTML=window.api.countAllUnhas(1);
/*--Grafico reporte general--*/

var options11 = {
  series: [{
    name: "Tricotilomanía",
    data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8]
  },
    {
      name: "Onicofagia",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51]
    },
    {
      name: 'Manía Mordiendo Objetos',
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56]
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
    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10'
    ],
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

var chart11 = new ApexCharts(document.querySelector("#chart11"), options11);
chart11.render();





/*---*/
/*-------------------------Graficos onicofagia*/


var options61 = {
  series: [24, 35],
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
    data: [13, 10, 41, 35, 51, 49, 62, 69, 75, 51]
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
    categories: ['1','2', '3', '4', '5', '6', '7', '8', '9', '10'],
  }
};

var chart62 = new ApexCharts(document.querySelector("#chart62"), options62);
chart62.render();



/*-----------------Fin graficos onicofagia*/


/*-------GRAFICO GENERAL % CADA MAL HABITO---*/
var options00 = {
  series: [75,44, 55, 67],
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
        },
        value: {
          fontSize: '16px',
        },
        total: {
          show: false,
          label: 'Óptimo',
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return '75%'
          }
        }
      }
    }
  },
  labels: ['Óptimo','Manías Compulsivas', 'Mala Postura', 'Estimación fatiga visual'],
  legend:{
    show:true,
    position: 'bottom',
    horizontalAlign: 'center'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 500
      },
      legend: {
        position: 'right'
      }
    }
  }]
};

var chart00 = new ApexCharts(document.querySelector("#chart00"), options00);
chart00.render();

/*fin grafico general de cada mal hábito*/

var optionsdona = {
  series: [15, 6, 9, 45],
  chart: {
    height:300,
    width:500,
  type: 'donut',
},
labels: ['Onicofagia', 'Tricotilomanía', 'Morder objetos', 'Sin detección de manía'],
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

var chartdona = new ApexCharts(document.querySelector("#chartdona"), optionsdona);
//chartdona.render();

//const sub_menu =document.querySelection(".sub-menu");


/*
cont sub_menu = document.querySelecton(".sub-menu")
<script type="text/javascript">
        $(document).ready(function(){
            $('.sub-btn').click(function(){
                $(this).next('.sub-menu').slideToggle();
            });
        });
    </script>
*/

