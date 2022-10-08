var equipo_1 = {
    series: [44, 55, 67, 83],
    chart: {
    height: 180,
    width:380,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '14px',
        },
        value: {
          fontSize: '12px',
        },
        total: {
          show: true,
          label: 'Septiembre',
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return 
          }
        }
      }
    }
  },
  legend: {
    show:true,
    position: 'right',
    horizontalAlign: 'center',
    
  },
  
  labels: ['Manías Compulsivas', 'Postura', 'Fatiga Visual', 'Óptimo'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height:200,
      
          },
          legend: {
            show:true,
            position: 'bottom',
            verticalAlign: 'bottom',
            align:'left'
          }
        }
      }]
  };

var chart_equipo1 = new ApexCharts(document.querySelector("#chart_equipo1"), equipo_1);
chart_equipo1.render();


var equipo_2 = {
  series: [44, 55, 67, 83],
  chart: {
  height: 180,
  width:380,
  type: 'radialBar',
},
plotOptions: {
  radialBar: {
    dataLabels: {
      name: {
        fontSize: '14px',
      },
      value: {
        fontSize: '12px',
      },
      total: {
        show: true,
        label: 'Octubre',
        formatter: function (w) {
          // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
          return 
        }
      }
    }
  }
},
legend: {
  show:true,
  position: 'right',
  
},
labels: ['Manías Compulsivas', 'Postura', 'Fatiga Visual', 'Óptimo'],
};

var chart_equipo2 = new ApexCharts(document.querySelector("#chart_equipo2"), equipo_2);
chart_equipo2.render();


//-----EQUIPO DASH MANIA

var equipo_manias = {
  
  series: [{
  name: 'Total',
  type: 'area',
  data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
}],

  chart: {
  height: 300,
  type: 'line',
  
},
stroke: {
  curve: 'smooth',
  colors:['#3AC68F'],
},
fill: {
  type:'solid',
  colors:['#89E5B6'],
  opacity: [0.35, 1],
},
colors:['#005B52'],
labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
markers: {
  size: 0,
},
yaxis: [
  {
    title: {
      text: 'Series A',
    },
  },
  
],
tooltip: {
  shared: true,
  intersect: false,
  y: {
    formatter: function (y) {
      if(typeof y !== "undefined") {
        return  y.toFixed(0) + " points";
      }
      return y;
    }
  }
}
};

var chart_equipomanias1 = new ApexCharts(document.querySelector("#chart_equipomanias"), equipo_manias);
chart_equipomanias1.render();





//-----equipo dash fatiga visual
var equipo_fatiga1 = {
  
  series: [{
  name: 'Total',
  type: 'area',
  data: [84, 55, 31, 47, 81, 43, 26, 41, 31, 47, 33],
}],

  chart: {
  height: 300,
  type: 'line',
  
},
stroke: {
  curve: 'smooth',
  colors:['#3AC68F'],
},
fill: {
  type:'solid',
  colors:['#89E5B6'],
  opacity: [0.35, 1],
},
colors:['#005B52'],
labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
markers: {
  size: 0,
},
yaxis: [
  {
    title: {
      text: 'Series A',
    },
  },
  
],
tooltip: {
  shared: true,
  intersect: false,
  y: {
    formatter: function (y) {
      if(typeof y !== "undefined") {
        return  y.toFixed(0) + " points";
      }
      return y;
    }
  }
}
};

var chart_equipofatiga1= new ApexCharts(document.querySelector("#chart_equipofatiga1"), equipo_fatiga1);
chart_equipofatiga1.render();

var equipo_postura1 = {
  
  series: [{
  name: 'Total',
  type: 'area',
  data: [10, 10, 31, 47, 10, 43, 26, 41, 31, 47, 33],
}],

  chart: {
  height: 300,
  type: 'line',
  
},
stroke: {
  curve: 'smooth',
  colors:['#3AC68F'],
},
fill: {
  type:'solid',
  colors:['#89E5B6'],
  opacity: [0.35, 1],
},
colors:['#005B52'],
labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
markers: {
  size: 0,
},
yaxis: [
  {
    title: {
      text: 'Series A',
    },
  },
  
],
tooltip: {
  shared: true,
  intersect: false,
  y: {
    formatter: function (y) {
      if(typeof y !== "undefined") {
        return  y.toFixed(0) + " points";
      }
      return y;
    }
  }
}
};

var chart_equipopostura1= new ApexCharts(document.querySelector("#chart_equipopostura1"), equipo_postura1);
chart_equipopostura1.render();
