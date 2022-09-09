/*const electron = require('electron');
const dialog = electron.remote.dialog;
const fs = require('fs');
let photoData;
let video;*/

function initialize () {
    let btn = document.getElementById("prueba")

    btn.onclick = function(){
        console.log("prueba boton")
    }

    //camara
    /*video = window.document.querySelector('video');
    let errorCallback = (error) => {
        console.log(`There was an error connecting to the video stream: ${error.message}`);
    };

    window.navigator.webkitGetUserMedia({video: true}, (localMediaStream) => {
        video.src = window.URL.createObjectURL(localMediaStream);
    }, errorCallback);*/

}


window.onload = initialize;