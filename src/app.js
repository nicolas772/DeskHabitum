const shrink_btn = document.querySelector(".shrink-btn");


shrink_btn.addEventListener("click",()=>{
    document.body.classList.toggle("shrink");
    shrink_btn.classList.add("hovered");

    setTimeout(
        ()=>{
            shrink_btn.classList.remove("hovered");
        },500);

});

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

var options5 = {
  series: [24, 35, 13],
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


/*Intento timeline*/

/*Llamando api*/

/*
* crud.lastSesion(2).then(res => crud.createUnhas(res,u.inicio,u.final))
* */

var conteounhas1 =window.api.countAllUnhas(1).then(result => {
  document.getElementById("h1totunhas").innerHTML=result;
  console.log(result);
});


var conteounhas2 =window.api.countUnhasSesion(1).then(result => {
  document.getElementById("h1unhassesion").innerHTML=result;
  console.log(result);
});



//document.getElementById("h1totunhas").innerHTML=window.api.countAllUnhas(1);


