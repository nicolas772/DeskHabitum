let ID_USER = window.api.get_user_id("")

const container = document.getElementById('container');
const text = document.getElementById('text');
/*
const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2; //3s
const holdTime = totalTime / 5; //1.5s

*/
const totalTime = 5000;
const breatheTime = 2000; //3s
const holdTime = 1000; //1.5s

breathAnimation();

function breathAnimation() {
  text.innerText = 'INHALA';
  container.className = 'container grow';

  setTimeout(() => {
    text.innerText = 'MANTÉN';

    setTimeout(() => {
      text.innerText = 'EXHALA';
      container.className = 'container shrink2';
    }, holdTime);
  }, breatheTime);
}

setInterval(breathAnimation, totalTime);
Footer