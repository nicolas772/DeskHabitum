let ID_USER = window.api.get_user_id("")

const container = document.getElementById('container');
const text = document.getElementById('text');
const start = document.getElementById('start-res');
const end = document.getElementById('end-res');

var r = document.querySelector(':root');

var totalTime = 14000; 
var breatheTime = 7000; //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg si agrego delaydelay para empezar)
var holdTime = 2000; 




window.onload=function(){
  if(localStorage.getItem('inha1')==null){
    totalTime = 14000; 
    breatheTime = 7000; //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg si agrego delaydelay para empezar)
    holdTime = 2000; 
    localStorage.setItem("inha1", 7);
    localStorage.setItem("exha1", 5);
    localStorage.setItem("mant1", 2);
    document.getElementById('duracionInhalacion').value = localStorage.getItem('inha1');
    document.getElementById('duracionExhalacion').value = localStorage.getItem('exha1') ;
    document.getElementById('duracionMantener1').value = localStorage.getItem('mant1');


    r.style.setProperty('--breath', localStorage.getItem('inha1') + 's');
    r.style.setProperty('--release', localStorage.getItem('exha1') + 's');
    r.style.setProperty('--hold', localStorage.getItem('mant1') + 's');

    localStorage.setItem("porcent1", 50);
    localStorage.setItem("porcent2", 64);
    localStorage.setItem("grado1", 180);
    localStorage.setItem("grado2", 232);


    r.style.setProperty('--circulo-resp', `conic-gradient(#55b7a4 0%,#4ca493 ${localStorage.getItem('porcent1')}%,#fff ${localStorage.getItem('porcent1')}%,#fff ${localStorage.getItem('porcent2')}%,#336d62 ${localStorage.getItem('porcent2')}%,#2a5b52 100%)`) 
  

    r.style.setProperty('--rotate1_from',`rotate(0deg)`);
    r.style.setProperty('--rotate1_to',`rotate(${localStorage.getItem('grado1')}deg)`);
    r.style.setProperty('--rotate2_from',`rotate(${localStorage.getItem('grado1')}deg)`);
    r.style.setProperty('--rotate2_to',`rotate(${localStorage.getItem('grado2')}deg)`);
    r.style.setProperty('--rotate3_from',`rotate(${localStorage.getItem('grado2')}deg)`);
    r.style.setProperty('--rotate3_to',`rotate(360deg)`);


  }
  else{
    document.getElementById('duracionInhalacion').value = localStorage.getItem('inha1');
    document.getElementById('duracionExhalacion').value = localStorage.getItem('exha1') ;
    document.getElementById('duracionMantener1').value = localStorage.getItem('mant1');
    totalTime = localStorage.getItem('totalTime'); 
    breatheTime =localStorage.getItem('breatheTime'); //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg si agrego delaydelay para empezar)
    holdTime = localStorage.getItem('holdTime'); 

    r.style.setProperty('--breath', localStorage.getItem('inha1') + 's');
    r.style.setProperty('--release', localStorage.getItem('exha1') + 's');
    r.style.setProperty('--hold', localStorage.getItem('mant1') + 's');


    r.style.setProperty('--circulo-resp', `conic-gradient(#55b7a4 0%,#4ca493 ${localStorage.getItem('porcent1')}%,#fff ${localStorage.getItem('porcent1')}%,#fff ${localStorage.getItem('porcent2')}%,#336d62 ${localStorage.getItem('porcent2')}%,#2a5b52 100%)`) 
  

    r.style.setProperty('--rotate1_from',`rotate(0deg)`);
    r.style.setProperty('--rotate1_to',`rotate(${localStorage.getItem('grado1')}deg)`);
    r.style.setProperty('--rotate2_from',`rotate(${localStorage.getItem('grado1')}deg)`);
    r.style.setProperty('--rotate2_to',`rotate(${localStorage.getItem('grado2')}deg)`);
    r.style.setProperty('--rotate3_from',`rotate(${localStorage.getItem('grado2')}deg)`);
    r.style.setProperty('--rotate3_to',`rotate(360deg)`);

  }
  
  

}



