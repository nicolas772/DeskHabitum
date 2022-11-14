let ID_USER = window.api.get_user_id("")

const container = document.getElementById('container');
const text = document.getElementById('text');
const start = document.getElementById('start-res');
const end = document.getElementById('end-res');

var r = document.querySelector(':root');

var totalTime = 14000; 
var breatheTime = 7000; //para 10seg inhalacion 2 mantencion 5 exhalacion (al 7seg se le suman 3seg si agrego delaydelay para empezar)
var holdTime = 2000; 


/*------INICIO Musica */
let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img : 'images/stay.png',
        name : 'Stay',
        artist : 'The Kid LAROI, Justin Bieber',
        music : 'music/stay.mp3'
    },
    {
        img : 'images/fallingdown.jpg',
        name : 'Falling Down',
        artist : 'Wid Cards',
        music : 'music/fallingdown.mp3'
    },
    {
        img : 'images/faded.png',
        name : 'Faded',
        artist : 'Alan Walker',
        music : 'music/Faded.mp3'
    },
    {
        img : 'images/ratherbe.jpg',
        name : 'Rather Be',
        artist : 'Clean Bandit',
        music : 'music/Rather Be.mp3'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    random_bg_color();
}

function random_bg_color(){
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a){
        for(let i=0; i<6; i++){
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

   /* let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";*/
   let gradient = 'linear-gradient(' + 0 + ',' + 0 + ', ' + 0 + ")";
    document.body.style.background = gradient;
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationMinutes;
    }
}



/*------FIN MUSICA */

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

  
  
  
  


  
  text.innerText = 'INHALA' + " ... " + (breatheTime/1000) + " s";
  container.className = 'container grow';
  document.getElementById("end-res").style.display = "block";
  document.getElementById("start-res").style.display = "none";

  var timeleftinhal=(breatheTime/1000);
  var downloadTimer1 = setInterval(function(){
    timeleftinhal -= 1;
    text.innerText = 'INHALA ' + " ... " + timeleftinhal + " s";
    if(timeleftinhal <= 0){
      clearInterval(downloadTimer1);
    } 
  }, 1000);

  
  setTimeout(() => {
    text.innerText = 'MANTÉN' +" ... "+ (holdTime/1000) + " s";
    container.className = 'container hold';

    
    var timelefthold=holdTime/1000;
    var downloadTimer2 = setInterval(function(){
      timelefthold -= 1;
      text.innerText = 'MANTÉN '+ ' ... '+timelefthold + " s";
      if(timelefthold <= 0){
        clearInterval(downloadTimer2);
      } 
    }, 1000);
    

    setTimeout(() => {
      text.innerText = 'EXHALA' + " ... "+((totalTime-breatheTime-holdTime)/1000) + " s";
      container.className = 'container shrink2';

      var timeleftexhal=(totalTime-breatheTime-holdTime)/1000;
      var downloadTimer3 = setInterval(function(){
        timeleftexhal -= 1;
        text.innerText = 'EXHALA '+ " ... " + timeleftexhal + " s";
        if(timeleftexhal <= 1){
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


function tecnica_square(){
  document.getElementById('duracionInhalacion').value = 4;
  document.getElementById('duracionExhalacion').value= 4;
  mantener = document.getElementById('duracionMantener1').value=4;

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

function tecnica_pranayama(){
  document.getElementById('duracionInhalacion').value = 7;
  document.getElementById('duracionExhalacion').value= 8;
  mantener = document.getElementById('duracionMantener1').value=4;

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

function tecnica_ujjayi(){
  document.getElementById('duracionInhalacion').value = 7;
  document.getElementById('duracionExhalacion').value= 7;
  mantener = document.getElementById('duracionMantener1').value=0;

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

