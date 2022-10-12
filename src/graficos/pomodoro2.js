
//----------GRAFICO POMODORO
let ID_USER = window.api.get_user_id("")
let pom_totales, pom_ultimo_mes, peor_pom, mejor_pom, ultimo_pom
let habita_mas, habito_menos
let date = new Date();
let mes_anterior = date.getMonth()
let mes_actual = date.getMonth()+1
let datos_manias, arr_manias = [], mejor_mania, peor_mania
let pom_tiempo_optimo, pom_tiempo_pelo, pom_tiempo_morder, pom_tiempo_unna, pom_tiempo_total

async function update_pomodoro(){
  await window.api.contarSesionPomodoro(ID_USER).then(result => {
    pom_totales = result
  })
  await window.api.contarMesPomodoro(ID_USER, mes_actual).then(result => {
    pom_ultimo_mes = result
  })
  
  document.getElementById("pom_totales").innerHTML = pom_totales
  document.getElementById("pom_totales_mes").innerHTML = pom_ultimo_mes
  await window.api.datosTotalesPomodoro(ID_USER).then(result=>{
    datos_manias = result
  })

  
  arr_manias.push(parseInt(datos_manias['unna']))
  arr_manias.push(parseInt(datos_manias['pelo']))
  arr_manias.push(parseInt(datos_manias['morder']))
  arr_manias.push(parseInt(datos_manias['vision']))
  let max = 0, min, index_max, index_min
  max = Math.max.apply(Math,arr_manias)
  min = Math.min.apply(Math,arr_manias)
  index_max = arr_manias.indexOf(max)
  index_min = arr_manias.indexOf(min)
  switch (index_max) {
    case 0:
      peor_mania = "Onicofagia"
      break;
    case 1:
      peor_mania = "Tricotilomania"
      break;
    case 2:
      peor_mania = "Morder Objetos"
      break;
    case 3:
      peor_mania = "Vista"
      break;    
    default:
      break;
  }
  switch (index_min) {
    case 0:
      mejor_mania = "Onicofagia"
      break;
    case 1:
      mejor_mania = "Tricotilomania"
      break;
    case 2:
      mejor_mania = "Morder Objetos"
      break;
    case 3:
      mejor_mania = "Vista"
      break;    
    default:
      break;
  }

  document.getElementById("pom_peor_mania").innerHTML = peor_mania
  document.getElementById("pom_mejor_mania").innerHTML = mejor_mania

  await window.api.datosUltimaSesionPomodoro(ID_USER).then(result => {
    pom_tiempo_total = parseInt(result[0]['total_time'])
    pom_tiempo_unna = parseInt(result[0]['time_unnas'])
    pom_tiempo_pelo = parseInt(result[0]['time_pelo'])
    pom_tiempo_morder = parseInt(result[0]['time_morder'])
    pom_tiempo_optimo = pom_tiempo_total-pom_tiempo_unna-pom_tiempo_pelo-pom_tiempo_morder
    console.log('tiempo pelo'+pom_tiempo_pelo.toString())
  })

  pom_tiempo_optimo = parseInt((pom_tiempo_optimo/pom_tiempo_total)*100)
  pom_tiempo_unna = parseInt((pom_tiempo_unna/pom_tiempo_total)*100)
  pom_tiempo_pelo = parseInt((pom_tiempo_pelo/pom_tiempo_total)*100)
  pom_tiempo_morder = parseInt((pom_tiempo_morder/pom_tiempo_total)*100)


  var dataHabitosUltimoPomodoro= {
    series: [pom_tiempo_unna,pom_tiempo_pelo,pom_tiempo_morder,pom_tiempo_optimo],
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

  await window.api.peorSesionPomodoro(ID_USER).then(result =>{
    peor_pom = result
  })
  await window.api.mejorSesionPomodoro(ID_USER).then(result =>{
    mejor_pom = result
  })
  await window.api.ultimaSesionPomodoro(ID_USER).then(result =>{
    ultimo_pom = result
  })

  let ct2 = document.getElementById('pom_comparacion').getContext('2d');
  let pom_comparacion = new Chart(ct2, {
    type: 'bar',
    data: {
        labels: ['Peor pomodoro', 'Último pomodoro', 'Mejor pomodoro'],
        datasets: [{
            label: 'Cantidad de detecciones',
            data: [peor_pom, ultimo_pom, mejor_pom],
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

  //pom_comparacion;

}


window.onload = update_pomodoro
  
