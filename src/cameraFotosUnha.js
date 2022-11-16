const fs = require('fs');
const crud = require('./model/model.js')
const {contextBridge, ipcRenderer} = require("electron");
const tmImage = require('@teachablemachine/image');
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
let camara, photoData, config_user
let corriendo = true;
let elem;
modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function distancia_puntos3D(x1, y1, z1, x2, y2, z2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) ** 0.5
}

function distancia_puntos(x1, y1, x2, y2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function magnitud(punto){
    return ((punto.x) ** 2 + (punto.y) ** 2 + (punto.z) ** 2) ** 0.5
}


function mano_abierta(pulgar, indice, medio, anular, meñique, muñeca){


    coef_pulgar = 1.4
    coef_indice = 1.4
    coef_medio = 1.4
    coef_anular = 1.4
    coef_meñique = 1.35
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
    
    //Sin normalizar
    /*
    pulgar_muñeca = distancia_puntos3D(pulgar.x , pulgar.y,  pulgar.z , muñeca.x , muñeca.y , muñeca.z )
    
    indice_muñeca = distancia_puntos3D(indice.x, indice.y , indice.z , muñeca.x , muñeca.y , muñeca.z )
    
    medio_muñeca = distancia_puntos3D(medio.x , medio.y , medio.z , muñeca.x , muñeca.y , muñeca.z )
    
    anular_muñeca = distancia_puntos3D(anular.x , anular.y , anular.z , muñeca.x , muñeca.y , muñeca.z )
   
    meñique_muñeca = distancia_puntos3D(meñique.x , meñique.y , meñique.z , muñeca.x , muñeca.y, muñeca.z )

    pulgar_meñique = distancia_puntos3D(pulgar.x , pulgar.y , pulgar.z , meñique.x , meñique.y , meñique.z )
    */
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
    const flip = true;
    const width = 448;
    const height = 448;
    camara = new tmImage.Webcam(width, height, flip);

    await camara.setup(); // request access to the camara
    camara.play();
    elem = document.createElement("img");
    elem.src = "../images/sombra448.png";
    document.getElementById("webcam").appendChild(camara.canvas);
    
    


    setTimeout (function(){window.requestAnimationFrame(loop)}, 5000);
    detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});
    
}

async function loop() {
    camara.update(); // update the webcam frame
    await predict();
    if (!corriendo){
        camara.stop()
        document.getElementById("webcam").innerHTML = "";
        return
    }
    window.setTimeout(loop, 0.1)
}

async function predict(){

    let posesHand;
    document.getElementById("sombra").appendChild(elem);
    posesHand = await detectorHand.estimateHands(camara.canvas);

    if (posesHand.length == 2){

        ref_tipMedio= {"x": 160, "y": 67};
        ref_muñeca = {"x": 106, "y": 398};
        ref_tipMedio2 = {"x": 288 , "y": 68};
        ref_muñeca2 = {"x": 341 , "y": 398};

        radio = 50        

        //Mano 1
        tipPulgar3D = posesHand[0].keypoints3D[4]

        tipIndice3D = posesHand[0].keypoints3D[8]

        tipMedio3D = posesHand[0].keypoints3D[12]

        tipMedio = posesHand[0].keypoints[12]

        tipAnular3D = posesHand[0].keypoints3D[16]

        tipMenique3D = posesHand[0].keypoints3D[20]
        
        muñeca3D = posesHand[0].keypoints3D[0]

        muñeca = posesHand[0].keypoints[0]

        //Mano 2
        tipPulgar2_3D = posesHand[1].keypoints3D[4]

        tipIndice2_3D = posesHand[1].keypoints3D[8]

        tipMedio2_3D = posesHand[1].keypoints3D[12]

        tipMedio2 = posesHand[1].keypoints[12]

        tipAnular2_3D = posesHand[1].keypoints3D[16]

        tipMenique2_3D = posesHand[1].keypoints3D[20]

        muñeca2_3D = posesHand[1].keypoints3D[0]
        
        muñeca2 = posesHand[1].keypoints[0]

         
        pos_tip = distancia_puntos(tipMedio.x, tipMedio.y, ref_tipMedio.x, ref_tipMedio.y)
        pos_muñeca = distancia_puntos(muñeca.x, muñeca.y, ref_muñeca.x, ref_muñeca.y)
        pos_tip2 = distancia_puntos(tipMedio2.x, tipMedio2.y, ref_tipMedio2.x, ref_tipMedio2.y)
        pos_muñeca2 = distancia_puntos(muñeca2.x, muñeca2.y, ref_muñeca2.x, ref_muñeca2.y)


        pos_tip_invertido = distancia_puntos(tipMedio2.x, tipMedio2.y, ref_tipMedio.x, ref_tipMedio.y)
        pos_muñeca_invertida = distancia_puntos(muñeca2.x, muñeca2.y, ref_muñeca.x, ref_muñeca.y)
        pos_tip_invertido2 = distancia_puntos(tipMedio.x, tipMedio.y, ref_tipMedio2.x, ref_tipMedio2.y)
        pos_muñeca_invertida2 = distancia_puntos(muñeca.x, muñeca.y, ref_muñeca2.x, ref_muñeca2.y)

        
        if(tipIndice3D.z >= 0 && tipIndice2_3D.z >= 0 && 
            mano_abierta(tipPulgar3D, tipIndice3D, tipMedio3D, tipAnular3D, tipMenique3D, muñeca3D) &&
            mano_abierta(tipPulgar2_3D, tipIndice2_3D, tipMedio2_3D, tipAnular2_3D, tipMenique2_3D, muñeca2_3D) && 
            ((pos_tip < radio && pos_muñeca < radio && pos_tip2 < radio && pos_muñeca2 <= radio) || 
            (pos_tip_invertido < radio && pos_muñeca_invertida < radio && pos_tip_invertido2 < radio && pos_muñeca_invertida2 <= radio))){
                takePhoto2();
                corriendo = false;
        }
    }
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

function takePhoto2 () {
    var context = camara.canvas.getContext('2d');
    camara.canvas.width = 448;
    camara.canvas.height = 320;
    context.drawImage(camara.webcam, 0, 0, 448, 320);
    photoData = camara.canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    let fecha = new Date;
    let fech = fecha.toISOString()
    let fecha_nueva = fech.replace(/:/g, "!")
    let path_file = './src/images/unhasUser/'+fecha_nueva+'.png'
    savePhoto(path_file)
}

async function savePhoto (filePath) {
    if (filePath) {
      fs.writeFile(filePath, photoData, 'base64', (err) => {
        if (err) alert(`There was a problem saving the photo: ${err.message}`);
        photoData = null;
      });
    }
    corriendo = false;
    ID_USER = get_user_id()
    await crud.getConfig(ID_USER).then(result => {
        config_user = result[0];
    })
    ipcRenderer.invoke('camara-unha-off', config_user)
}

function get_user_id(){
    let respuesta = ipcRenderer.sendSync('get-user-id', "")
    return respuesta   
}
