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
  options: {},
  yaxis:{
    decimalsInFloat: false,
  }
});
/*
const chart_postura = new Chart(ctx_p, {
type: 'bar',
        data: {
            labels: ['Peor sesión', 'Última sesión', 'Mejor sesión'],
            datasets: [{
                label: 'Cantidad de detecciones',
                data: [5, 2, 3],// data: [parseInt(peor_ses_obj), parseInt(ultima_ses_morder),parseInt(mejor_ses_obj)]
                backgroundColor: [
                  'rgba(58, 198, 143, 0.2)', //'rgba(255, 205, 86, 0.2)'
                  'rgba(58, 198, 143, 0.2)', //'rgba(75, 192, 192, 0.2)'
                  'rgba(58, 198, 143, 0.2)' //'rrgba(255, 99, 132, 0.2)' 
                ],
                borderColor: [
                    'rgb(0, 91, 82)', //'rgb(255, 205, 86)'
                    'rgb(0, 91, 82)', //'rgb(75, 192, 192)'
                    'rgb(0, 91, 82)' //'rgb(255, 99, 132)'
                ],
                borderWidth: 1,
                yaxis:{
                  decimalsInFloat: false,
                }
            }]
        }
       
    });
  


*/



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