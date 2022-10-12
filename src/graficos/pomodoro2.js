
//----------GRAFICO POMODORO
let opt_pomodoro = {
    series: [{
    name: 'Manías',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66,22]
  }, {
    name: 'Fatiga Visual',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94,33]
  }, {
    name: 'Postura',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41,44]
  }],
    chart: {
    type: 'bar',
    height: 345
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '35%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Sesion 1', 'Sesion 2', 'Sesion 3', 'Sesion 4', 'Sesion 5', 'Sesion 6', 'Sesion 7', 'Sesion 8', 'Sesion 9','Sesion 10'],
  },
  yaxis: {
    title: {
      text: '# Detecciones'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "" + val + "  detecciones"
      }
    }
  }
  };

  let chart_pomodoro = new ApexCharts(document.querySelector("#chart_pomodoro"), opt_pomodoro);
  chart_pomodoro.render();

let ct2 = document.getElementById('pom_comparacion').getContext('2d');
let pom_comparacion = new Chart(ct2, {
  type: 'bar',
  data: {
      labels: ['Peor pomodoro', 'Último pomodoro', 'Mejor pomodoro'],
      datasets: [{
          label: 'Cantidad de detecciones',
          data: [10, 5,3],
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

pom_comparacion();

  
