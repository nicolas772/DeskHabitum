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
    let posesHand, posesBlaze, centroX, centroY;
    //https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
    posesHand = await detectorHand.estimateHands(webcam.canvas);
    //https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
    posesBlaze = await detectorBlaze.estimatePoses(webcam.canvas);

    
    //Los modelos estiman articulaciones
    if (posesBlaze.length != 0 && posesHand.length != 0 && (posesBlaze[0].keypoints3D[19].score >= 0.8 || posesBlaze[0].keypoints3D[20].score >= 0.8)){

        //Se consideran los puntos, del estimador BlazePose, que serán de utilidad. En este caso los dos puntos de la boca, en coordenadas (x,y) y (x,y,z). Y los puntos de los indices de la manos en 3d.
        bocaLeft = posesBlaze[0].keypoints[9]
        bocaRight = posesBlaze[0].keypoints[10]

        bocaLeft3D = posesBlaze[0].keypoints3D[9]
        bocaRight3D = posesBlaze[0].keypoints3D[10]

        //Se define el centro de la boca en base a las coordenadas estimadas
        centroX = (bocaLeft.x + bocaRight.x) / 2.0
        centroY = (bocaLeft.y + bocaRight.y) / 2.0

        //Se define un radio de detección desde el centro de la boca hasta el coef definido 
        coef = 10;

        radioXUp = centroX + coef
        radioXLow = centroX - coef

        radioYUp = centroY - coef
        radioYLow = centroY + coef

        //Se consideran las articulaciones interfalángicas distales de la mano detectada
        dipPulgar = posesHand[0].keypoints[3]
        dipIndice = posesHand[0].keypoints[7]
        dipMedio = posesHand[0].keypoints[11]
        dipAnular = posesHand[0].keypoints[15]
        dipMenique = posesHand[0].keypoints[19]

        //Tambien las puntas de los dedos
        tipPulgar = posesHand[0].keypoints[4]
        tipPulgar3D = posesHand[0].keypoints3D[4]

        tipIndice = posesHand[0].keypoints[8]
        tipIndice3D = posesHand[0].keypoints3D[8]

        tipMedio = posesHand[0].keypoints[12]
        tipMedio3D = posesHand[0].keypoints3D[12]

        tipAnular = posesHand[0].keypoints[16]
        tipAnular3D = posesHand[0].keypoints3D[16]

        tipMenique = posesHand[0].keypoints[20]
        tipMenique3D = posesHand[0].keypoints3D[20]
        

        if (tipPulgar.y > dipPulgar.y && tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow && tipPulgar3D.z > 0){
            console.log("Comiendo uña pulgar");
        }
        else if (tipIndice.y > dipIndice.y && tipIndice.x <= radioXUp && tipIndice.x >= radioXLow && tipIndice.y >= radioYUp && tipIndice.y <= radioYLow && tipIndice3D.z > 0){
            console.log("Comiendo uña indice");
        }
        else if (tipMedio.y > dipMedio.y && tipMedio.x <= radioXUp && tipMedio.x >= radioXLow && tipMedio.y >= radioYUp && tipMedio.y <= radioYLow && tipMedio3D.z > 0){
            console.log("Comiendo uña medio");
        }

        else if (tipAnular.y > dipAnular.y && tipAnular.x <= radioXUp && tipAnular.x >= radioXLow && tipAnular.y >= radioYUp && tipAnular.y <= radioYLow && tipAnular3D.z > 0){
            console.log("Comiendo uña anular");
        }

        else if (tipMenique.y > dipMenique.y && tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow && tipMenique3D.z > 0 ){
            console.log("Comiendo uña meñique");
        }

        if (posesHand.length == 2){

            dipPulgar2 = posesHand[0].keypoints[3]
            dipIndice2 = posesHand[0].keypoints[7]
            dipMedio2 = posesHand[0].keypoints[11]
            dipAnular2 = posesHand[0].keypoints[15]
            dipMenique2 = posesHand[0].keypoints[19]

            //Tambien las puntas de los dedos
            tipPulgar2 = posesHand[0].keypoints[4]
            tipPulgar2_3D = posesHand[0].keypoints3D[4]

            tipIndice2 = posesHand[0].keypoints[8]
            tipIndice2_3D = posesHand[0].keypoints3D[8]

            tipMedio2 = posesHand[0].keypoints[12]
            tipMedio2_3D = posesHand[0].keypoints3D[12]

            tipAnular2 = posesHand[0].keypoints[16]
            tipAnular2_3D = posesHand[0].keypoints3D[16]

            tipMenique2 = posesHand[0].keypoints[20]
            tipMenique2_3D = posesHand[0].keypoints3D[20]


            if (tipPulgar2.y > dipPulgar2.y && tipPulgar2.x <= radioXUp && tipPulgar2.x >= radioXLow && tipPulgar2.y >= radioYUp && tipPulgar2.y <= radioYLow && tipPulgar2_3D.z > 0){
                console.log("Comiendo uña pulgar");
            }
            else if (tipIndice2.y > dipIndice2.y && tipIndice2.x <= radioXUp && tipIndice2.x >= radioXLow && tipIndice2.y >= radioYUp && tipIndice2.y <= radioYLow && tipIndice2_3D.z > 0){
                console.log("Comiendo uña indice");
            }
            else if (tipMedio2.y > dipMedio2.y && tipMedio2.x <= radioXUp && tipMedio2.x >= radioXLow && tipMedio2.y >= radioYUp && tipMedio2.y <= radioYLow && tipMedio2_3D.z > 0){
                console.log("Comiendo uña medio");
            }

            else if (tipAnular2.y > dipAnular2.y && tipAnular2.x <= radioXUp && tipAnular2.x >= radioXLow && tipAnular2.y >= radioYUp && tipAnular2.y <= radioYLow && tipAnular2_3D.z > 0){
                console.log("Comiendo uña anular");
            }

            else if (tipMenique2.y > dipMenique2.y && tipMenique2.x <= radioXUp && tipMenique2.x >= radioXLow && tipMenique2.y >= radioYUp && tipMenique2.y <= radioYLow && tipMenique2_3D.z > 0 ){
                console.log("Comiendo uña meñique");
            }

        }
    }
}



module.exports = { init_model_hand , stop_monitoring_hand}