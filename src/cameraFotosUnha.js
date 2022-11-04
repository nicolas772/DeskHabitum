const fs = require('fs');
const {contextBridge, ipcRenderer} = require("electron");
const tmImage = require('@teachablemachine/image');
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
let camara, photoData
let corriendo = true;

modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;


function distancia_puntos3D(x1, y1, z1, x2, y2, z2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) ** 0.5
}

function magnitud(punto){
    return ((punto.x) ** 2 + (punto.y) ** 2 + (punto.z) ** 2) ** 0.5
}

function mano_abierta(pulgar, indice, medio, anular, meñique, muñeca){


    coef_pulgar = 1.52
    coef_indice = 1.48
    coef_medio = 1.48
    coef_anular = 1.48
    coef_meñique = 1.38
    coef_horizontal = 1.1
    
    magnitud_pulgar = magnitud(pulgar) 
    magnitud_indice = magnitud(indice)
    magnitud_medio = magnitud(medio)
    magnitud_anular = magnitud(anular)
    magnitud_meñique = magnitud(meñique)
    magnitud_muñeca = magnitud(muñeca)

    pulgar_muñeca = distancia_puntos3D(pulgar.x / magnitud_pulgar, pulgar.y / magnitud_pulgar, pulgar.z / magnitud_pulgar, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    indice_muñeca = distancia_puntos3D(indice.x / magnitud_indice , indice.y / magnitud_indice, indice.z / magnitud_indice, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    medio_muñeca = distancia_puntos3D(medio.x / magnitud_medio, medio.y / magnitud_medio, medio.z / magnitud_medio, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
    
    anular_muñeca = distancia_puntos3D(anular.x / magnitud_anular, anular.y / magnitud_anular, anular.z / magnitud_anular, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)
   
    meñique_muñeca = distancia_puntos3D(meñique.x / magnitud_meñique, meñique.y / magnitud_meñique, meñique.z / magnitud_meñique, muñeca.x / magnitud_muñeca, muñeca.y / magnitud_muñeca, muñeca.z / magnitud_muñeca)

    pulgar_meñique = distancia_puntos3D(pulgar.x / magnitud_pulgar, pulgar.y / magnitud_pulgar, pulgar.z / magnitud_pulgar, meñique.x / magnitud_meñique, meñique.y / magnitud_meñique, meñique.z / magnitud_meñique)

    
    console.log("pulgar_muñeca:",pulgar_muñeca)
    console.log("indice_muñeca:", indice_muñeca)
    console.log("medio_muñeca:", medio_muñeca)
    console.log("anular_muñeca:", anular_muñeca)
    console.log("meñique_muñeca:", meñique_muñeca)
    console.log("pulgar_meñique:", pulgar_meñique) 


    if (pulgar_muñeca >= coef_pulgar && indice_muñeca >= coef_indice && medio_muñeca >= coef_medio && anular_muñeca >= coef_anular && meñique_muñeca >= coef_meñique && pulgar_meñique >= coef_horizontal){

        console.log("MANO ABIERTA")
        return true
    }

    return false

}

async function init_camera() {
    const flip = false;
    const width = 448;
    const height = 448;
    camara = new tmImage.Webcam(width, height, flip);

    await camara.setup(); // request access to the camara
    camara.play();
    document.getElementById("HOLA").appendChild(camara.canvas);

    setTimeout (function(){window.requestAnimationFrame(loop)}, 5000);
    detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});
}

async function loop() {
    camara.update(); // update the webcam frame
    await predict();
    if (!corriendo){
        camara.stop()
        document.getElementById("HOLA").innerHTML = "";
        return
    }
    window.setTimeout(loop, 0.1)
}

async function predict(){

    let posesHand;

    posesHand = await detectorHand.estimateHands(camara.canvas);

    if (posesHand.length == 2){

        //Mano 1
        tipPulgar3D = posesHand[0].keypoints3D[4]

        tipIndice3D = posesHand[0].keypoints3D[8]

        tipMedio3D = posesHand[0].keypoints3D[12]

        tipAnular3D = posesHand[0].keypoints3D[16]

        tipMenique3D = posesHand[0].keypoints3D[20]
        
        muñeca3D = posesHand[0].keypoints3D[0]

        //Mano 2
        tipPulgar2_3D = posesHand[1].keypoints3D[4]

        tipIndice2_3D = posesHand[1].keypoints3D[8]

        tipMedio2_3D = posesHand[1].keypoints3D[12]

        tipAnular2_3D = posesHand[1].keypoints3D[16]

        tipMenique2_3D = posesHand[1].keypoints3D[20]

        muñeca2_3D = posesHand[1].keypoints3D[0]


        if(tipIndice3D.z >= 0 && tipIndice2_3D.z >= 0 && mano_abierta(tipPulgar3D, tipIndice3D, tipMedio3D, tipAnular3D, tipMenique3D, muñeca3D) && mano_abierta(tipPulgar2_3D, tipIndice2_3D, tipMedio2_3D, tipAnular2_3D, tipMenique2_3D, muñeca2_3D)){
            takePhoto();
            corriendo = false;
        }
    }
}


contextBridge.exposeInMainWorld("api3", {
    takePhoto: takePhoto
})

// Load init
window.onload = init_camera();

function takePhoto () {
    //camara.pause();
    var context = camara.canvas.getContext('2d');
    camara.canvas.width = 448;
    camara.canvas.height = 320;
    context.drawImage(camara.webcam, 0, 0, 448, 320);
    let foto = camara.canvas.toDataURL(); //Esta es la foto, en base 64

    let enlace = document.createElement('a'); // Crear un <a>
    //enlace.setAttribute("diplay", "none");
    enlace.download = "foto_parzibyte.me.png";
    enlace.href = foto;
    enlace.click();
    //camara.play();
}