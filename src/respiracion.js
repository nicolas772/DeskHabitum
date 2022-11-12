let ID_USER = window.api.get_user_id("")

const container = document.getElementById('container');
const text = document.getElementById('text');
/*
const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2; //3s
const holdTime = totalTime / 5; //1.5s

*/
/*
const totalTime = 14000;  
const breatheTime = 7000;  //para 7seg inhalacion 2 mantencion 5 exhalacion
const holdTime = 2000; 
*/
const totalTime = 16000; 
const breatheTime = 9000; //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg de delay para empezar)
const holdTime = 2000; 

breathAnimation();

function breathAnimation() {
  text.innerText = 'INHALA';
  container.className = 'container grow';

  setTimeout(() => {
    text.innerText = 'MANTÉN';
    container.className = 'container hold';

    setTimeout(() => {
      text.innerText = 'EXHALA';
      container.className = 'container shrink2';
    }, holdTime);
  }, breatheTime);
}

setInterval(breathAnimation, totalTime);
Footer