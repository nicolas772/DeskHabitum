var equipo_1 = {
    series: [44, 55, 67, 83],
    chart: {
    height: 230,
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
    height: 230,
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