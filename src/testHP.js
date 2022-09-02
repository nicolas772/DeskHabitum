const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
const poseDetection = require('@tensorflow-models/pose-detection');

//Variables para la ejecución de la webcam y modelo
let modeloHand,modeloBlaze, webcam,webcam2,detectorHand ,detectorBlaze;
//Variable para emplear un cooldown entre notificaciones
let corriendo = false;

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
        document.getElementById("HOLA").appendChild(webcam.canvas);

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
        boca13D = posesBlaze[0].keypoints3D[9]
        boca23D = posesBlaze[0].keypoints3D[10]
    
        centroX = (boca1.x + boca2.x) / 2.0
        centroY = (boca1.y + boca2.y) / 2.0
        centroZ = (boca13D.z + boca23D.z) / 2.0 
        coef = 10

        radioXUp = centroX + coef
        radioXLow = centroX - coef

        radioYUp = centroY - coef
        radioYLow = centroY + coef
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
            if ((tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow) || (tipIndice.x <= radioXUp && tipIndice.x >= radioXLow && tipIndice.y >= radioYUp && tipIndice.y <= radioYLow)||(tipMedio.x <= radioXUp && tipMedio.x >= radioXLow && tipMedio.y >= radioYUp && tipMedio.y <= radioYLow) ||(tipAnular.x <= radioXUp && tipAnular.x >= radioXLow && tipAnular.y >= radioYUp && tipAnular.y <= radioYLow) ||(tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow) ){
                console.log("¡¡COMIENDO UÑAS!!");
            }
            
        }

    //Falta implementar lo mismo de antes pero para ambos casos
    }else if (posesHand.length == 2){



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


        dipPulgar2 = posesHand[1].keypoints[3]
        dipIndice2 = posesHand[1].keypoints[7]
        dipMedio2 = posesHand[1].keypoints[11]
        dipAnular2 = posesHand[1].keypoints[15]
        dipMenique2 = posesHand[1].keypoints[19]

        tipPulgar2 = posesHand[1].keypoints[4]
        tipIndice2 = posesHand[1].keypoints[8]
        tipMedio2 = posesHand[1].keypoints[12]
        tipAnular2 = posesHand[1].keypoints[16]
        tipMenique2 = posesHand[1].keypoints[20]


        
        if ( tipPulgar.y > dipPulgar.y || tipIndice.y > dipIndice.y || tipMedio.y > dipMedio.y ||tipAnular.y > dipAnular.y || tipMenique.y > dipMenique.y){
            if ((tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow) || (tipIndice.x <= radioXUp && tipIndice.x >= radioXLow && tipIndice.y >= radioYUp && tipIndice.y <= radioYLow)||(tipMedio.x <= radioXUp && tipMedio.x >= radioXLow && tipMedio.y >= radioYUp && tipMedio.y <= radioYLow) ||(tipAnular.x <= radioXUp && tipAnular.x >= radioXLow && tipAnular.y >= radioYUp && tipAnular.y <= radioYLow) ||(tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow) ){
                console.log("¡¡COMIENDO UÑAS!!");
            }
            
        }
        else if ( tipPulgar2.y > dipPulgar2.y || tipIndice2.y > dipIndice2.y || tipMedio2.y > dipMedio2.y ||tipAnular2.y > dipAnular2.y || tipMenique2.y > dipMenique2.y){
            if ((tipPulgar2.x <= radioXUp && tipPulgar2.x >= radioXLow && tipPulgar2.y >= radioYUp && tipPulgar2.y <= radioYLow) || (tipIndice2.x <= radioXUp && tipIndice2.x >= radioXLow && tipIndice2.y >= radioYUp && tipIndice2.y <= radioYLow)||(tipMedio2.x <= radioXUp && tipMedio2.x >= radioXLow && tipMedio2.y >= radioYUp && tipMedio2.y <= radioYLow) ||(tipAnular2.x <= radioXUp && tipAnular2.x >= radioXLow && tipAnular2.y >= radioYUp && tipAnular2.y <= radioYLow) ||(tipMenique2.x <= radioXUp && tipMenique2.x >= radioXLow && tipMenique2.y >= radioYUp && tipMenique2.y <= radioYLow) ){
                console.log("¡¡COMIENDO UÑAS!!");
            }
            
        }

    //No se detectan manos 
    }else{

        console.log("No se detectan manos");

    }

}



module.exports = { init_model_hand , stop_monitoring_hand}