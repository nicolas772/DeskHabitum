
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

  
