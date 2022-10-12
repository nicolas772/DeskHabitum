
//----------GRAFICO POMODORO
var dataHabitosUltimoPomodoro= {
  series: [44,33,22,10],
  chart: {
    height:300,
    width:400,
  type: 'donut',
},
labels: ['Tiempo Onicofagia', 'Tiempo Tricotilomanía', 'Tiempo Morder objetos', 'Tiempo Óptimo'],
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

document.getElementById("charHabitosUltimoPomodoro").innerHTML = ''
var charHabitosUltimoPomodoro = new ApexCharts(document.getElementById("charHabitosUltimoPomodoro"), dataHabitosUltimoPomodoro);
charHabitosUltimoPomodoro.render();


let ctx = document.getElementById('detecciones_comparacion').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
            datasets: [{
                label: 'Cantidad de detecciones',
                data: [55,22,3],
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





/*
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
*/