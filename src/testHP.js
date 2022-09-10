const tmImage = require('@teachablemachine/image');
const tf = require('@tensorflow/tfjs')
const handPoseDetection = require('@tensorflow-models/hand-pose-detection');
const poseDetection = require('@tensorflow-models/pose-detection');

//Variables para la ejecución de la webcam y modelo
let modeloHand, modeloBlaze, webcam, detectorHand, detectorBlaze;
//Variable para emplear un cooldown entre notificaciones
let corriendo = false;

//Variables que determinan si la detección del mal habito está encendida.
let onicofagia = false;//comer uñas
let tricotilomania = true;//arrancar pelos

function distancia_puntos(x1, y1, x2, y2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function distancia_puntos3D(x1, y1, z1, x2, y2, z2){
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) ** 0.5
}
//Determinar si la mano está en modo pinza. Para ello las distancia entre el dedo pulgar, indice y medio debe ser menos a 0.55 y la distancia entre
function mano_pinza(pulgar, indice, medio, muñeca){

    avg_distancia_entre_dedos = 0.055
    distancia_muñeca = 0.1

    pulgar_indice = distancia_puntos3D(pulgar.x, pulgar.y, pulgar.z, indice.x, indice.y, indice.z)
    pulgar_medio = distancia_puntos3D(pulgar.x, pulgar.y, pulgar.z, medio.x, medio.y, medio.z)
    indice_medio = distancia_puntos3D(indice.x, indice.y, indice.z, medio.x, medio.y, medio.z)

    indice_muñeca = distancia_puntos3D(indice.x, indice.y, indice.z, muñeca.x, muñeca.y, muñeca.z)

    avg_pinza = (pulgar_indice + pulgar_medio + indice_medio) / 3

    if (indice_muñeca > 0.1 && avg_pinza < avg_distancia_entre_dedos){
        return true
    }

    return false
}

