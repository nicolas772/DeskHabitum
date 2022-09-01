const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
const poseDetection = require('@tensorflow-models/pose-detection');

//Variables para la ejecución de la webcam y modelo
let modeloHand,modeloBlaze, webcam,webcam2,detectorHand ,detectorBlaze;
//Variable para emplear un cooldown entre notificaciones
let corriendo = false;
console.log("AJSDIAKFKSJDKDSFJSDJK")

async function init_model_hand() {
    if (!corriendo){
        corriendo = true;
        
        modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;
        detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});

        modeloBlaze = poseDetection.SupportedModels.BlazePose;
        detectorBlaze = await poseDetection.createDetector(modeloBlaze, {runtime : 'tfjs', modelType : 'full'});

        const flip = true;
        const width = 200;
        const height = 200;
        webcam = new tmImage.Webcam(width, height, flip);

        await webcam.setup(); // request access to the webcam
        webcam.play();
        console.log("SE INICIO LA CAMARA")
        //document.getElementById("HOLA").appendChild(webcam.canvas);

        window.requestAnimationFrame(loop);
    }
}

function stop_monitoring_hand(){
    if (corriendo == true){
        corriendo = false;
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    if (!corriendo){
        webcam.stop()
        return
    }
    // PROBAR AQUÍ LO DEL SEGUNDO PLANO
    //https://stackoverflow.com/questions/60550376/tensorflowjs-perform-inference-in-an-inactive-tab

    //window.requestAnimationFrame(loop);
    window.setTimeout(loop, 0.1)
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    let posesHand, posesBlaze, centroX, centroY, radio;
    posesHand = await detectorHand.estimateHands(webcam.canvas);
    posesBlaze = await detectorBlaze.estimatePoses(webcam.canvas);
    
    if (posesBlaze.length != 0){
        boca1 = posesBlaze[0].keypoints[9]
        boca2 = posesBlaze[0].keypoints[10]
    
        centroX = (boca1.x + boca2.x) / 2.0
        centroY = (boca1.y + boca2.y) / 2.0
        radio = 10
    }


    
    
    //Solo se detecta una mano
    if (posesHand.length == 1){
        
        dipPulgar = posesHand[0].keypoints[3]
        dipIndice = posesHand[0].keypoints[7]
        dipMedio = posesHand[0].keypoints[11]
        dipAnular = posesHand[0].keypoints[15]
        dipMenique = posesHand[0].keypoints[19]


        tipPulgar = posesHand[0].keypoints[4]
        tipIndice = posesHand[0].keypoints[8]
        tipMedio = posesHand[0].keypoints[12]
        tipAnular = posesHand[0].keypoints[16]
        tipMenique = posesHand[0].keypoints[20]

        
        if ( tipPulgar.y > dipPulgar.y || tipIndice.y > dipIndice.y || tipMedio.y > dipMedio.y ||tipAnular.y > dipAnular.y || tipMenique.y > dipMenique.y){
            if ((tipPulgar.x <= centroX + radio && tipPulgar.y <= centroY + radio) || (tipIndice.x <= centroX + radio && tipIndice.y <= centroY + radio)||(tipMedio.x <= centroX + radio && tipMedio.y <= centroY + radio) ||(tipAnular.x <= centroX + radio && tipAnular.y <= centroY + radio) ||(tipMenique.x <= centroX + radio && tipMenique.y <= centroY + radio) ){
                console.log("COMIENDO UÑAS CTM");
            }
            
        }

    //Falta implementar lo mismo de antes pero para ambos casos
    }else if (posesHand.length == 2){
        console.log("2 manos");

    //No se detectan manos 
    }else{

        console.log("no hay manos");

    }

}



module.exports = { init_model_hand , stop_monitoring_hand}