let ID_USER = window.api.get_user_id("")
/* Grafico para fatiga mensual */
let num_fatiga, tiempo, porcentage
let fatiga_ultima, fatiga_total, arr_pestaneo = [0,0,0,0,0,0,0,0,0,0], datos_vista

async function update_fatiga_visual(){
  await window.api.ultimaVista(ID_USER).then(result => {
    fatiga_ultima = result
  })

  await window.api.totalVista(ID_USER).then(result => {
    fatiga_total = result
  })
  await window.api.top10Vista(ID_USER).then(result => {
    datos_vista = result   
  })

  console.log(datos_vista)

  for (let x = 0; x < datos_vista.length; x++) {
    if (datos_vista[x]['total_time'] == '0') {
    }else{
      num_fatiga = datos_vista[x]['total_vista']
      tiempo = parseInt(datos_vista[x]['total_time'])
      porcentage = (num_fatiga/tiempo)*3600
      arr_pestaneo[x]=porcentage
    }
    
  }
  arr_pestaneo.reverse()
  document.getElementById("ultima_fatiga_reportes").innerHTML = fatiga_ultima;
  document.getElementById("total_fatiga_reportes").innerHTML = fatiga_total;

  var fatiga_mes = {
      series: [{
      name: 'Pestañeo promedio por sesión',
      data: arr_pestaneo
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
      categories: ["1", "2", "3", "4", "5", "6", "7","8", "9", "10"] ,
      title:{
        text:"NÚMERO DE SESIÓN",
        color:"rgba(0, 91, 82, 1)",
        display:true,
        offsetY:90,
        style:{
          color:"rgba(0, 91, 82, 1)"
        }
        
        //cssClass:"padding-top:20px;",
      }
        
    },
    yaxis: [{
      decimalsInFloat: 0,
      title:{
        text:"PESTAÑEO PROMEDIO POR HORA",
        display:true,
        offsetX:-5,
        style:{
          color:"rgba(0, 91, 82, 1)"
        }
        
       
        
        //cssClass:"color:green",
      }
    }],
    
    annotations: {
      yaxis: [{
        decimalsInFloat: 0,
      }]
    },      
    };

    var chart_fatm = new ApexCharts(document.querySelector("#chart_fatm"), fatiga_mes);
    chart_fatm.render();

}

window.onload = update_fatiga_visual