async function init_model_hand() {
    if (!corriendo){
        corriendo = true;
        
        modeloHand = handPoseDetection.SupportedModels.MediaPipeHands;
        detectorHand = await handPoseDetection.createDetector(modeloHand, {runtime : 'tfjs', solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",  modelType : 'full'});

        modeloBlaze = poseDetection.SupportedModels.BlazePose;
        detectorBlaze = await poseDetection.createDetector(modeloBlaze, {runtime : 'tfjs', modelType : 'full'});

        const flip = false;
        const width = 200;
        const height = 200;
        webcam = new tmImage.Webcam(width, height, flip);

        await webcam.setup(); // request access to the webcam
        webcam.play();
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


async function predict() {

    let posesHand, posesBlaze, bocaCenter_x, bocaCenter_y;
    //https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
    posesHand = await detectorHand.estimateHands(webcam.canvas);
    //https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
    posesBlaze = await detectorBlaze.estimatePoses(webcam.canvas);

    
    if (posesBlaze.length != 0 && posesHand.length != 0 /* && (posesBlaze[0].keypoints3D[19].score >= 0.8 || posesBlaze[0].keypoints3D[20].score >= 0.8)*/){

        //Se consideran los puntos, del estimador BlazePose, que serán de utilidad. En este caso los dos puntos de la boca, en coordenadas (x,y) y (x,y,z), los puntos de los indices de la manos, los puntos de los ojos, de los hombros y nariz.
        bocaLeft = posesBlaze[0].keypoints[9]
        bocaRight = posesBlaze[0].keypoints[10]

        bocaLeft3D = posesBlaze[0].keypoints3D[9]
        bocaRight3D = posesBlaze[0].keypoints3D[10]

        ojoLeft3D = posesBlaze[0].keypoints3D[2]
        ojoRight3D = posesBlaze[0].keypoints3D[5]
        //Distancia entre ojos mirando de frente
        distancia_ojos = 0.030

        hombroLeft3D = posesBlaze[0].keypoints3D[11]
        hombroRight3D = posesBlaze[0].keypoints3D[12]

        nariz = posesBlaze[0].keypoints[0]
        nariz3D = posesBlaze[0].keypoints3D[0]

        orejaLeft = posesBlaze[0].keypoints[7]
        orejaRight = posesBlaze[0].keypoints[8]

        orejaLeft3D = posesBlaze[0].keypoints3D[7]
        orejaRight3D = posesBlaze[0].keypoints3D[8]

        //Se define el centro de la boca en base a las coordenadas estimadas
        bocaCenter_x = (bocaLeft.x + bocaRight.x) / 2.0
        bocaCenter_y = (bocaLeft.y + bocaRight.y) / 2.0

        //Se define un radio de detección desde el centro de la boca hasta el coef definido 
        coef = 10;

        radioXUp = bocaCenter_x + coef
        radioXLow = bocaCenter_x - coef

        radioYUp = bocaCenter_y - coef
        radioYLow = bocaCenter_y + coef

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

        muñeca3D = posesHand[0].keypoints3D[0]


/*-----------------------------------------------SECCIÓN DE ONICOFAGÍA-----------------------------------------------*/
        if (onicofagia){
            if (tipPulgar.y >= dipPulgar.y - 8 && tipPulgar.x <= radioXUp && tipPulgar.x >= radioXLow && tipPulgar.y >= radioYUp && tipPulgar.y <= radioYLow && tipPulgar3D.z > 0){
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

            else if (tipMenique.y > dipMenique.y && tipMenique.x <= radioXUp && tipMenique.x >= radioXLow && tipMenique.y >= radioYUp && tipMenique.y <= radioYLow && tipMenique3D.z > 0){
                console.log("Comiendo uña meñique");
            }

            if (posesHand.length == 2){

                dipPulgar2 = posesHand[1].keypoints[3]
                dipIndice2 = posesHand[1].keypoints[7]
                dipMedio2 = posesHand[1].keypoints[11]
                dipAnular2 = posesHand[1].keypoints[15]
                dipMenique2 = posesHand[1].keypoints[19]

                //Tambien las puntas de los dedos
                tipPulgar2 = posesHand[1].keypoints[4]
                tipPulgar2_3D = posesHand[1].keypoints3D[4]

                tipIndice2 = posesHand[1].keypoints[8]
                tipIndice2_3D = posesHand[1].keypoints3D[8]

                tipMedio2 = posesHand[1].keypoints[12]
                tipMedio2_3D = posesHand[1].keypoints3D[12]

                tipAnular2 = posesHand[1].keypoints[16]
                tipAnular2_3D = posesHand[1].keypoints3D[16]

                tipMenique2 = posesHand[1].keypoints[20]
                tipMenique2_3D = posesHand[1].keypoints3D[20]


                if (tipPulgar2.y >= dipPulgar2.y - 8 && tipPulgar2.x <= radioXUp && tipPulgar2.x >= radioXLow && tipPulgar2.y >= radioYUp && tipPulgar2.y <= radioYLow && tipPulgar2_3D.z > 0){
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
/*-----------------------------------------------SECCIÓN DE TRICOTILOMANÍA----------------------------------------------*/
        if (tricotilomania && mano_pinza(tipPulgar3D, tipIndice3D, tipMedio3D, muñeca3D)){

            /*
            bocaCenter3D_x = (bocaRight3D.x + bocaLeft3D.x) / 2;
            bocaCenter3D_y = (bocaRight3D.y + bocaLeft3D.y) / 2;
            bocaCenter3D_z = (bocaRight3D.z + bocaLeft3D.z) / 2; */

            dist_nariz_bocaLeft = distancia_puntos(nariz.x, nariz.y, bocaLeft.x, bocaLeft.y);
            dist_nariz_bocaRight = distancia_puntos(nariz.x, nariz.y, bocaRight.x, bocaRight.y);
            dist_nariz_bocaCentro = distancia_puntos(nariz.x, nariz.y, bocaCenter_x, bocaCenter_y);

            calibracion_perfil = 1
            
            altura = 23/14

            segmento = 2

            //Se plantean 3 casos

            //Mirando de frente
            if (dist_nariz_bocaCentro < dist_nariz_bocaLeft && dist_nariz_bocaCentro < dist_nariz_bocaRight){

                areaDown_x = orejaRight.x - segmento
                areaUp_x = orejaLeft.x + segmento

                areaUp_y = (orejaRight.y + orejaLeft.y) / 2
                areaDown_y = areaUp_y - (areaUp_x - areaDown_x)

                if (tipPulgar.x >= areaDown_x && tipPulgar.x <= areaUp_x && tipPulgar.y >= areaDown_y && tipPulgar.y <= areaUp_y){
                    console.log("Mirando de frente","Tirando el pelo!");
                }
            
            }
            //Mirando hacia la izquierda
            else if (dist_nariz_bocaCentro - calibracion_perfil > dist_nariz_bocaLeft && dist_nariz_bocaCentro < dist_nariz_bocaRight){

                unidad = distancia_puntos(nariz.x, nariz.y, orejaRight.x, orejaRight.y);
                
                areaDown_y = orejaRight.y - altura * unidad
                areaUp_y = orejaRight.y
                
                areaUp_x = orejaRight.x + unidad

                if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y){

                    areaDown_x = orejaRight.x - (orejaRight.y - tipPulgar.y) / altura

                    if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                        console.log("Mirando hacia la izquierda","Tirando el pelo!");
                    }
                }
            }
            //Mirando hacia la derecha
            else if (dist_nariz_bocaCentro < dist_nariz_bocaLeft && dist_nariz_bocaCentro - calibracion_perfil > dist_nariz_bocaRight){

                unidad = distancia_puntos(nariz.x, nariz.y, orejaLeft.x, orejaLeft.y);

                areaDown_y = orejaLeft.y - altura * unidad
                areaUp_y = orejaLeft.y

                areaDown_x = orejaLeft.x - unidad

                if (tipPulgar.y <= areaUp_y && tipPulgar.y >= areaDown_y){

                    areaUp_x = orejaLeft.x + (orejaLeft.y - tipPulgar.y) / altura

                    if (tipPulgar.x <= areaUp_x && tipPulgar.x >= areaDown_x ){
                        console.log("Mirando hacia la derecha","Tirando el pelo!");
                    }
                }
            }
        }       
    }
}



module.exports = {init_model_hand , stop_monitoring_hand}