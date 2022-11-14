let ID_USER = window.api.get_user_id("")

const container = document.getElementById('container');
const text = document.getElementById('text');
const start = document.getElementById('start-res');

var r = document.querySelector(':root');

/*
var totalTime = 14000; 
var breatheTime = 7000; //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg si agrego delaydelay para empezar)
var holdTime = 2000; 
*/

var inhalacion;
var exhalacion;
var mantener;

window.onload=function(){
  
  inhalacion = document.getElementById('duracionInhalacion').value;
  exhalacion = document.getElementById('duracionExhalacion').value;
  mantener = document.getElementById('duracionMantener1').value;
  localStorage.setItem("inha1", inhalacion);
  localStorage.setItem("exha1", exhalacion);
  localStorage.setItem("mant1", mantener);


}


function changeBreath(){
  inhalacion = document.getElementById('duracionInhalacion').value;
  exhalacion = document.getElementById('duracionExhalacion').value;
  mantener = document.getElementById('duracionMantener1').value;
  localStorage.setItem("inha1", inhalacion);
  localStorage.setItem("exha1", exhalacion);
  localStorage.setItem("mant1", mantener);
  var total = parseInt(inhalacion)+parseInt(exhalacion)+parseInt(mantener);

 
  

  breatheTime = parseInt(inhalacion)*1000;
  totalTime = parseInt(total)*1000;
  holdTime = parseInt(mantener)*1000;
  exhalTime= parseInt(exhalacion)*1000;
  


 /* r.style.setProperty('--rotate1_to', "rotate(36deg)")*/
  r.style.setProperty('--breath', inhalacion + 's');
  r.style.setProperty('--release', exhalacion + 's');
  r.style.setProperty('--hold', mantener + 's');
 

  var porcent1 = (breatheTime/totalTime)*100;
  var porcent2 = porcent1 + ((holdTime/totalTime)*100);
  /*var porcent3 = porcent2 + ((exhalTime/totalTime)*100);*/

  var grado1 = porcent1*360/100;
  var grado2 = porcent2*360/100;

  console.log(totalTime);
  console.log(breatheTime);
  console.log(holdTime);

  r.style.setProperty('--circulo-resp', `conic-gradient(#55b7a4 0%,#4ca493 ${porcent1}%,#fff ${porcent1}%,#fff ${porcent2}%,#336d62 ${porcent2}%,#2a5b52 100%)`) 
  

  r.style.setProperty('--rotate1_from',`rotate(0deg)`);
  r.style.setProperty('--rotate1_to',`rotate(${grado1}deg)`);
  r.style.setProperty('--rotate2_from',`rotate(${grado1}deg)`);
  r.style.setProperty('--rotate2_to',`rotate(${grado2}deg)`);
  r.style.setProperty('--rotate3_from',`rotate(${grado2}deg)`);
  r.style.setProperty('--rotate3_to',`rotate(360deg)`);




/*
  --rotate1_from: rotate(0deg);
  --rotate1_to: rotate(180deg);
  --rotate2_from: rotate(180deg);
  --rotate2_to: rotate(232deg);
  --rotate3_from: rotate(232deg);
  --rotate3_to: rotate(360deg);
*/

}




/*start.addEventListener("click",breathAnimation());*/

/*breathAnimation();*/

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

  setInterval(breathAnimation, totalTime);
  /*Footer*/
}
  


function endbreathAnimation(){
  window.location.reload();
  
}

window.onbeforeunload = () => {
  localStorage.setItem("inha1", 7);
  localStorage.setItem("exha1", 5);
  localStorage.setItem("mant1", 2);

}