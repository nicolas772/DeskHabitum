let ID_USER = window.api.get_user_id("")

/* Grafico para fatiga mensual */

var fatiga_mes = {
    series: [{
    name: 'Pestañeo promedio',
    data: [5,5,5,5,5,5,5,5]
  }, {
    name: 'Pestañeo mes actual',
    data: [3, 3, 4, 5, 3, 6, 4,6]
  }],
    chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {          
    categories: ["1", "2", "3", "4", "5", "6", "7","8"]    
  },
  annotations: {
    yaxis: [{
      y: 0
    }]
  },      
  };

  var chart_fatm = new ApexCharts(document.querySelector("#chart_fatm"), fatiga_mes);
  chart_fatm.render();