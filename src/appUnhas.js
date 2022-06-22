
id ="ultima-sesion-unhas"

id ="total-detecciones-unhas" 

let last_sesion
let pelo_ultima_sesion = 2
let morder_ultima_sesion = 3
var l_sesion = window.api.lastSesion(userId).then(result => {
  last_sesion=result
  console.log(result);
  window.api.countUnhasSesion(last_sesion).then(result => {
    document.getElementById("ultima-sesion-unhas").innerHTML=result + pelo_ultima_sesion + morder_ultima_sesion;
    console.log(result);
  });
});




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
  