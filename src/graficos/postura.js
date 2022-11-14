let ID_USER = window.api.get_user_id("")
//---------------GRAFICO-----------
const data = {
  datasets: [{
    label: 'Tiempos de mala postura detectados',
    data: [{
      x: 1,  //DEJAR ESTE DATO PARA ESTABLECER EL ALTO (Y), QUE (X)
      y: 60,
      r: 0
    },
    {
      x: 1,  //hay que sumar 1 a la sesión para que no quede en eje y
      y: 25, //minuto de la sesion en la que se detecto la mala postura
      r: 5 //tiempo en minutos que estuvo con mala postura
    }, 
    {
      x: 1,  //hay que sumar 1 a la sesión para que no quede en eje y
      y: 45, //minuto de la sesion en la que se detecto la mala postura
      r: 8 //tiempo en minutos que estuvo con mala postura
    }, 
    {
      x: 2,  //hay que sumar 1 a la sesión para que no quede en eje y
      y: 20, //minuto de la sesion en la que se detecto la mala postura
      r: 3 //tiempo en minutos que estuvo con mala postura
    }, {
      x: 3,
      y: 10,
      r: 5
    },
    {
      x: 10,  //DEJAR ESTE DATO PARA ESTABLECER EL ANCHO DE LAS 10 SESIONES 
      y: 5,
      r: 0
    }],
    backgroundColor: 'rgb(255, 99, 132)'
  }]
};


const ctx_p = document.getElementById('chart_postura').getContext('2d');

const chart_postura = new Chart(ctx_p, {
  label:'sesiones',
  type: 'bubble',
  data: data,
  options: {
    layout: {
      padding: 10
  },
    scales: {
      x: {
        title: {
          color: 'gray',
          display: true,
          text: 'NÚMERO DE SESIÓN'
        }
      },
      y:{
        title: {
          color: 'gray',
          display: true,
          text: 'MOMENTO DE DETECCIÓN [min]'
        }
      }
    }
  },
  yaxis:{
    decimalsInFloat: false,
  }
});

//----
const labels = ['Septiembre','Octubre','Noviembre'];
const data_posmes = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80],
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
  options: {
    layout: {
      padding: 10
  },
    scales: {
      x: {
        title: {
          color: 'gray',
          display: true,
          text: 'MES'
        }
      },
      y:{
        beginAtZero: true,
        title: {
          
          color: 'gray',
          display: true,
          text: 'CANTIDAD DE DETECCIONES'
        }
      }
    }
    
  },
});



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



/*
function init4(){
  update_dash_general()
  actualizarNavbar();
}
window.onload = init4;

*/