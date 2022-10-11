let id_grupo, code
let tiempo_total, tiempo_optimo, tiempo_unnas, tiempo_pelo, tiempo_morder, tiempo_vista, tiempo_postura, tiempo_manias
let tiempo_total_ant, tiempo_optimo_ant, tiempo_unnas_ant, tiempo_pelo_ant, tiempo_morder_ant, tiempo_vista_ant, tiempo_postura_ant, tiempo_manias_ant
let equipo_total_manias, equipo_total_vista, equipo_total_postura
let equipo_10_manias = [0,0,0,0,0,0,0,0,0,0], equipo_10_vista = [0,0,0,0,0,0,0,0,0,0], equipo_postura = [], aux = -1, aux2 = 0
let numero_participantes
let ID_LIDER = window.api.get_user_id("")
let date = new Date();
let mes_anterior = date.getMonth()
let mes_actual = date.getMonth()+1

const monthNames = ["Enero", "Febrero", "Marzo", "Abrir", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

async function update_dash_general_equipos() {
  await window.api.getCodeGrupo(ID_LIDER).then(result => {
    code = result
  })

  
  await window.api.tiempoGrupo(code, mes_actual).then(result => {
    tiempo_total = parseInt(result[0]['total_time'])
    tiempo_unnas = parseInt(result[0]['time_unnas'])
    tiempo_pelo = parseInt(result[0]['time_pelo'])
    tiempo_morder = parseInt(result[0]['time_morder'])
    tiempo_vista = parseInt(result[0]['time_vista'])
    //agregar en el futuro cuando se implemente la funcionalidad
    tiempo_postura = 20
    tiempo_optimo = tiempo_total - tiempo_unnas - tiempo_pelo - tiempo_morder - tiempo_vista - tiempo_postura

  })
  
  tiempo_manias = parseInt(((tiempo_unnas+tiempo_morder+tiempo_pelo)/tiempo_total)*100)
  tiempo_vista = parseInt((tiempo_vista/tiempo_total)*100)
  tiempo_optimo = parseInt((tiempo_optimo/tiempo_total)*100)


  var equipo_1 = {
      series: [tiempo_manias, tiempo_postura, tiempo_vista, tiempo_optimo],
      chart: {
      height: 180,
      width:380,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
          },
          value: {
            fontSize: '12px',
          },
          total: {
            show: true,
            label: monthNames[mes_actual-1],
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 
            }
          }
        }
      }
    },
    legend: {
      show:true,
      position: 'right',
      horizontalAlign: 'center',
      
    },
    
    labels: ['Manías Compulsivas', 'Postura', 'Fatiga Visual', 'Óptimo'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height:200,
        
            },
            legend: {
              show:true,
              position: 'bottom',
              verticalAlign: 'bottom',
              align:'left'
            }
          }
        }]
    };

  var chart_equipo1 = new ApexCharts(document.getElementById("chart_equipo1"), equipo_1);
  chart_equipo1.render();



  await window.api.tiempoGrupo(code, mes_anterior).then(result => {
    tiempo_total_ant = parseInt(result[0]['total_time'])
    tiempo_unnas_ant = parseInt(result[0]['time_unnas'])
    tiempo_pelo_ant = parseInt(result[0]['time_pelo'])
    tiempo_morder_ant = parseInt(result[0]['time_morder'])
    tiempo_vista_ant = parseInt(result[0]['time_vista'])
    //agregar en el futuro cuando se implemente la funcionalidad
    tiempo_postura_ant = 20 //%
    tiempo_optimo_ant = tiempo_total_ant - tiempo_unnas_ant - tiempo_pelo_ant - tiempo_morder_ant - tiempo_vista_ant - tiempo_postura_ant


  })

  tiempo_manias_ant = parseInt(((tiempo_unnas_ant+tiempo_morder_ant+tiempo_pelo_ant)/tiempo_total_ant)*100)
  tiempo_vista_ant = parseInt((tiempo_vista_ant/tiempo_total_ant)*100)
  tiempo_optimo_ant = parseInt((tiempo_optimo_ant/tiempo_total_ant)*100)

  //actualmente no hay datos del ems anterior para los usuarios de prueba
  var equipo_2 = {
    series: [44, 55, 67, 83],
    chart: {
    height: 180,
    width:380,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '14px',
        },
        value: {
          fontSize: '12px',
        },
        total: {
          show: true,
          label: monthNames[mes_actual-2],
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return 
          }
        }
      }
    }
  },
  legend: {
    show:true,
    position: 'right',
    
  },
  labels: ['Manías Compulsivas', 'Postura', 'Fatiga Visual', 'Óptimo'],
  };

  var chart_equipo2 = new ApexCharts(document.getElementById("chart_equipo2"), equipo_2);
  chart_equipo2.render();

  //DATOS PARA LOS SGTS GRAFICOS

  
  await window.api.getParticipantesGrupo(code).then(result => {
    numero_participantes = result.length
  })

  //let equipo_10_manias = [0,0,0,0,0,0,0,0,0,0], equipo_10_vista = [0,0,0,0,0,0,0,0,0,0], equipo_postura = [], aux = -1, aux2 = 0
  let datos;
  await window.api.top10Grupo(code, mes_actual).then(result => {
    datos = result
    aux = datos[0]['id_user']
    })
   

  for (let m = 0; m < numero_participantes; m++) {
    if (aux2>datos.length-1) {
      break
    }
    for (let i = 0; i < 11; i++) {
      if (aux2>datos.length-1) {
        break
      }

      if (aux != datos[aux2]['id_user']) {
        aux = datos[aux2]['id_user']
        break
     }
     
     equipo_10_vista[i] = equipo_10_vista[i] + datos[aux2]['cant_total_vista'] + datos[aux2]['cant_total_pestaneo']
     equipo_10_manias[i] = equipo_10_manias[i] + datos[aux2]['cant_total_unnas'] + datos[aux2]['cant_total_pelo'] + datos[aux2]['cant_total_morder']
     aux2 = aux2 + 1      
    }


  }
  equipo_10_manias.reverse()
  equipo_10_vista.reverse()
  

  //variables equipo_total_manias, equipo_total_vista, equipo_total_postura
  await window.api.totalesGrupo(code, mes_actual).then(result => {
    equipo_total_manias = parseInt(result[0]['total_unnas']) + parseInt(result[0]['total_pelo']) + parseInt(result[0]['total_morder'])
    equipo_total_vista = parseInt(result[0]['total_vista']) + parseInt(result[0]['total_pestaneo'])
    //agregar cuando se implemente
    equipo_total_postura = 0

  })

  //-----EQUIPO DASH MANIA

  manias_grupo(equipo_10_manias[0], equipo_total_manias)

  var equipo_manias = {
    
    series: [{
    name: 'Total',
    type: 'area',
    data: equipo_10_manias,
  }],

    chart: {
    height: 300,
    type: 'line',
    
  },
  stroke: {
    curve: 'smooth',
    colors:['#3AC68F'],
  },
  fill: {
    type:'solid',
    colors:['#89E5B6'],
    opacity: [0.35, 1],
  },
  colors:['#005B52'],
  labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Series A',
      },
    },
    
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if(typeof y !== "undefined") {
          return  y.toFixed(0) + " points";
        }
        return y;
      }
    }
  }
  };

  var chart_equipomanias1 = new ApexCharts(document.querySelector("#chart_equipomanias"), equipo_manias);
  chart_equipomanias1.render();





  //-----equipo dash fatiga visual

  vista_grupo(equipo_10_vista[0], equipo_total_vista)

  var equipo_fatiga1 = {
    
    series: [{
    name: 'Total',
    type: 'area',
    data: equipo_10_vista,
  }],

    chart: {
    height: 300,
    type: 'line',
    
  },
  stroke: {
    curve: 'smooth',
    colors:['#3AC68F'],
  },
  fill: {
    type:'solid',
    colors:['#89E5B6'],
    opacity: [0.35, 1],
  },
  colors:['#005B52'],
  labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Series A',
      },
    },
    
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if(typeof y !== "undefined") {
          return  y.toFixed(0) + " points";
        }
        return y;
      }
    }
  }
  };

  var chart_equipofatiga1= new ApexCharts(document.querySelector("#chart_equipofatiga1"), equipo_fatiga1);
  chart_equipofatiga1.render();

  var equipo_postura1 = {
    
    series: [{
    name: 'Total',
    type: 'area',
    data: [10, 10, 31, 47, 10, 43, 26, 41, 31, 47, 33],
  }],

    chart: {
    height: 300,
    type: 'line',
    
  },
  stroke: {
    curve: 'smooth',
    colors:['#3AC68F'],
  },
  fill: {
    type:'solid',
    colors:['#89E5B6'],
    opacity: [0.35, 1],
  },
  colors:['#005B52'],
  labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Series A',
      },
    },
    
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if(typeof y !== "undefined") {
          return  y.toFixed(0) + " points";
        }
        return y;
      }
    }
  }
  };

  var chart_equipopostura1= new ApexCharts(document.querySelector("#chart_equipopostura1"), equipo_postura1);
  chart_equipopostura1.render();
}


async function manias_grupo(total_equipo_sesion, total_equipo_mes){
    document.getElementById("ultima-sesion-unhas-grupo").innerHTML = total_equipo_sesion;
    document.getElementById("total-detecciones-unhas-grupo").innerHTML = total_equipo_mes;
}




async function vista_grupo(total_equipo_sesion, total_equipo_mes){
  document.getElementById("ultima-sesion-vista-grupo").innerHTML = total_equipo_sesion;
  document.getElementById("total-detecciones-vista-grupo").innerHTML = total_equipo_mes;
}


window.onload = update_dash_general_equipos;