function changeBreath(){
  var inhalacion = document.getElementById('duracionInhalacion').value;
  var exhalacion = document.getElementById('duracionExhalacion').value;
  var mantener = document.getElementById('duracionMantener1').value;
  localStorage.setItem("inha1", inhalacion);
  localStorage.setItem("exha1", exhalacion);
  localStorage.setItem("mant1", mantener);

  var total = parseInt(inhalacion)+parseInt(exhalacion)+parseInt(mantener);
  localStorage.setItem("total",total);


  breatheTime = parseInt(inhalacion)*1000;
  totalTime = parseInt(total)*1000;
  holdTime = parseInt(mantener)*1000;
  //exhalTime= parseInt(exhalacion)*1000;
  
  localStorage.setItem("breatheTime",breatheTime);
  localStorage.setItem("totalTime",totalTime);
  localStorage.setItem("holdTime",holdTime);
  //localStorage.setItem("exhalTime",exhalTime);



 /* r.style.setProperty('--rotate1_to', "rotate(36deg)")*/
  r.style.setProperty('--breath', inhalacion + 's');
  r.style.setProperty('--release', exhalacion + 's');
  r.style.setProperty('--hold', mantener + 's');
 

  var porcent1 = (breatheTime/totalTime)*100;
  var porcent2 = porcent1 + ((holdTime/totalTime)*100);
  /*var porcent3 = porcent2 + ((exhalTime/totalTime)*100);*/

  var grado1 = porcent1*360/100;
  var grado2 = porcent2*360/100;

  localStorage.setItem("porcent1",porcent1);
  localStorage.setItem("porcent2",porcent2);
  localStorage.setItem("grado1",grado1);
  localStorage.setItem("grado2",grado2);
  

  r.style.setProperty('--circulo-resp', `conic-gradient(#55b7a4 0%,#4ca493 ${porcent1}%,#fff ${porcent1}%,#fff ${porcent2}%,#336d62 ${porcent2}%,#2a5b52 100%)`) 
  

  r.style.setProperty('--rotate1_from',`rotate(0deg)`);
  r.style.setProperty('--rotate1_to',`rotate(${grado1}deg)`);
  r.style.setProperty('--rotate2_from',`rotate(${grado1}deg)`);
  r.style.setProperty('--rotate2_to',`rotate(${grado2}deg)`);
  r.style.setProperty('--rotate3_from',`rotate(${grado2}deg)`);
  r.style.setProperty('--rotate3_to',`rotate(360deg)`);

  window.location.reload();
}


function breathAnimation() {

  
  
  
  
  console.log(timeleftinhal);


  
  text.innerText = 'INHALA';
  container.className = 'container grow';
  document.getElementById("end-res").style.display = "block";
  document.getElementById("start-res").style.display = "none";

  var timeleftinhal=(breatheTime/1000);
  var downloadTimer1 = setInterval(function(){
    timeleftinhal -= 1;
    text.innerText = 'INHALA ' + timeleftinhal + " s";
    if(timeleftinhal <= 0){
      clearInterval(downloadTimer1);
    } 
  }, 1000);

  
  setTimeout(() => {
    text.innerText = 'MANTÉN';
    container.className = 'container hold';

    
    var timelefthold=holdTime/1000;
    var downloadTimer2 = setInterval(function(){
      timelefthold -= 1;
      text.innerText = 'MANTÉN '+ timelefthold + " s";
      if(timelefthold <= 0){
        clearInterval(downloadTimer2);
      } 
    }, 1000);
    

    setTimeout(() => {
      text.innerText = 'EXHALA';
      container.className = 'container shrink2';

      var timeleftexhal=(totalTime-breatheTime-holdTime)/1000;
      var downloadTimer3 = setInterval(function(){
        timeleftexhal -= 1;
        text.innerText = 'EXHALA ' + timeleftexhal + " s";
        if(timeleftexhal <= 0){
          clearInterval(downloadTimer3);
        } 
      }, 1000);

      


    }, holdTime);
  }, breatheTime);

  setInterval(breathAnimation, totalTime);
  /*Footer*/
}

function endbreathAnimation(){
  window.location.reload();
  
}


window.onbeforeunload = () => {
  
  
  localStorage.setItem("inha1", localStorage.getItem('inha1'));
  localStorage.setItem("exha1", localStorage.getItem('exha1'));
  localStorage.setItem("mant1", localStorage.getItem('mant1'));
  localStorage.setItem("breatheTime",localStorage.getItem('breatheTime'));
  localStorage.setItem("totalTime",localStorage.getItem('totalTime'));
  localStorage.setItem("holdTime",localStorage.getItem('holdTime'));
  localStorage.setItem("porcent1",localStorage.getItem("porcent1"));
  localStorage.setItem("porcent2",localStorage.getItem("porcent2"));
  localStorage.setItem("grado1",localStorage.getItem("grado1"));
  localStorage.setItem("grado2",localStorage.getItem("grado2"));
  //localStorage.removeItem("inha1");//para probar primera vez que el usuario usa app, es decir con localstorage vacio.
  /*sessionStorage.clear();*/
}