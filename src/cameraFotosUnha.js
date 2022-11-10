const fs = require('fs');
const {contextBridge, ipcRenderer} = require("electron");
const tmImage = require('@teachablemachine/image');
let camara, photoData


async function init_camera() {
    let flip = true;
    let width = 400;
    let height = 400;
    camara = new tmImage.Webcam(width, height, flip);
    await camara.setup(); // request access to the webcam
    camara.play();
    document.getElementById("HOLA").appendChild(camara.canvas);
    setTimeout (function(){window.requestAnimationFrame(loop)}, 5000);
}

async function loop() {
    camara.update(); // update the webcam frame
    /*if (!corriendo){
        webcam.stop()
        document.getElementById("HOLA").innerHTML = "";
        return
    }*/
    window.setTimeout(loop, 0.1)
}

contextBridge.exposeInMainWorld("api3", {
    takePhoto: takePhoto,
    takePhoto2: takePhoto2
})

// Load init
window.onload = init_camera();

function takePhoto () {
    //camara.pause();
    var context = camara.canvas.getContext('2d');
    camara.canvas.width = 400;
    camara.canvas.height = 400;
    context.drawImage(camara.webcam, 0, 0, 600, 400);
    let foto = camara.canvas.toDataURL(); //Esta es la foto, en base 64

    let enlace = document.createElement('a'); // Crear un <a>
    //enlace.setAttribute("diplay", "none");
    enlace.download = "foto_parzibyte.me.png";
    enlace.href = foto;
    enlace.click();
    //camara.play();
}

function takePhoto2 () {
    var context = camara.canvas.getContext('2d');
    camara.canvas.width = 400;
    camara.canvas.height = 400;
    context.drawImage(camara.webcam, 0, 0, 600, 400);
    photoData = camara.canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    let fecha = new Date;
    let fech = fecha.toISOString()
    let path_file = './src/images/unhasUser/'+fech+'.png'
    savePhoto(path_file)
}

function savePhoto (filePath) {
    if (filePath) {
      fs.writeFile(filePath, photoData, 'base64', (err) => {
        if (err) alert(`There was a problem saving the photo: ${err.message}`);
        photoData = null;
      });
    }
}