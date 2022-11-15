let ID_USER = window.api.get_user_id("")
let date = new Date()
let mes_anterior_anterior = date.getMonth()-1, mes_anterior = date.getMonth(), mes_actual = date.getMonth()+1
let total_mes_anterior_anterior, total_mes_anterior, total_mes_actual

let tiempo_ultima_postura = 0, total_ultima_postura = 0
let top_10_mes_postura = [0,0,0,0,0,0,0,0,0,0], time_10_mes_postura = [0,0,0,0,0,0,0,0,0,0]

const monthNames = ["Enero", "Febrero", "Marzo", "Abrir", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

async function update_dash_postura() {
  await window.api.ultimaPostura(ID_USER).then(result => {
      total_ultima_postura = result
  });

  await window.api.ultimaTimePostura(ID_USER).then(result => {
    tiempo_ultima_postura = result
  });

  await window.api.data10Postura(ID_USER).then(result => {
    for (let index = 0; index < result.length; index++) {
      top_10_mes_postura[index] = parseInt(result[index]['cant_total_postura'])
      time_10_mes_postura[index] = parseInt(result[index]['time_postura'])      
    }
  });
  top_10_mes_postura.reverse()
  time_10_mes_postura.reverse()

  document.getElementById("total-ultima-postura").innerHTML = total_ultima_postura;
  document.getElementById("tiempo-ultima-postura").innerHTML = tiempo_ultima_postura;
  document.getElementById("tiempo-mes-postura").innerHTML = time_10_mes_postura.reduce((partialSum, a) => partialSum + a, 0);
  document.getElementById("total-mes-postura").innerHTML = top_10_mes_postura.reduce((partialSum, a) => partialSum + a, 0);



  //---------------GRAFICO-----------
  const data = {
    datasets: [{
      label: 'Tiempo de mala postura detectado',
      data: [{
        x: 1,  //DEJAR ESTE DATO PARA ESTABLECER EL ALTO (Y), QUE (X)
        y: 60,
        r: 0
      },
      {
        x: 1,  //hay que sumar 1 a la sesión para que no quede en eje y
        y: time_10_mes_postura[0], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[0] //tiempo en minutos que estuvo con mala postura
      }, 
      {
        x: 2,  //hay que sumar 1 a la sesión para que no quede en eje y
        y: time_10_mes_postura[1], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[1] //tiempo en minutos que estuvo con mala postura
      }, 
      {
        x: 3,  //hay que sumar 1 a la sesión para que no quede en eje y
        y: time_10_mes_postura[2], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[2]  //tiempo en minutos que estuvo con mala postura
      }, {
        x: 4,
        y: time_10_mes_postura[3], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[3] 
      },
      {
        x: 5,
        y: time_10_mes_postura[4], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[4] 
      },
      {
        x: 6,
        y: time_10_mes_postura[5], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[5] 
      },
      {
        x: 7,
        y: time_10_mes_postura[6], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[6] 
      },
      {
        x: 8,
        y: time_10_mes_postura[7], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[7] 
      },
      {
        x: 9,
        y: time_10_mes_postura[8], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[8] 
      },
      {
        x: 10,
        y: time_10_mes_postura[9], //minuto de la sesion en la que se detecto la mala postura
        r: top_10_mes_postura[9]
      },
      {
        x: 11,  //DEJAR ESTE DATO PARA ESTABLECER EL ANCHO DE LAS 10 SESIONES 
        y: 5,
        r: 0
      }],
      backgroundColor: 'rgb(58, 198, 143)'
    }]
  };

  await window.api.mesPostura(ID_USER,mes_anterior_anterior).then(result => {
    total_mes_anterior_anterior = parseInt(result)
  });
  await window.api.mesPostura(ID_USER,mes_anterior).then(result => {
    total_mes_anterior = parseInt(result)
  });
  await window.api.mesPostura(ID_USER,mes_actual).then(result => {
    total_mes_actual = parseInt(result)
  });

  document.getElementById("mes-ant-ant-postura").innerHTML = monthNames[mes_anterior_anterior-1]
  document.getElementById("mes-ant-postura").innerHTML = monthNames[mes_anterior-1]
  document.getElementById("mes-act-postura").innerHTML = monthNames[mes_actual-1]

  document.getElementById("total-mes-ant-ant-postura").innerHTML = total_mes_anterior_anterior;
  document.getElementById("total-mes-ant-postura").innerHTML = total_mes_anterior;
  document.getElementById("total-mes-act-postura").innerHTML = total_mes_actual;

  const ctx_p = document.getElementById('chart_postura').getContext('2d');

  const chart_postura = new Chart(ctx_p, {
    label:'sesiones',
    type: 'bubble',
    data: data,
    options: {
      plugins:{
        legend:{
          color:'green',
          backgroundColor:'green'
        }
      },
      scales:{

        x:{
          title:{
            color:"rgba(0, 91, 82, 1)",
            display:true,
            text:"NÚMERO DE SESIÓN",
            padding:5
          }
        },
        y:{
          title:{
            padding:10,
            color:"rgba(0, 91, 82, 1)",
            display:true,
            text:"MOMENTO DE DETECCIÓN [min]"
          }
        }
      }
      
    },
    yaxis:{
      decimalsInFloat: 0,
    }
  });



  //----
  const labels = [monthNames[mes_anterior_anterior-1],monthNames[mes_anterior-1],monthNames[mes_actual-1]];
  const data_posmes = {
    labels: labels,
    datasets: [{
      label: 'Cantidad de detecciones',
      data: [total_mes_anterior_anterior, total_mes_anterior, total_mes_actual],
      backgroundColor: [
        
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)'
      ],
      borderWidth: 1
    }]
    
  };

  const ctx_pmes = document.getElementById('chart_posturames').getContext('2d');
  const config_posmes = new Chart(ctx_pmes,{
    type: 'bar',
    data: data_posmes,
    yaxis:{
      decimalsInFloat: 0,
    },
    options: {
      scales: {
        x:{
          title:{
            color:"rgba(0, 91, 82, 1)",
            display:true,
            text:"MES"
          }
        },
        y:{
          title:{
            beginAtZero: true,
            color:"rgba(0, 91, 82, 1)",
            display:true,
            text:"CANTIDAD DE DETECCIONES",
            fontStyle:'bold',
            padding:10,
            decimalsInFloat:0
          }
        }
      }
    }
    
  });

}



//----





//---------------------------

//--cambiar 2-> postura

const tricorec2 = document.getElementById('tricorec2');
const tricomes2 = document.getElementById('tricomes2');

const checktricorec2 = document.getElementById('checktricorec2');
const checktricomes2 = document.getElementById('checktricomes2');

checktricorec2.addEventListener('click', function handleClick() {
  if (checktricorec2.checked) {
    tricorec2.style.display = 'block';
    tricomes2.style.display = 'none';
    tricorec2.style.visibility = 'visible';
    tricomes2.style.visibility = 'hidden';
    
  } else {
    tricorec2.style.display = 'none';
    tricorec2.style.visibility = 'hidden';
  }
});

checktricomes2.addEventListener('click', function handleClick() {
  if (checktricomes2.checked) {
    tricorec2.style.display = 'none';
    tricomes2.style.display = 'block';
    tricorec2.style.visibility = 'hidden';
    tricomes2.style.visibility = 'visible';
  } else {
    tricomes2.style.display = 'none';
    tricomes2.style.visibility = 'hidden';
  }
});




function init_postura(){
  update_dash_postura()

}

window.onload = init_postura;

