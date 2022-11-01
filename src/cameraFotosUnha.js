/*const electron = require('electron');
const dialog = electron.remote.dialog;
const { dialog } = require('electron')
const fs = require('fs');
let photoData;
let video;*/
const tmImage = require('@teachablemachine/image');
let webcam

/*function savePhoto (filePath) {
  if (filePath) {
    fs.writeFile(filePath, photoData, 'base64', (err) => {
      if (err) alert(`There was a problem saving the photo: ${err.message}`);
      photoData = null;
    });
  }
}

function initialize () {
  video = window.document.querySelector('video');
  let errorCallback = (error) => {
    console.log(`There was an error connecting to the video stream: ${error.message}`);
  };

  window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
    video.src = window.URL.createObjectURL(localMediaStream);
  }, errorCallback);
}

function takePhoto () {
  let canvas = window.document.querySelector('canvas');
  canvas.getContext('2d').drawImage(video, 0, 0, 800, 600);
  photoData = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  dialog.showSaveDialog({
    title: "Save the photo",
    defaultPath: 'myfacebomb.png',
    buttonLabel: 'Save photo'
  }, savePhoto);
}*/

async function init_camera() {
    let flip = true;
    let width = 224;
    let height = 224;
    webcam = new tmImage.Webcam(width, height, flip);
    await webcam.setup(); // request access to the webcam
    webcam.play();
    document.getElementById("HOLA").appendChild(webcam.canvas);

    setTimeout (function(){window.requestAnimationFrame(loop)}, 5000);

}

async function loop() {
    webcam.update(); // update the webcam frame
    /*if (!corriendo){
        webcam.stop()
        document.getElementById("HOLA").innerHTML = "";
        return
    }*/
    window.setTimeout(loop, 0.1)
}

window.onload = init_camera();