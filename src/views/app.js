const shrink_btn = document.querySelector(".shrink-btn");


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
  series: [44, 55, 13, 43],
  chart: {
  width: 380,
  type: 'pie',
},
labels: ['Morderse las uñas', 'Fatiga visual', 'Mala postura', 'tricotilomanía'],
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