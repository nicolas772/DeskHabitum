let ID_USER = window.api.get_user_id("")
//---------------GRAFICO-----------





//---------------------------

//--cambiar 2-> postura

const tricorec2 = document.getElementById('tricorec2');
const tricomes2 = document.getElementById('tricomes2');
const tricoanio2 = document.getElementById('tricoanio2');

const checktricorec2 = document.getElementById('checktricorec2');
const checktricomes2 = document.getElementById('checktricomes2');
const checktricoanio2 = document.getElementById('checktricoanio2');

checktricorec2.addEventListener('click', function handleClick() {
  if (checktricorec2.checked) {
    tricorec2.style.display = 'block';
    tricomes2.style.display = 'none';
    tricoanio2.style.display = 'none';
    tricorec2.style.visibility = 'visible';
    tricomes2.style.visibility = 'hidden';
    tricoanio2.style.visibility = 'hidden';
    
  } else {
    tricorec2.style.display = 'none';
    tricorec2.style.visibility = 'hidden';
  }
});

checktricomes2.addEventListener('click', function handleClick() {
  if (checktricomes2.checked) {
    tricorec2.style.display = 'none';
    tricomes2.style.display = 'block';
    tricoanio2.style.display = 'none';
    tricorec2.style.visibility = 'hidden';
    tricomes2.style.visibility = 'visible';
    tricoanio2.style.visibility = 'hidden';
  } else {
    tricomes2.style.display = 'none';
    tricomes2.style.visibility = 'hidden';
  }
});

checktricoanio2.addEventListener('click', function handleClick() {
  if (checktricoanio2.checked) {
    tricorec2.style.display = 'none';
    tricomes2.style.display = 'none';
    tricoanio2.style.display = 'block';
    tricorec2.style.visibility = 'hidden';
    tricomes2.style.visibility = 'hidden';
    tricoanio2.style.visibility = 'visible';
    
  } else {
    tricoanio2.style.display = 'none';
    tricoanio2.style.visibility = 'hidden';
  }
});


/*
function init4(){
  update_dash_general()
  actualizarNavbar();
}
window.onload = init4;

*/

var pos_res = {
  series: [{
  name: 'Bubble1',
  data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
    min: 10,
    max: 60
  })
},
{
  name: 'Bubble2',
  data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
    min: 10,
    max: 60
  })
},
{
  name: 'Bubble3',
  data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
    min: 10,
    max: 60
  })
},
{
  name: 'Bubble4',
  data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
    min: 10,
    max: 60
  })
}],
  chart: {
    height: 350,
    type: 'bubble',
},
dataLabels: {
    enabled: false
},
fill: {
    opacity: 0.8
},
title: {
    text: 'Simple Bubble Chart'
},
xaxis: {
    tickAmount: 12,
    type: 'category',
},
yaxis: {
    max: 70
}
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


let pos_res = document.getElementById('pos_comparacion').getContext('2d');
let posres = new Chart(pos_res, {
    type: 'bar',
    data: {
        labels: ['Peor mes', 'Último mes', 'Mejor mes'],
        datasets: [{
            label: 'Cantidad de detecciones',
            data: [29,25,16],
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
    },
    options: {
      indexAxis: 'y',
    }       
});
posres();
